const express = require("express");
const router = express.Router();
const db = require("../db");
const { publishTrade } = require("../kafka");

router.post("/", async (req, res) => {
  try {
    const { symbol, qty, price, timestamp } = req.body;

    if (!symbol || !qty || !price || !timestamp) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const result = await db.query(
      `INSERT INTO trades(symbol, qty, price, trade_time)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [symbol.toUpperCase(), qty, price, timestamp]
    );

    const trade = result.rows[0];

    await publishTrade(trade);

    res.status(201).json(trade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
