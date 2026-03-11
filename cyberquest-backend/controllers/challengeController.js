const fs = require('fs');
const path = require('path');
const pool = require('../config/db');


const dataDir = path.join(__dirname, '../../cyberquest-frontend/front-end/src/data');

const getChallengeList = (req, res) => {
    res.json([
        { title: 'Threat Quiz' },
        { title: 'Code Auditor' },
        { title: 'Log Detective' }
    ]);
};


const loadQuestions = (type) => {
    let filename = '';
    if (type === 'Threat Quiz') filename = 'quiz.json';
    else if (type === 'Code Auditor') filename = 'code.json';
    else if (type === 'Log Detective') filename = 'log.json';
    else return null;

    try {
        const raw = fs.readFileSync(path.join(dataDir, filename), 'utf8');
        return JSON.parse(raw);
    } catch (err) {
        console.error(`Failed to read ${filename}:`, err.message);
        return null;
    }
}

const generateQuestion = (req, res) => {
    try {
        const { type, level = 1, index = 0 } = req.body;
        
        const categoryQuestions = loadQuestions(type);
        if (!categoryQuestions) return res.status(400).json({ error: 'Invalid challenge type or data missing' });
        
        
        const levelIndex = (level - 1) % categoryQuestions.length;
        const levelData = categoryQuestions[levelIndex];
        
        
        const qIndex = index % levelData.length;
        
        const q = levelData[qIndex];

        
        res.json({ question: q.question, options: q.options });
    } catch (err) {
        console.error("Fetch Data Error:", err.message);
        res.status(500).json({ error: "Failed to load question data." });
    }
};

const submitAnswer = async (req, res) => {
    try {
        const { type, level = 1, index = 0, selectedAnswer, userEmail } = req.body;
        
        if (!type || !selectedAnswer || !userEmail) {
            return res.status(400).json({ error: 'Missing logic data' });
        }

        const categoryQuestions = loadQuestions(type);
        if (!categoryQuestions) return res.status(400).json({ error: 'Invalid challenge type' });

        const levelIndex = (level - 1) % categoryQuestions.length;
        const levelData = categoryQuestions[levelIndex];
        const qIndex = index % levelData.length;
        
        const q = levelData[qIndex];
        
        const correct = (q.correctAnswer === selectedAnswer);
        
        let baseXP = type === 'Code Auditor' ? 150 : 100;
        let multiplier = 1;
        if (Number(level) === 2) multiplier = 1.5;
        if (Number(level) === 3) multiplier = 2;
        
        const xpEarned = correct ? Math.round(baseXP * multiplier) : 0;
        
        
        if (correct) {
            await pool.query(
                `UPDATE users SET total_xp = total_xp + $1, challenges_completed = challenges_completed + 1 WHERE email = $2`,
                [xpEarned, userEmail]
            );
        }

        res.json({
            correct,
            explanation: q.explanation,
            correctAnswer: q.correctAnswer,
            xpEarned
        });
    } catch (err) {
        console.error("Submit Answer Error:", err.message);
        res.status(500).json({ error: "Failed to verify answer." });
    }
};

module.exports = { getChallengeList, generateQuestion, submitAnswer };
