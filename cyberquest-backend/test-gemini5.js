require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
    try {
        console.log("Starting generation with gemini-flash-latest...");
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent("Hello!");
        console.log("Success:", result.response.text());
        process.exit(0);
    } catch (e) {
        console.error("Error with gemini-flash-latest:", e.message);
        process.exit(1);
    }
}
setTimeout(() => { console.log("Timeout reached 20s"); process.exit(1); }, 20000);
test();
