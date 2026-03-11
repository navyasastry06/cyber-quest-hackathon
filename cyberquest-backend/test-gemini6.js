require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
    try {
        console.log("Starting generation with gemini-2.5-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent("Hello!");
        console.log("Success:", result.response.text());
        process.exit(0);
    } catch (e) {
        console.error("Error with gemini-2.5-flash:", e.message);
        process.exit(1);
    }
}
setTimeout(() => { console.log("Timeout reached 20s"); process.exit(1); }, 20000);
test();
