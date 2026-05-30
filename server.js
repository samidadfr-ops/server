const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("SMS Server Running");
});

app.post("/sms", (req, res) => {
    console.log("SMS Received:");
    console.log(req.body);

    res.json({
        success: true,
        message: "SMS saved"
    });
});

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
app.post("/sms", (req, res) => {
    console.log(req.body);

    res.json({
        success: true,
        message: "SMS received"
    });
});
app.get("/sms", (req, res) => {
    res.send("SMS API Ready");
});