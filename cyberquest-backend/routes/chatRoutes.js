const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chatController');
const { verifyToken } = require('../middleware/authMiddleware');


router.post('/', verifyToken, handleChat);

module.exports = router;