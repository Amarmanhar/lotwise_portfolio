import { useState } from "react";

export default function Home() {
  const [symbol, setSymbol] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [message, setMessage] = useState("");

  const submitTrade = async (e: any) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:4000/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol,
          qty: Number(qty),
          price: Number(price),
          timestamp,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit trade");
      }

      setMessage("Trade submitted successfully!");
      setSymbol("");
      setQty("");
      setPrice("");
      setTimestamp("");
    } catch (err:any) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <main style={{ padding: 30 }}>
      <h1>Lotwise Portfolio Tracker</h1>
      <h2>Submit Trade</h2>

      <form
        onSubmit={submitTrade}
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 350,
          gap: 10,
        }}
      >
        <input
          placeholder="Symbol (AAPL)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <input
          placeholder="Quantity (+buy, -sell)"
          type="number"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />
        <input
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="datetime-local"
          value={timestamp}
          onChange={(e) => setTimestamp(e.target.value)}
        />

        <button type="submit">Submit Trade</button>
      </form>

      {message && <p style={{ marginTop: 10 }}>{message}</p>}

      <div style={{ marginTop: 20 }}>
        <a href="/positions">View Positions</a> | <a href="/pnl">View PnL</a>
      </div>
    </main>
  );
}
