# CyberQuest Hackathon Project

Welcome to CyberQuest! This project is an interactive, gamified cybersecurity platform designed to teach users about cybersecurity concepts through various challenges, simulations, and real-time AI tools. 

## 🚀 Features

The platform consists of several distinct game modes and tools:

1. **Training Arena (Challenges)**
   - Answer cybersecurity quizzes and interactive challenges.
   - Earn XP based on difficulty levels (Easy, Medium, Hard).
   - *React Frontend + Node.js Backend*

2. **Virtual Inbox Simulation**
   - Simulated email inbox where users must identify Phishing emails vs. Legitimate emails.
   - *React Frontend + Node.js Backend*

3. **Attack Surface Management**
   - A grid of servers where vulnerabilities periodically pop up (Open Ports, Missing Patches, etc.).
   - Players must quickly apply the corresponding mitigation to secure the node.
   - *React Frontend*

4. **Identity Timeline Analytics**
   - Simulate a SOC Incident Responder watching a live Active Directory log feed.
   - Watch for anomalies (like Impossible Travel) and proactively "Lock Account".
   - *React Frontend*

5. **AI Intrusion Detection**
   - A Machine Learning model that analyzes raw network traffic data and predicts attacks (DoS, Probe, U2R, R2L, Normal).
   - Powered by Scikit-Learn (RandomForest) with an AI breakdown via Gemini 2.5 Flash.
   - *Python Flask Backend + React Frontend*

6. **CyberQuest AI Copilot**
   - An integrated chatbot powered by Google's Gemini 2.5 Flash API to help answer cybersecurity questions in real-time.
   - *Node.js Backend (Gemini API) + React Frontend*

7. **VaultID Gmail Extension**
   - A Chrome extension that injects an "Identity Scan" button directly into Gmail.
   - Uses AI (Gemini) to analyze the email content and headers to warn users if the email is a phishing attempt.
   - *Chrome Extension + Node.js Backend*

---

## 🏗️ Architecture Stack

This project is a monorepo consisting of 4 main parts:

*   **`cyberquest-frontend/front-end/`**: A React application built with Vite and TailwindCSS.
*   **`cyberquest-backend/`**: A Node.js / Express backend using PostgreSQL (via Supabase) for user data, XP tracking, and API routes for Gemini.
*   **`ml-model/`**: A Python / Flask server running a pre-trained scikit-learn model for the Intrusion Detection game.
*   **`vaultid-extention/`**: A Chrome extension (Manifest V3) for Gmail integration.

---

## 💻 Running the Project Locally

To run the full stack locally, you will need to open **three separate terminal windows** and run the following commands in each.

*(Note: Ensure you have Node.js and Python 3.10+ installed).*

### 1. Start the Node.js Backend
```bash
cd cyberquest-backend
npm install
npm run dev
```
*Runs on `http://localhost:5000`*

### 2. Start the React Frontend
Open a new terminal:
```bash
cd cyberquest-frontend/front-end
npm install
npm run dev
```
*Runs on `http://localhost:5173`*

### 3. Start the Machine Learning API
Open a new terminal:
```bash
cd ml-model
pip install -r requirements.txt
python app.py
```
*Runs on `http://127.0.0.1:5001`*

### 4. Install the Gmail Extension
1. Open Google Chrome.
2. Navigate to `chrome://extensions/`.
3. Enable **Developer mode** (toggle in the top right).
4. Click **Load unpacked**.
5. Select the `vaultid-extention` folder from this repository.
6. Open Gmail to see the "Identity Scan" button injected into your emails.

---

## 🔑 Environment Variables (.env)
You will need to set up your `.env` files for the backends.

**In `cyberquest-backend/.env`:**
```env
PORT=5000
DATABASE_URL=postgresql://<user>:<password>@<db-host>:<port>/<dbname>
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_google_gemini_api_key_here
```

**In `ml-model/.env` (Optional if loaded via system env):**
```env
GOOGLE_API_KEY=your_google_gemini_api_key_here
```

---

## 🛠️ Built With

*   **Frontend**: React, React Router, TailwindCSS, Lucide-React, Lottie-React
*   **Backend**: Node.js, Express, PostgreSQL, Prisma/Supabase, JSON Web Tokens (JWT)
*   **Machine Learning**: Python, Flask, Pandas, Scikit-Learn
*   **AI**: Google Generative AI (Gemini 2.5 Flash)
