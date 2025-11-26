const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { initProducer } = require("./kafka");

const tradesRoute = require("./routes/trades");
const positionsRoute = require("./routes/positions");
const pnlRoute = require("./routes/pnl");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Lotwise Portfolio Backend");
});

app.use("/trades", tradesRoute);
app.use("/positions", positionsRoute);
app.use("/pnl", pnlRoute);

const PORT = process.env.PORT || 4000;

(async () => {
  await initProducer();
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
})();
