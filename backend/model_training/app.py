# app.py
from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import joblib
import pandas as pd
from flask_cors import CORS
import os

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "spoilage_model.h5")
OHE_PATH = os.path.join(BASE_DIR, "food_ohe.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "hours_scaler.pkl")
INVERSE_MAP_PATH = os.path.join(BASE_DIR, "inverse_risk_mapping.pkl")
CSV_PATH = os.path.join(BASE_DIR, "spoilage_data_expanded.csv")

# Load model + preprocessors
model = tf.keras.models.load_model(MODEL_PATH)
ohe = joblib.load(OHE_PATH)
scaler = joblib.load(SCALER_PATH)
inverse_risk_mapping = joblib.load(INVERSE_MAP_PATH)

# Load expanded dataset (used only to derive threshold hours)
df = pd.read_csv(CSV_PATH)

# Normalize food type strings to reduce mismatches (case/whitespace)
def _normalize_food(s):
    if pd.isna(s):
        return s
    return str(s).strip().lower()

df['Food_Type_Norm'] = df['Food_Type'].apply(_normalize_food)

# Build per-food earliest thresholds for Medium and High (use MIN)
# This ensures "next threshold" is the earliest hour the risk becomes that level.
thresholds_min = {}
for food_norm in df['Food_Type_Norm'].unique():
    food_df = df[df['Food_Type_Norm'] == food_norm]
    med_min = food_df[food_df['Spoilage_Risk'] == 'Medium']['Hours_Since_Prepared'].min()
    high_min = food_df[food_df['Spoilage_Risk'] == 'High']['Hours_Since_Prepared'].min()
    thresholds_min[food_norm] = {
        'Medium_min': float(med_min) if pd.notna(med_min) else None,
        'High_min': float(high_min) if pd.notna(high_min) else None
    }

app = Flask(__name__)
CORS(app)

# Helper to compute remaining_fresh_hours
def get_remaining_fresh_hours(food_type, hours, current_risk):
    """
    Returns hours remaining until the food reaches High risk.
    - Uses earliest High threshold per food (High_min) from the expanded dataset.
    - If High_min not available for the food, returns None.
    - If already at/after High_min, returns 0.0.
    """
    # use normalized key for lookup
    th = thresholds_min.get(_normalize_food(food_type))
    if not th:
        return None

    high_cut = th.get('High_min')
    if high_cut is None:
        return None

    # Remaining time until High risk threshold (monotonic with hours)
    remaining = float(high_cut) - float(hours)

    # Enforce monotonicity: remaining time cannot be negative
    if remaining <= 0:
        return 0.0
    return round(remaining, 2)


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON payload received"}), 400

    food_type = data.get("food_type")
    hours_raw = data.get("hours_since_prepared")

    if food_type is None or hours_raw is None:
        return jsonify({"error": "Please provide 'food_type' and 'hours_since_prepared'"}), 400

    try:
        hours = float(hours_raw)
    except Exception:
        return jsonify({"error": "'hours_since_prepared' must be numeric"}), 400

    # Preprocess input
    food_ohe = ohe.transform([[food_type]])          # handle_unknown='ignore' => unseen -> zeros
    hours_scaled = scaler.transform([[hours]])
    input_data = np.hstack([food_ohe, hours_scaled])  # shape (1, n_features)

    # Predict using the model
    probs = model.predict(input_data, verbose=0)[0]
    pred_class = int(np.argmax(probs))
    risk_label = inverse_risk_mapping.get(pred_class)

    # Compute remaining_fresh_hours using earliest thresholds (MIN)
    remaining_fresh_hours = get_remaining_fresh_hours(food_type, hours, risk_label)

    return jsonify({
        "spoilage_risk": risk_label,
        "remaining_fresh_hours": remaining_fresh_hours
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)