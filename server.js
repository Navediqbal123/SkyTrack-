// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ AviationStack API Key
const AVIATIONSTACK_KEY = process.env.AVIATIONSTACK_KEY || "c24d38e05c9f8b98cccc2fd366753c5e";

// ✅ OpenSky credentials (username & password)
const OPENSKY_USER = process.env.OPENSKY_USER || "navediqbal123-api-client";
const OPENSKY_PASS = process.env.OPENSKY_PASS || "R0Q16oYyG7mdpo32akRggmwpMPBSmhNa";

app.use(cors());

// ✅ Default route
app.get("/", (req, res) => {
  res.send("🟢 SkyTrack Backend Running Successfully with AviationStack + OpenSky APIs!");
});

// ✅ AviationStack flight data
app.get("/api/track-flight", async (req, res) => {
  const { flight } = req.query;
  if (!flight) {
    return res.status(400).json({ error: "Flight IATA code required, e.g., ?flight=AI202" });
  }

  const url = `http://api.aviationstack.com/v1/flights?access_key=${AVIATIONSTACK_KEY}&flight_iata=${flight}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json({ source: "AviationStack", data });
  } catch (error) {
    console.error("❌ AviationStack Error:", error);
    res.status(500).json({ error: "Error fetching data from AviationStack API" });
  }
});

// ✅ OpenSky flight data
app.get("/api/opensky", async (req, res) => {
  const { icao24 } = req.query; // e.g. ?icao24=3c6444
  if (!icao24) {
    return res.status(400).json({ error: "icao24 (aircraft code) required, e.g., ?icao24=3c6444" });
  }

  const url = `https://opensky-network.org/api/states/all?icao24=${icao24}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: "Basic " + Buffer.from(`${OPENSKY_USER}:${OPENSKY_PASS}`).toString("base64"),
      },
    });

    const data = await response.json();
    res.json({ source: "OpenSky", data });
  } catch (error) {
    console.error("❌ OpenSky Error:", error);
    res.status(500).json({ error: "Error fetching data from OpenSky API" });
  }
});

app.listen(PORT, () => console.log(`✅ SkyTrack backend live on port ${PORT}`));
