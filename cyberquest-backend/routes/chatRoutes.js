const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chatController');
const { verifyToken } = require('../middleware/authMiddleware');

// Protected: only logged-in users can use the AI chatbot
router.post('/', verifyToken, handleChat);

module.exports = router;