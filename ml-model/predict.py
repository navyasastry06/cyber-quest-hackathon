import joblib
import pandas as pd

# Load saved model
model = joblib.load("intrusion_model.pkl")

# Define feature names EXACTLY as training
columns = [
    "duration", "src_bytes", "dst_bytes",
    "failed_logins", "logged_in",
    "num_compromised", "count",
    "srv_serror_rate"
]

# Create sample traffic as DataFrame
sample = pd.DataFrame([[1, 12000, 50, 0, 0, 0, 220, 0.92]], columns=columns)

prediction = model.predict(sample)

print("Predicted Attack Type:", prediction[0])