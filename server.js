require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();


app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST']
}));
app.use(express.json());


const chatRoutes = require('./routes/chatRoutes');


app.use('/api/chat', chatRoutes);

app.get('/api/health', (req, res) => {
    res.json({ message: "CyberQuest Backend is running smoothly!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});