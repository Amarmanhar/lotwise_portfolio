import { useEffect, useState } from "react";

export default function PnL() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/pnl")
      .then((res) => res.json())
      .then((data) => setRows(data));
  }, []);

  return (
    <main style={{ padding: 30 }}>
      <h1>Realized P&L</h1>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Realized PnL</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.symbol}>
              <td>{r.symbol}</td>
              <td>{Number(r.pnl).toFixed(2)}</td>
              <td>{new Date(r.last_updated).toLocaleString()}</td>
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
