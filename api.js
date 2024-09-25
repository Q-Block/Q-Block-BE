const express = require('express');
const bodyParser = require('body-parser');
const register = require('./register');
const login = require('./login');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/api/signup', (req, res) => {
    const { username, email, password, profile_img } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send('Username, email, and password are required');
    }

    register(username, email, password, profile_img || null, (err, result) => {
        if (err) {
            return res.status(400).send(err.message);
        }
        res.status(201).send(result.message);
    });
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    login(email, password, (err, result) => {
        if (err) {
            return res.status(400).send(err.message);
        }
        res.status(200).json(result);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
