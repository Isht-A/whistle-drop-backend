const express = require("express");
const cors = require("cors");
require("dotenv").config();

const initDatabase = require("./config/db");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Establish database link
initDatabase();

// Mount public report routes
app.use("/api", reportRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true, timestamp: Date.now() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});