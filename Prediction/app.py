from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import joblib

# Load model and encoders
model = tf.keras.models.load_model("spoilage_model")
food_encoder = joblib.load("food_encoder.pkl")
risk_encoder = joblib.load("risk_encoder.pkl")

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    food_type = data['food_type']
    hours = data['hours_since_prepared']

    # Encode food type
    food_encoded = food_encoder.transform([food_type])[0]
    input_data = np.array([[food_encoded, hours]])

    # Make prediction
    prediction = model.predict(input_data)
    predicted_class = np.argmax(prediction)
    risk_label = risk_encoder.inverse_transform([predicted_class])[0]

    return jsonify({
        'spoilage_risk': risk_label
    })

if __name__ == '__main__':
    app.run(debug=True)
