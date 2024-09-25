// ocr/server.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');
const db = require('../db/db');

const upload = multer({ dest: 'uploads/' });

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = path.join(__dirname, 'uploads', req.file.filename);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).send('Error reading file.');
    }

    const params = {
      Bucket: 'your-bucket-name',
      Key: req.file.filename,
      Body: data,
      ContentType: req.file.mimetype
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading to S3:', err);
        return res.status(500).send('Error uploading to S3.');
      }

      fs.unlinkSync(filePath);

      const imageUrl = data.Location;
      db.query('INSERT INTO URL (user_id, url) VALUES (?, ?)', [userId, imageUrl], (err, results) => {
        if (err) {
          console.error('Error saving URL:', err.stack);
          return res.status(500).send('Error saving data.');
        }
        res.json({ image_url: imageUrl });
      });
    });
  });
});

module.exports = router;
