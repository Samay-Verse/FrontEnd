// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'contact_form_db'
});
db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// POST route to handle form submission
app.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  // Insert into MySQL
  const sql = 'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, subject, message], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Database error');
    }

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // your gmail
        pass: process.env.EMAIL_PASS  // your gmail app password
      }
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form: ${subject}`,
      text: `You have received a new message from ${name} <${email}>:\n\n${message}`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Email sending failed');
      }
      res.status(200).send('Message received and email sent!');
    });
  });
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
