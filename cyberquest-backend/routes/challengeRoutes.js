const express = require('express');
const router = express.Router();
const { getChallengeList, generateQuestion, submitAnswer } = require('../controllers/challengeController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/list', getChallengeList);
router.post('/question', verifyToken, generateQuestion);
router.post('/submit', verifyToken, submitAnswer);

module.exports = router;
