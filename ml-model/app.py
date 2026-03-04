from flask import Flask, request, jsonify
import joblib
import pandas as pd
import random

app = Flask(__name__)

# Load trained model
model = joblib.load("intrusion_model.pkl")

# Network health system
network_health = 100

# Feature order (MUST match training)
columns = [
    "duration", "src_bytes", "dst_bytes",
    "failed_logins", "logged_in",
    "num_compromised", "count",
    "srv_serror_rate"
]

# ==========================
# Attack Explanation Function
# ==========================
def explain_attack(attack):
    explanations = {
        "DoS": "High traffic volume and server error rates suggest a Denial of Service attack.",
        "Probe": "Suspicious scanning behaviour indicates possible reconnaissance activity.",
        "R2L": "Multiple failed login attempts suggest a Remote-to-Local intrusion attempt.",
        "U2R": "Privilege escalation behaviour detected indicating a User-to-Root attack.",
        "Normal": "Traffic appears normal with no suspicious indicators."
    }

    return explanations.get(attack, "No explanation available.")


@app.route("/")
def home():
    return "Intrusion Detection API Running "


# ==========================
# Manual Prediction API
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

    explanation = explain_attack(prediction)

    return jsonify({
        "prediction": prediction,
        "confidence": f"{confidence:.2f}%",
        "explanation": explanation
    })


# ==========================
# Gamified Simulation API
# ==========================
@app.route("/simulate", methods=["GET"])
def simulate():

    global network_health

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

    else:  # medium difficulty
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

    explanation = explain_attack(prediction)

    # --------------------------
    # Game Logic
    # --------------------------
    result = None
    score_change = 0

    if player_choice:

        if player_choice == prediction:
            result = "Correct"
            score_change = 15 if difficulty == "hard" else 10
            network_health = min(100, network_health + 5)

        else:
            result = "Wrong"
            score_change = -10 if difficulty == "hard" else -5
            network_health = max(0, network_health - 10)

    # --------------------------
    # Network Status
    # --------------------------
    if network_health >= 70:
        network_status = "Secure"
    elif network_health >= 40:
        network_status = "Warning"
    else:
        network_status = "Critical"

    # --------------------------
    # Response
    # --------------------------
    return jsonify({
        "difficulty": difficulty,
        "traffic": traffic,
        "actual_prediction": prediction,
        "confidence": f"{confidence:.2f}%",
        "explanation": explanation,
        "player_choice": player_choice,
        "result": result,
        "score_change": score_change,
        "network_health": network_health,
        "network_status": network_status
    })


if __name__ == "__main__":
    app.run(debug=True)