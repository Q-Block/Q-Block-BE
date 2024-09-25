const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db/db');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Set your secret

const login = (email, password, callback) => {
    // Query to check if the user exists
    db.query('SELECT user_id, password FROM USER WHERE email = ?', [email], (err, results) => {
        if (err) {
            return callback(err);
        }
        if (results.length === 0) {
            return callback(new Error('User not found'));
        }

        const user = results[0];
        
        // Compare the provided password with the hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return callback(err);
            }
            if (!isMatch) {
                return callback(new Error('Invalid password'));
            }

            // Generate a JWT token
            const token = jwt.sign({ userId: user.user_id }, JWT_SECRET, { expiresIn: '1h' });

            callback(null, { token });
        });
    });
};

module.exports = login;
