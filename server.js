const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// ثبت دستگاه

app.post("/register-device", async (req, res) => {

    const { deviceId, deviceName, androidVersion } = req.body;

    try {

        await pool.query(
            `INSERT INTO devices
            (device_id, device_name, android_version)
            VALUES ($1,$2,$3)`,
            [deviceId, deviceName, androidVersion]
        );

        res.json({
            success: true
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false
        });
    }
});

// ثبت پیام

app.post("/messages", async (req, res) => {

    const {
        deviceId,
        sender,
        message
    } = req.body;

    try {

        await pool.query(
            `INSERT INTO messages
            (device_id, sender, message)
            VALUES ($1,$2,$3)`,
            [deviceId, sender, message]
        );

        res.json({
            success: true
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false
        });
    }
});

// دریافت همه پیام‌ها

app.get("/messages", async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT *
             FROM messages
             ORDER BY created_at DESC`
        );

        res.json(result.rows);

    } catch (err) {

        console.log(err);

        res.status(500).json([]);
    }
});

// دریافت دستگاه‌ها

app.get("/devices", async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT *
             FROM devices
             ORDER BY id DESC`
        );

        res.json(result.rows);

    } catch (err) {

        console.log(err);

        res.status(500).json([]);
    }
});

// بررسی مجاز بودن دستگاه

app.post("/check-device", async (req, res) => {

    const { deviceId } = req.body;

    try {

        const result = await pool.query(
            `SELECT *
             FROM devices
             WHERE device_id = $1`,
            [deviceId]
        );

        res.json({
            allowed: result.rows.length > 0
        });

    } catch (err) {

        console.log(err);

        res.json({
            allowed: false
        });
    }
});

// صفحه اصلی

app.get("/", (req, res) => {

    res.json({
        status: "Server Online",
        endpoints: [
            "/register-device",
            "/messages",
            "/devices",
            "/check-device"
        ]
    });
});

app.listen(process.env.PORT || 10000, () => {
    console.log("Server running on port 10000");
});
