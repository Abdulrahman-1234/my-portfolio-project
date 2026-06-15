const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

// عشان يقرأ بيانات الفورم
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// تشغيل ملفات الموقع من نفس المجلد
app.use(express.static(__dirname));

// صفحة الموقع الرئيسية
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// استقبال بيانات نموذج التواصل وحفظها في ملف
app.post("/contact", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message;

    const newMessage = `
------------------------------
New Contact Message
First Name: ${firstName}
Last Name: ${lastName}
Email: ${email}
Subject: ${subject}
Message: ${message}
Date: ${new Date().toLocaleString()}
------------------------------

`;

    // يطبع الرسالة في التيرمنال
    console.log(newMessage);

    // يحفظ الرسالة في ملف messages.txt
    fs.appendFile("messages.txt", newMessage, (err) => {
        if (err) {
            console.log("Error saving message:", err);
            return res.send("Message received, but there was an error saving it.");
        }

        res.send("Thank you! Your message has been saved successfully.");
    });
});

app.listen(port, () => {
    console.log("Server is running at http://localhost:" + port);
});