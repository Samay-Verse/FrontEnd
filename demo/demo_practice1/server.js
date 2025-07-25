require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error("❌ MySQL Connection Failed:", err);
        process.exit(1); // Stop the server if database is not connected
    }
    console.log("✅ MySQL Connected!");
});

// Nodemailer Setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

// API Endpoint to handle form submission
app.post("/contact", (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        console.error("❌ Missing required fields:", req.body);
        return res.status(400).json({ error: "All fields are required!" });
    }

    console.log("✅ Received Data:", req.body);

    const sql = "INSERT INTO contacts (name, email, subject, message, createdAt) VALUES (?, ?, ?, ?, NOW())";
    db.query(sql, [name, email, subject, message], (err, result) => {
        if (err) {
            console.error("❌ Error inserting data:", err);
            return res.status(500).json({ error: "Database insert failed!" });
        }

        console.log("✅ Data inserted successfully!");

        // Send Email Notification
        const mailOptions = {
            from: process.env.EMAIL,
            to: "samaypowade9@gmail.com",
            subject: `New Contact Form Submission: ${subject}`,
            text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("❌ Email sending failed:", error);
                return res.status(500).json({ error: "Email sending failed!" });
            }

            console.log("✅ Email sent successfully!");
            res.json({ success: true, message: "Message sent successfully!" });
        });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
