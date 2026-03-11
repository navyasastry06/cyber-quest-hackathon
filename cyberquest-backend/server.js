require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const pool = require('./config/db');
const app = express();


app.use(express.json());


app.use(cors());


const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again later.' }
});
app.use(globalLimiter);


const scanLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Scan limit reached. Please wait before scanning again.' }
});


const chatRoutes = require('./routes/chatRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const vaultidRoutes = require('./routes/vaultRoutes');
const challengeRoutes = require('./routes/challengeRoutes');


app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/vaultid', scanLimiter, vaultidRoutes); 

app.get('/api/health', (req, res) => {
    res.json({ message: "CyberQuest Backend is running smoothly!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});