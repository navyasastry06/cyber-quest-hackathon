require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const pool = require('./config/db');
const app = express();

// Middleware
app.use(express.json());

// ✅ Single, consolidated CORS config (no more wildcard override)
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://mail.google.com'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
}));

// ✅ Global rate limiter — 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again later.' }
});
app.use(globalLimiter);

// ✅ Tight rate limiter for AI scan endpoint — 15 requests per 15 minutes
const scanLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Scan limit reached. Please wait before scanning again.' }
});

// Route Imports
const chatRoutes = require('./routes/chatRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const vaultidRoutes = require('./routes/vaultRoutes');
const challengeRoutes = require('./routes/challengeRoutes');

// Route Registrations
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/vaultid', scanLimiter, vaultidRoutes); // AI route gets its own tight limiter

app.get('/api/health', (req, res) => {
    res.json({ message: "CyberQuest Backend is running smoothly!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});