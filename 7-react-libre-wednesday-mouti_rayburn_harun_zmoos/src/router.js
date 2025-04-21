const express = require('express');
const router = express.Router();

// Homepage route
router.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

// Register page route
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

// Login page route
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

// Create multiplayer room page route
router.get('/create-room', (req, res) => {
    res.render('create-room', { title: 'Create Multiplayer Room' });
});

module.exports = router;
