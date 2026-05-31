app.post("/register-device", async (req, res) => {

  const { deviceId, deviceName, androidVersion } = req.body;

  try {

    await pool.query(
      `INSERT INTO devices(device_id, device_name, android_version)
       VALUES($1,$2,$3)`,
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
