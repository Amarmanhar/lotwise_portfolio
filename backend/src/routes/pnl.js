const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT symbol, pnl, last_updated
      FROM realized_pnl
    `);

    const rows = result.rows.map((r) => ({
      symbol: r.symbol,
      pnl: Number(r.pnl),
      last_updated: r.last_updated,
    }));

    res.json(rows);
  } catch (err) {
    console.error("PNL Route Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
