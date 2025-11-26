const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const lotsResult = await db.query(
      `SELECT id, symbol, remaining_qty, price, created_at
       FROM open_lots
       WHERE remaining_qty > 0
       ORDER BY symbol, created_at`
    );

    const summaryResult = await db.query(
      `SELECT symbol,
              SUM(remaining_qty) AS total_qty,
              CASE WHEN SUM(remaining_qty) > 0
                   THEN SUM(remaining_qty * price) / SUM(remaining_qty)
                   ELSE 0 END AS avg_cost
       FROM open_lots
       WHERE remaining_qty > 0
       GROUP BY symbol`
    );

    res.json({
      lots: lotsResult.rows,
      summary: summaryResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
