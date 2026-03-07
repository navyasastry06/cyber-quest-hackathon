const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verifyToken } = require('../middleware/authMiddleware');

// 1. UPDATE XP & METRICS — protected by JWT
router.patch('/update-xp', verifyToken, async (req, res) => {
    const { email, xpGain, wasCorrect, isPhishing, isChallenge } = req.body;

    // ✅ Input validation
    if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'A valid email is required.' });
    }
    if (typeof xpGain !== 'number' || xpGain < 0) {
        return res.status(400).json({ error: 'xpGain must be a non-negative number.' });
    }

    try {
        let query;
        let queryParams;

        if (isChallenge) {
            query = `UPDATE users SET total_xp = total_xp + $1, challenges_completed = challenges_completed + 1 WHERE email = $2 RETURNING *`;
            queryParams = [xpGain, email];
        } else {
            const detectedInc = (wasCorrect && isPhishing) ? 1 : 0;
            const clickedInc = (!wasCorrect && isPhishing) ? 1 : 0;
            query = `UPDATE users SET total_xp = total_xp + $1, phishing_detected = phishing_detected + $2, emails_clicked = emails_clicked + $3 WHERE email = $4 RETURNING *`;
            queryParams = [xpGain, detectedInc, clickedInc, email];
        }

        const result = await pool.query(query, queryParams);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(200).json({ success: true, stats: result.rows[0] });
    } catch (err) {
        console.error('[userRoutes] update-xp error:', err.message);
        res.status(500).json({ error: 'Failed to update player progress' });
    }
});

// 2. STATS for dashboard — public
router.get('/stats/:email', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT username, email, total_xp, phishing_detected, emails_clicked, challenges_completed FROM users WHERE email = $1',
            [req.params.email]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('[userRoutes] stats error:', err.message);
        res.status(500).json({ error: 'Database fetch failed' });
    }
});

// 3. LEADERBOARD — public
router.get('/leaderboard', async (req, res) => {
    try {
        const result = await pool.query('SELECT username, total_xp FROM users ORDER BY total_xp DESC LIMIT 5');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('[userRoutes] leaderboard error:', err.message);
        res.status(500).json({ error: 'Leaderboard unavailable' });
    }
});

// 4. DELETE account — protected by JWT
router.delete('/delete', verifyToken, async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    try {
        const result = await pool.query('DELETE FROM users WHERE email = $1', [email]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ success: true, message: 'Identity purged.' });
    } catch (err) {
        console.error('[userRoutes] delete error:', err.message);
        res.status(500).json({ error: 'Deletion failed' });
    }
});

module.exports = router;