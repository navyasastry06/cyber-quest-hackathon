const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chatController');

// When the frontend sends a POST request here, trigger the Gemini logic
router.post('/', handleChat);

module.exports = router;