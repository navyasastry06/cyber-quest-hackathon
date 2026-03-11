import joblib
import pandas as pd


model = joblib.load("intrusion_model.pkl")


columns = [
    "duration", "src_bytes", "dst_bytes",
    "failed_logins", "logged_in",
    "num_compromised", "count",
    "srv_serror_rate"
]


sample = pd.DataFrame([[1, 12000, 50, 0, 0, 0, 220, 0.92]], columns=columns)

prediction = model.predict(sample)

print("Predicted Attack Type:", prediction[0])