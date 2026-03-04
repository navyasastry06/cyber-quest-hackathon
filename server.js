require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST']
}));
app.use(express.json());

// Import your new Chat Router
const chatRoutes = require('./routes/chatRoutes');

// Tell the server to use the router for anything going to /api/chat
app.use('/api/chat', chatRoutes);

app.get('/api/health', (req, res) => {
    res.json({ message: "CyberQuest Backend is running smoothly!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});