require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'https://mail.google.com'],
    methods: ['GET', 'POST', 'PATCH'] // Critical for XP updates
}));

// Route Imports
const chatRoutes = require('./routes/chatRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // New import
const vaultidRoutes = require('./routes/vaultRoutes');

// Route Registrations
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes); // Now /api/user/stats/:email will work!
app.use('/api/vaultid', vaultidRoutes);

app.get('/api/health', (req, res) => {
    res.json({ message: "CyberQuest Backend is running smoothly!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});