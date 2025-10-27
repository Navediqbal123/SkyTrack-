// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000; // Render ke liye automatic port
const API_KEY = process.env.API_KEY || "c24d38e05c9f8b98cccc2fd366753c5e"; // Fallback if env missing

app.use(cors());

// ✅ Default route (avoid "Cannot GET /")
app.get("/", (req, res) => {
  res.send("🟢 SkyTrack Backend Running Successfully!");
});

// ✅ Flight tracking endpoint
app.get("/api/track-flight", async (req, res) => {
  const { flight } = req.query;

  if (!flight) {
    return res.status(400).json({ error: "Flight IATA code required, e.g., ?flight=AI202" });
  }

  const url = `http://api.aviationstack.com/v1/flights?access_key=${API_KEY}&flight_iata=${flight}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    res.status(500).json({ error: "Server error while fetching flight data" });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
