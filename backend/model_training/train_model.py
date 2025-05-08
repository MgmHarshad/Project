import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split

# Load data
df = pd.read_csv("spoilage_data.csv")

# Encode food type
food_encoder = LabelEncoder()
df['food_type_encoded'] = food_encoder.fit_transform(df['Food_Type'])

# Encode spoilage risk (target)
risk_encoder = LabelEncoder()
df['spoilage_risk_encoded'] = risk_encoder.fit_transform(df['Spoilage_Risk'])

# Features and target
X = df[['food_type_encoded', 'Hours_Since_Prepared']]
y = df['spoilage_risk_encoded']

# Split for training/testing
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Build a small neural network
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(2,)),  # 2 features
    tf.keras.layers.Dense(16, activation='relu'),
    tf.keras.layers.Dense(8, activation='relu'),
    tf.keras.layers.Dense(3, activation='softmax')  # 3 classes: Low, Medium, High
])

model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(X_train, y_train, epochs=50, batch_size=4, validation_data=(X_test, y_test))

# Save the model in TensorFlow SavedModel format
model.save("spoilage_model.h5")



# Also save encoders for later (if needed)
import joblib
joblib.dump(food_encoder, "food_encoder.pkl")
joblib.dump(risk_encoder, "risk_encoder.pkl")

print("✅ Model and encoders saved!")
