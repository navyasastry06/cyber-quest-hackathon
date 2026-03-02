require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const app = express();

app.use(express.json());

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST']
}));

// Import your new Chat Router
const chatRoutes = require('./routes/chatRoutes');
const authRoutes = require('./routes/authRoutes');

// Tell the app to use the auth routes
app.use('/api/auth', authRoutes);

// Tell the server to use the router for anything going to /api/chat
app.use('/api/chat', chatRoutes);

app.get('/api/health', (req, res) => {
    res.json({ message: "CyberQuest Backend is running smoothly!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});