from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import random
import os
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# ==========================
# Gemini Configuration
# ==========================

API_KEY = os.getenv("GOOGLE_API_KEY")

if API_KEY:
    genai.configure(api_key=API_KEY)
    gemini_model = genai.GenerativeModel("gemini-pro")
else:
    gemini_model = None


# ==========================
# Load ML Model
# ==========================

model = joblib.load("intrusion_model.pkl")

network_health = 100

columns = [
    "duration",
    "src_bytes",
    "dst_bytes",
    "failed_logins",
    "logged_in",
    "num_compromised",
    "count",
    "srv_serror_rate"
]


# ==========================
# Gemini Explanation
# ==========================

def explain_attack(attack, traffic):

    if gemini_model is None:
        return fallback_explanation(attack)

    prompt = f"""
Explain briefly why this network traffic indicates a {attack} cyber attack.

Traffic Data:
Duration: {traffic['duration']}
Source Bytes: {traffic['src_bytes']}
Destination Bytes: {traffic['dst_bytes']}
Failed Logins: {traffic['failed_logins']}
Logged In: {traffic['logged_in']}
Compromised Accounts: {traffic['num_compromised']}
Connection Count: {traffic['count']}
Server Error Rate: {traffic['srv_serror_rate']}

Explain in one short sentence.
"""

    try:
        response = gemini_model.generate_content(prompt)
        return response.text
    except:
        return fallback_explanation(attack)


# ==========================
# Fallback Explanation
# ==========================

def fallback_explanation(attack):

    explanations = {

        "DoS":
        "Large traffic spikes and high server error rates suggest a Denial of Service attack.",

        "Probe":
        "Multiple connection attempts with small data transfers suggest network scanning behaviour.",

        "R2L":
        "Repeated failed login attempts indicate a remote attacker trying to access the system.",

        "U2R":
        "A logged-in user performing privilege escalation suggests a user-to-root attack.",

        "Normal":
        "Traffic patterns appear normal with no indicators of malicious behaviour."

    }

    return explanations.get(attack, "No explanation available.")


# ==========================
# Generate Balanced Traffic
# ==========================

def generate_traffic():

    attack_type = random.choice(["DoS", "Probe", "R2L", "U2R", "Normal"])

    if attack_type == "DoS":

        traffic = {
            "duration": random.randint(1,3),
            "src_bytes": random.randint(9000,15000),
            "dst_bytes": random.randint(0,100),
            "failed_logins": 0,
            "logged_in": 0,
            "num_compromised": 0,
            "count": random.randint(200,250),
            "srv_serror_rate": round(random.uniform(0.85,1.0),2)
        }

    elif attack_type == "Probe":

        traffic = {
            "duration": random.randint(5,10),
            "src_bytes": random.randint(100,800),
            "dst_bytes": random.randint(50,300),
            "failed_logins": 0,
            "logged_in": 0,
            "num_compromised": 0,
            "count": random.randint(120,180),
            "srv_serror_rate": round(random.uniform(0.1,0.3),2)
        }

    elif attack_type == "R2L":

        traffic = {
            "duration": random.randint(5,15),
            "src_bytes": random.randint(200,1500),
            "dst_bytes": random.randint(100,600),
            "failed_logins": random.randint(7,12),
            "logged_in": 0,
            "num_compromised": 0,
            "count": random.randint(20,80),
            "srv_serror_rate": round(random.uniform(0.2,0.5),2)
        }

    elif attack_type == "U2R":

        traffic = {
            "duration": random.randint(5,10),
            "src_bytes": random.randint(2000,6000),
            "dst_bytes": random.randint(100,400),
            "failed_logins": 0,
            "logged_in": 1,
            "num_compromised": random.randint(3,6),
            "count": random.randint(30,90),
            "srv_serror_rate": round(random.uniform(0.2,0.5),2)
        }

    else:  # Normal

        traffic = {
            "duration": random.randint(1,10),
            "src_bytes": random.randint(50,600),
            "dst_bytes": random.randint(50,600),
            "failed_logins": 0,
            "logged_in": 1,
            "num_compromised": 0,
            "count": random.randint(10,40),
            "srv_serror_rate": round(random.uniform(0.0,0.2),2)
        }

    return traffic


# ==========================
# Simulation Endpoint
# ==========================

@app.route("/simulate", methods=["GET"])
def simulate():

    global network_health

    player_choice = request.args.get("choice")

    traffic = generate_traffic()

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

    explanation = explain_attack(prediction, traffic)

    result = None
    score_change = 0

    if player_choice:

        if player_choice == prediction:
            result = "Correct"
            score_change = 10
            network_health = min(100, network_health + 5)

        else:
            result = "Wrong"
            score_change = -5
            network_health = max(0, network_health - 10)

    if network_health >= 70:
        network_status = "Secure"
    elif network_health >= 40:
        network_status = "Warning"
    else:
        network_status = "Critical"

    return jsonify({

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