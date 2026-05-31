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

// تست سرور

app.get("/", (req, res) => {

    res.json({
        status: "Server Online"
    });
});

app.listen(process.env.PORT || 10000, () => {
    console.log("Server running on port 10000");
});
