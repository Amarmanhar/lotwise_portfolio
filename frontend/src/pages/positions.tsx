import { useEffect, useState } from "react";

export default function Positions() {
  const [lots, setLots] = useState<any[]>([]);
  const [summary, setSummary] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/positions")
      .then((res) => res.json())
      .then((data) => {
        setLots(data.lots || []);
        setSummary(data.summary || []);
      });
  }, []);

  return (
    <main style={{ padding: 30 }}>
      <h1>Open Positions</h1>

      <h2>Summary</h2>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Total Qty</th>
            <th>Avg Cost</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((s) => (
            <tr key={s.symbol}>
              <td>{s.symbol}</td>
              <td>{s.total_qty}</td>
              <td>{Number(s.avg_cost).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: 30 }}>Lots (FIFO)</h2>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Symbol</th>
            <th>Remaining Qty</th>
            <th>Price</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {lots.map((lot) => (
            <tr key={lot.id}>
              <td>{lot.id}</td>
              <td>{lot.symbol}</td>
              <td>{lot.remaining_qty}</td>
              <td>{lot.price}</td>
              <td>{new Date(lot.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 20 }}>
        <a href="/">Back</a>
      </div>
    </main>
  );
}
