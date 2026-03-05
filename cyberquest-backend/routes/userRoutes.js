const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Ensure this points to your db config

// 1. UPDATE XP & METRICS
router.patch('/update-xp', async (req, res) => {
    const { email, xpGain, wasCorrect, isPhishing, isChallenge } = req.body; 
    
    try {
        let query;
        let queryParams;

        if (isChallenge) {
            query = `
                UPDATE users 
                SET total_xp = total_xp + $1, 
                    challenges_completed = challenges_completed + 1 
                WHERE email = $2 
                RETURNING total_xp, phishing_detected, emails_clicked`;
            queryParams = [xpGain, email];
        } else {
            const detectedInc = (wasCorrect && isPhishing) ? 1 : 0;
            const clickedInc = (!wasCorrect && isPhishing) ? 1 : 0;

            query = `
                UPDATE users 
                SET total_xp = total_xp + $1, 
                    phishing_detected = phishing_detected + $2, 
                    emails_clicked = emails_clicked + $3
                WHERE email = $4 
                RETURNING total_xp, phishing_detected, emails_clicked`;
            queryParams = [xpGain, detectedInc, clickedInc, email];
        }
            
        const result = await pool.query(query, queryParams);
        res.status(200).json({ success: true, stats: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update player progress" });
    }
});

// 2. GET STATS FOR DASHBOARD
router.get('/stats/:email', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT username, total_xp, phishing_detected, emails_clicked, challenges_completed FROM users WHERE email = $1',
            [req.params.email]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Database fetch failed" });
    }
});

// 3. GET LEADERBOARD
router.get('/leaderboard', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT username, total_xp FROM users ORDER BY total_xp DESC LIMIT 5'
        );
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Leaderboard unavailable" });
    }
});

module.exports = router; // <--- CRITICAL: Don't miss this!