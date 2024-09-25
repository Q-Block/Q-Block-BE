require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser'); // Add body-parser for parsing request bodies
const app = express();
const port = 3000;
const db = require('./db/db');
const imageUploadRoutes = require('./ocr/server'); // Import the OCR routes
const authRoutes = require('./routes/auth'); 
const profileRoutes = require('./routes/profile');
const register = require('./register');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test the connection on application startup
db.query('SELECT 1', (err, results) => {
  if (err) {
    console.error('Error executing test query:', err.stack);
    process.exit(1); // Exit the application if the test query fails
  } else {
    console.log('Test query result:', results);
  }
});

// Use the image upload routes
app.use('/api', imageUploadRoutes);
console.log('Imported imageUploadRoutes:', imageUploadRoutes);
console.log('Type of imageUploadRoutes:', typeof imageUploadRoutes);


// Use the auth routes
app.use('/api/auth', authRoutes);
//Use the profile routes
app.use('/api/profile', profileRoutes);

app.get('/', (req, res) => {
  db.query('SELECT * FROM USER', (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
