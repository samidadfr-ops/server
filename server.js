const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        device VARCHAR(255),
        sender VARCHAR(255),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Database Ready");
  } catch (err) {
    console.error("Database Error:", err);
  }
}

initDatabase();

app.get("/", (req, res) => {
  res.send("SMS Server Running");
});

app.get("/sms", (req, res) => {
  res.send("SMS API Ready");
});

app.post("/sms", async (req, res) => {
  try {
    const { device, sender, message } = req.body;

    const result = await pool.query(
      `INSERT INTO messages(device, sender, message)
       VALUES($1, $2, $3)
       RETURNING *`,
      [device, sender, message]
    );

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.get("/messages", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM messages ORDER BY id DESC"
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.get("/count", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT COUNT(*) FROM messages"
    );

    res.json({
      total: result.rows[0].count
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
