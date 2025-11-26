📊 Lotwise Portfolio Tracker

A full-stack project to track trades using lot-based FIFO matching, calculate realized PnL, and show open positions.

Built with:
Node.js + Express + PostgreSQL + Kafka + Next.js (App Router)

🚀 Features

Buy trades → Create new lots

Sell trades → FIFO matching across existing lots

Realized PnL auto-updated

Open lots overview (FIFO state)

Simple UI for Trades / Positions / Realized PnL

Kafka pipeline (Backend → Kafka → Worker → DB)

🏗 Project Architecture
Frontend (Next.js) → Backend API (Node.js)
                            ↓
                          Kafka
                            ↓
                    Worker (Node.js)
                            ↓
                      PostgreSQL

🗄 Data Model
1. trades

Stores every trade entered.

Column	Type	Description
id	SERIAL PK	Unique ID
symbol	TEXT	Stock symbol
qty	INT	+ve = buy, -ve = sell
price	NUMERIC	Trade price
trade_time	TIMESTAMP	Time of trade
created_at	TIMESTAMP	Auto timestamp
2. open_lots

Represents FIFO lots.

Column	Type	Description
id	SERIAL PK	Lot ID
symbol	TEXT	Stock symbol
remaining_qty	INT	Quantity left in the lot
price	NUMERIC	Original buy price
created_at	TIMESTAMP	When lot was created

Relationship:

One trade can create one lot

Sell trades update many lots (FIFO)

3. realized_pnl
Column	Type	Description
symbol	TEXT PK	Stock symbol
pnl	NUMERIC	Total realized profit/loss
last_updated	TIMESTAMP	Updated on every sell
🔄 FIFO Matching Logic (How It Works)
BUY trade (qty > 0)

Insert a new record into open_lots

Remaining qty = qty bought

SELL trade (qty < 0)

Algorithm:

Convert negative qty to positive:

remainingToSell = -qty


Fetch lots for that symbol in FIFO order:

ORDER BY created_at ASC, id ASC


For each lot:

match as much qty as possible

compute PnL:

pnlForLot = (sellPrice – buyPrice) * matchedQty


decrease the lot’s remaining quantity

subtract matched qty from remainingToSell

After finishing all lots:

insert/update total realized PnL into realized_pnl

🧪 Example FIFO Test Scenario
Trades:

Buy 100 AAPL @150

Buy 50 AAPL @160

Sell 80 AAPL @170

FIFO Matching:

Sell 80:

Take 80 from first lot (100 → 20 left)

Realized PnL:
(170 - 150) * 80 = 1600

Open Lots:
Price	Remaining Qty
150	20
160	50
🛠 Local Setup
1️⃣ Clone Repo
git clone https://github.com/<your-username>/lotwise-portfolio.git
cd lotwise-portfolio

🔧 Backend Setup (Express)
cd backend
npm install


Create .env from example:

PORT=4000
DATABASE_URL=postgres://postgres:<password>@localhost:5432/lotwise
KAFKA_BROKER=localhost:9092
KAFKA_TOPIC=trades


Start backend:

npm run dev

🛠 Worker Setup (Kafka Consumer)
cd worker
npm install


Create .env:

DATABASE_URL=postgres://postgres:<password>@localhost:5432/lotwise
KAFKA_BROKER=localhost:9092
KAFKA_TOPIC=trades


Start worker:

npm start

🌐 Frontend Setup (Next.js 14+)
cd frontend
npm install
npm run dev


Set your environment:

NEXT_PUBLIC_API_URL=http://localhost:4000

🐋 Kafka Setup (Local)

Run Kafka + Zookeeper:

docker-compose up -d

🌍 Deployment Guide
Frontend → Vercel

Import GitHub repo

Framework auto-detected

Add ENV: NEXT_PUBLIC_API_URL=https://your-backend-url

Backend → Railway / Render

Deploy folder: /backend

Railway auto-installs Node

Add env vars

Add PostgreSQL plugin (Railway)

Worker → Railway / Render

Deploy folder: /worker

Same env vars as backend

PostgreSQL → Railway

Add database

Run your schema.sql inside Railway SQL editor

📌 Assumptions

FIFO is required for all SELL trades

One symbol's lots are independent

PnL is calculated only on SELL trades

No partial lot merging

Trade timestamps are considered creation timestamps

No short selling (qty must not exceed total lots available)

🧷 Author

Amar Manhar
Full Stack Developer
