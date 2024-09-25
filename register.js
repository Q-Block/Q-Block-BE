const bcrypt = require('bcrypt');
const db = require('./db/db');

const saltRounds = 10;

const register = (username, email, password, profile_img, callback) => {
    // Check if the user already exists
    db.query('SELECT user_id FROM USER WHERE email = ?', [email], (err, results) => {
        if (err) {
            return callback(err);
        }
        if (results.length > 0) {
            return callback(new Error('User already exists'));
        }

        // Hash the password
        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) {
                return callback(err);
            }

            // Insert new user into the database
            db.query('INSERT INTO USER (username, email, password, profile_image) VALUES (?, ?, ?, ?)', [username, email, hashedPassword, profile_img], (err, results) => {
                if (err) {
                    return callback(err);
                }

                callback(null, { message: 'User registered successfully' });
            });
        });
    });
};

module.exports = register;
