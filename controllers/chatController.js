const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const handleChat = async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ error: "Message is required" });
        }

        console.log(`🧠 CyberGuard received: "${userMessage}"`);

        // We use the most basic, stable model call possible
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        // The Hacker Approach: Manually inject the rules into the string
        const combinedPrompt = `
You are CyberGuard, an elite AI Security Copilot for CyberQuest.
Always base your legal advice on the Indian IT Act 2000. Keep your answers under 80 words.

User Question: ${userMessage}
`;

        const result = await model.generateContent(combinedPrompt);
        const aiResponse = result.response.text();

        console.log("🤖 CyberGuard replied successfully!");
        
        res.json({ reply: aiResponse });

    } catch (error) {
        console.error("Gemini API Error:", error.message);
        res.status(500).json({ error: "CyberGuard is currently offline." });
    }
};

module.exports = { handleChat };