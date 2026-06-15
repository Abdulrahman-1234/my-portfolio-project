const express = require("express");
const path = require("path");
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const app = express();
const port = process.env.PORT || 3000;

// قراءة بيانات الفورم JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// تشغيل ملفات الموقع من نفس المجلد
app.use(express.static(__dirname));

// الاتصال بـ Supabase من ملف .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env file");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// صفحة الموقع الرئيسية
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// استقبال بيانات نموذج التواصل وحفظها في Supabase
app.post("/contact", async (req, res) => {
    try {
        const { firstName, lastName, email, subject, message } = req.body;

        // التأكد أن كل الحقول موجودة
        if (!firstName || !lastName || !email || !subject || !message) {
            return res.status(400).send("Please fill all fields.");
        }

        // حفظ البيانات في جدول messages في Supabase
        const { error } = await supabase
            .from("messages")
            .insert({
                first_name: firstName,
                last_name: lastName,
                email: email,
                subject: subject,
                message: message
            });

        if (error) {
            console.error("Supabase Error:", error);
            return res.status(500).send("Error sending message. Please try again.");
        }

        console.log("New message saved to Supabase:", {
            firstName,
            lastName,
            email,
            subject,
            message
        });

        res.send("Thank you! Your message has been sent successfully.");
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).send("Server error. Please try again.");
    }
});

// تشغيل السيرفر
app.listen(port, () => {
    console.log("Server is running at http://localhost:" + port);
});