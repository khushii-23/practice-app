const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Dummy in-memory data (resets on restart)
let items = [
  { id: 1, name: "Learn EC2", status: "done" },
  { id: 2, name: "Deploy backend", status: "in-progress" },
  { id: 3, name: "Host frontend on S3 + CloudFront", status: "todo" },
];

// Health check (useful for load balancers / target groups)
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.get("/api/items", (req, res) => {
  res.json(items);
});

app.post("/api/items", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });
  const item = { id: items.length + 1, name, status: "todo" };
  items.push(item);
  res.status(201).json(item);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});
