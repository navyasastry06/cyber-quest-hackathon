import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

print("Loading dataset...")

data = pd.read_csv("intrusion_250.csv")

X = data.drop("label", axis=1)
y = data["label"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print("Training model...")

model = RandomForestClassifier(n_estimators=50)
model.fit(X_train, y_train)

print("Model trained. Making predictions...")

pred = model.predict(X_test)

print("\nClassification Report:\n")
print(classification_report(y_test, pred))
import joblib


joblib.dump(model, "intrusion_model.pkl")

print("\nModel saved as intrusion_model.pkl")