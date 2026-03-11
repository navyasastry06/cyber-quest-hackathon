const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

const isValidEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);


const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    
    if (!username || typeof username !== 'string' || username.trim().length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters.' });
    }
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'A valid email is required.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email.toLowerCase(), username.trim()]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Username or email already taken' });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, total_xp',
      [username.trim(), email.toLowerCase(), hashedPassword]
    );

    
    const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ user: newUser.rows[0], token });
  } catch (err) {
    console.error('[auth] register error:', err.message);
    res.status(500).json({ error: 'Server error during registration' });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'A valid email is required.' });
    }
    if (!password || password.length < 1) {
      return res.status(400).json({ error: 'Password is required.' });
    }

    
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    
    delete user.password_hash;

    res.status(200).json({ user, token });
  } catch (err) {
    console.error('[auth] login error:', err.message);
    res.status(500).json({ error: 'Server error during login' });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { email, username, newPassword } = req.body;

    if (!email || !isValidEmail(email)) return res.status(400).json({ error: 'Valid email required' });
    if (!username || username.trim().length < 3) return res.status(400).json({ error: 'Valid username required' });
    if (!newPassword || newPassword.length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters' });

    
    const userMatch = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND username = $2',
      [email.toLowerCase(), username.trim()]
    );

    if (userMatch.rows.length === 0) {
      return res.status(404).json({ error: 'No operative found matching that email and username combination.' });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [hashedPassword, userMatch.rows[0].id]
    );

    res.status(200).json({ success: true, message: 'Passcode successfully reset.' });
  } catch (err) {
    console.error('[auth] resetPassword error:', err.message);
    res.status(500).json({ error: 'Server error during password reset' });
  }
};

module.exports = { register, login, resetPassword };