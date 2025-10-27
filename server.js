// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/api/track-flight", async (req, res) => {
  const { flight } = req.query;
  const apiKey = "YOUR_API_KEY"; // yahan apni API key daalna
  const url = `https://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${flight}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
