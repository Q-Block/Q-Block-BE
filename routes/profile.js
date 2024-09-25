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

module.exports = router;