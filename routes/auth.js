const express = require('express');
const router = express.Router();
const login = require('../login'); 
const register = require('../register');

// Login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  login(email, password, (err, result) => {
    if (err) {
      return res.status(401).json({ error: err.message });
    }
    res.json(result);
  });
});

// Register route
router.post('/signup', (req, res) => {
  const { username, email, password, profile_img } = req.body;

  register(username, email, password, profile_img, (err, result) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json(result);
  });
});

module.exports = router;
