require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function list() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        const names = data.models.map(m => m.name);
        console.log(names.filter(n => n.includes('gemini')).join('\n'));
    } catch(e) {
        console.error(e);
    }
}
list();
