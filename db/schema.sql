CREATE TABLE trades (
  id SERIAL PRIMARY KEY,
  symbol TEXT NOT NULL,
  qty INTEGER NOT NULL,                  -- buy = positive, sell = negative
  price NUMERIC(18,4) NOT NULL,
  trade_time TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Open lots table: one row per "buy lot" (remaining quantity)
CREATE TABLE open_lots (
  id SERIAL PRIMARY KEY,
  symbol TEXT NOT NULL,
  remaining_qty INTEGER NOT NULL,
  price NUMERIC(18,4) NOT NULL,
  created_at TIMESTAMP NOT NULL          -- same as original trade_time
);

-- Realized PnL per symbol (aggregated)
CREATE TABLE realized_pnl (
  symbol TEXT PRIMARY KEY,
  realized_pnl NUMERIC(18,4) NOT NULL DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW()
);
