const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ذخیره موقت پیام‌ها
let messages = [];

// صفحه اصلی
app.get("/", (req, res) => {
    res.send("SMS Server Running");
});

// تست API
app.get("/sms", (req, res) => {
    res.send("SMS API Ready");
});

// دریافت پیام
app.post("/sms", (req, res) => {

    const sms = {
        id: Date.now(),
        device: req.body.device || "Unknown",
        sender: req.body.sender || "Unknown",
        message: req.body.message || "",
        time: new Date().toISOString()
    };

    messages.push(sms);

    console.log("New SMS:", sms);

    res.json({
        success: true,
        data: sms
    });
});

// مشاهده همه پیام‌ها
app.get("/messages", (req, res) => {
    res.json(messages);
});

// تعداد پیام‌ها
app.get("/count", (req, res) => {
    res.json({
        total: messages.length
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});