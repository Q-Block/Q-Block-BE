const express = require('express');
const router = express.Router();
const db = require('../db/db');

//get profile info
router.get('/info/:userId', (req, res) => {
    const { userId } = req.params;
  
    const query = 'SELECT user_id, email, username, profile_image FROM USER WHERE user_id = ?';

    // Query the database
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error retrieving user profile:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the user profile data
        const userProfile = results[0]; // Get the first result (should only be one user)
        res.json({
            user_id: userProfile.user_id,
            email: userProfile.email,
            username: userProfile.username,
            profile_image: userProfile.profile_image
        });
    });
});

router.patch('/info/update/:userId', (req, res) => {
    const { userId } = req.params;  // Get userId from URL
    const { username } = req.body;  // Get new username from request body

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    // Check if the user exists and get their current username
    const checkQuery = 'SELECT username FROM USER WHERE user_id = ?';
    db.query(checkQuery, [userId], (err, results) => {
        if (err) {
            console.error('Error checking user:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const currentUsername = results[0].username;

        // If the new username is the same as the current one, skip the update
        if (currentUsername === username) {
            return res.json({ message: 'Username is already up to date' });
        }

        // Proceed with the update if the username is different
        const updateQuery = 'UPDATE USER SET username = ? WHERE user_id = ?';
        db.query(updateQuery, [username, userId], (err, updateResults) => {
            if (err) {
                console.error('Error updating username:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.json({ message: 'Username updated successfully' });
        });
    });
});

module.exports = router;