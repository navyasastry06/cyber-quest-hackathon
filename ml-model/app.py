from flask import Flask, request, jsonify
import joblib
import pandas as pd
import random

app = Flask(__name__)

# Load trained model
model = joblib.load("intrusion_model.pkl")

# Feature order (MUST match training)
columns = [
    "duration", "src_bytes", "dst_bytes",
    "failed_logins", "logged_in",
    "num_compromised", "count",
    "srv_serror_rate"
]

@app.route("/")
def home():
    return "Intrusion Detection API Running 🚀"


# ==========================
# 🔹 Manual Prediction API
# ==========================
@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    input_data = pd.DataFrame([[
        data["duration"],
        data["src_bytes"],
        data["dst_bytes"],
        data["failed_logins"],
        data["logged_in"],
        data["num_compromised"],
        data["count"],
        data["srv_serror_rate"]
    ]], columns=columns)

    prediction = model.predict(input_data)[0]
    probabilities = model.predict_proba(input_data)
    confidence = max(probabilities[0]) * 100

    return jsonify({
        "prediction": prediction,
        "confidence": f"{confidence:.2f}%"
    })


# ==========================
# 🎮 Gamified Simulation API
# ==========================
@app.route("/simulate", methods=["GET"])
def simulate():

    difficulty = request.args.get("difficulty", "medium")
    player_choice = request.args.get("choice")

    # --------------------------
    # Generate traffic by difficulty
    # --------------------------
    if difficulty == "easy":
        traffic = {
            "duration": random.randint(0, 3),
            "src_bytes": random.randint(8000, 15000),
            "dst_bytes": random.randint(0, 200),
            "failed_logins": 0,
            "logged_in": 0,
            "num_compromised": 0,
            "count": random.randint(180, 250),
            "srv_serror_rate": round(random.uniform(0.8, 1.0), 2)
        }

    elif difficulty == "hard":
        traffic = {
            "duration": random.randint(5, 15),
            "src_bytes": random.randint(1000, 9000),
            "dst_bytes": random.randint(200, 900),
            "failed_logins": random.randint(1, 7),
            "logged_in": random.randint(0, 1),
            "num_compromised": random.randint(1, 4),
            "count": random.randint(30, 180),
            "srv_serror_rate": round(random.uniform(0.3, 0.9), 2)
        }

    else:  # medium (default)
        traffic = {
            "duration": random.randint(0, 15),
            "src_bytes": random.randint(50, 15000),
            "dst_bytes": random.randint(0, 1200),
            "failed_logins": random.randint(0, 8),
            "logged_in": random.randint(0, 1),
            "num_compromised": random.randint(0, 5),
            "count": random.randint(1, 250),
            "srv_serror_rate": round(random.uniform(0.0, 1.0), 2)
        }

    # --------------------------
    # Predict using ML model
    # --------------------------
    input_data = pd.DataFrame([[
        traffic["duration"],
        traffic["src_bytes"],
        traffic["dst_bytes"],
        traffic["failed_logins"],
        traffic["logged_in"],
        traffic["num_compromised"],
        traffic["count"],
        traffic["srv_serror_rate"]
    ]], columns=columns)

    prediction = model.predict(input_data)[0]
    probabilities = model.predict_proba(input_data)
    confidence = max(probabilities[0]) * 100

    # --------------------------
    # Game Logic (Score System)
    # --------------------------
    result = None
    score_change = 0

    if player_choice:
        if player_choice == prediction:
            result = "Correct"
            score_change = 15 if difficulty == "hard" else 10
        else:
            result = "Wrong"
            score_change = -10 if difficulty == "hard" else -5

    # --------------------------
    # Return Response
    # --------------------------
    return jsonify({
        "difficulty": difficulty,
        "traffic": traffic,
        "actual_prediction": prediction,
        "confidence": f"{confidence:.2f}%",
        "player_choice": player_choice,
        "result": result,
        "score_change": score_change
    })


if __name__ == "__main__":
    app.run(debug=True)