const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini (Ensure GEMINI_API_KEY is in your .env file)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/scan', async (req, res) => {
    try {
        const { senderEmail } = req.body;
        console.log(`[VaultID] Scanning incoming target: ${senderEmail}`);

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        You are VaultID, a cybersecurity AI. Analyze this sender email address: "${senderEmail}".
        1. Is it a free provider (gmail, yahoo) or a corporate domain?
        2. Does it look like typosquatting (e.g., rnicrosoft.com instead of microsoft.com)?
        3. Give a Trust Score from 0 to 100.
        
        Respond ONLY in this exact JSON format:
        {"trustScore": 85, "analysis": "Short 10-word explanation of risk"}
        `;

        const result = await model.generateContent(prompt);
        let aiResponse = result.response.text();
        
        // Clean the response to ensure it's pure JSON
        aiResponse = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedData = JSON.parse(aiResponse);

        console.log("[VaultID] AI Analysis Complete:", parsedData);
        res.json(parsedData);

    } catch (error) {
        console.error("VaultID AI Error:", error);
        res.status(500).json({ trustScore: 0, analysis: "AI offline. Proceed with caution." });
    }
});

module.exports = router;