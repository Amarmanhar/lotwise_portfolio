const db = require("./db");

async function processTrade(trade) {
  const { symbol, qty, price, trade_time } = trade;

  if (qty > 0) {
    // BUY = create a new lot
    await db.query(
      `INSERT INTO open_lots(symbol, remaining_qty, price, created_at)
       VALUES ($1, $2, $3, $4)`,
      [symbol, qty, price, trade_time]
    );
  } else {
    // SELL = FIFO matching
    // SELL = FIFO matching
    let remainingToSell = -qty;
    let realizedPnl = 0;

    // Get FIFO lots
    const lotsRes = await db.query(
      `SELECT id, remaining_qty, price
   FROM open_lots
   WHERE symbol=$1 AND remaining_qty > 0
   ORDER BY created_at ASC, id ASC`,
      [symbol]
    );

    const lots = lotsRes.rows;

    for (const lot of lots) {
      if (remainingToSell <= 0) break;

      const matchQty = Math.min(remainingToSell, lot.remaining_qty);

      // profit = (sell price - buy price) * matched quantity
      const pnlForThisLot = (price - lot.price) * matchQty;
      realizedPnl += pnlForThisLot;

      const updatedQty = lot.remaining_qty - matchQty;

      // update lot
      await db.query(`UPDATE open_lots SET remaining_qty = $1 WHERE id=$2`, [
        updatedQty,
        lot.id,
      ]);

      remainingToSell -= matchQty;
    }

    // Update PnL table
    await db.query(
      `INSERT INTO realized_pnl(symbol, pnl, last_updated)
   VALUES ($1, $2, NOW())
   ON CONFLICT(symbol)
   DO UPDATE SET pnl = realized_pnl.pnl + EXCLUDED.pnl,
                 last_updated = NOW()`,
      [symbol, realizedPnl]
    );
  }
}

module.exports = { processTrade };
