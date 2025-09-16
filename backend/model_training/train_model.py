# train_model.py
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os

# reproducibility
SEED = 42
np.random.seed(SEED)
tf.random.set_seed(SEED)

# paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "spoilage_data_expanded.csv")  # use expanded dataset
MODEL_PATH = os.path.join(BASE_DIR, "spoilage_model.h5")
OHE_PATH = os.path.join(BASE_DIR, "food_ohe.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "hours_scaler.pkl")
INVERSE_MAP_PATH = os.path.join(BASE_DIR, "inverse_risk_mapping.pkl")

# load data
df = pd.read_csv(CSV_PATH)

# risk mapping (explicit order)
risk_mapping = {"Low": 0, "Medium": 1, "High": 2}
inverse_risk_mapping = {v: k for k, v in risk_mapping.items()}
df['y'] = df['Spoilage_Risk'].map(risk_mapping)

# one-hot encode Food_Type
ohe = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
X_food = ohe.fit_transform(df[['Food_Type']])

# scale Hours
scaler = StandardScaler()
X_hours = scaler.fit_transform(df[['Hours_Since_Prepared']])

# combine features
X = np.hstack([X_food, X_hours])
y = df['y'].values

# train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=SEED, stratify=y
)

# build model
input_shape = X_train.shape[1]
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(input_shape,)),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(3, activation='softmax')  # 3 classes
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# early stopping
es = tf.keras.callbacks.EarlyStopping(
    monitor='val_loss', patience=15, restore_best_weights=True
)

# train
history = model.fit(
    X_train, y_train,
    validation_data=(X_test, y_test),
    epochs=300,
    batch_size=8,
    callbacks=[es],
    verbose=1
)

# evaluate
y_pred = np.argmax(model.predict(X_test), axis=1)
print("✅ Test accuracy:", accuracy_score(y_test, y_pred))
print("✅ Classification report:\n", classification_report(y_test, y_pred, target_names=["Low","Medium","High"]))

# save model and preprocessors
model.save(MODEL_PATH)
joblib.dump(ohe, OHE_PATH)
joblib.dump(scaler, SCALER_PATH)
joblib.dump(inverse_risk_mapping, INVERSE_MAP_PATH)

print("\n📦 Saved files:")
print(" -", MODEL_PATH)
print(" -", OHE_PATH)
print(" -", SCALER_PATH)
print(" -", INVERSE_MAP_PATH)
