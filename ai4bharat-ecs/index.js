const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'ai4bharat-ecs', timestamp: new Date().toISOString() });
});

app.post('/farm-context', (req, res) => {
  const { location, crop, farmSize } = req.body;
  res.json({
    location,
    crop,
    farmSize,
    soilType: "Black Cotton Soil (Regur)",
    avgRainfall: "650mm/year",
    growingSeason: "Kharif (June-October)",
    avgTemperature: "28°C",
    solarIrradiation: "5.5 kWh/m²/day",
    nearestMandi: "Nashik Agricultural Market",
    districtAgriculturalOfficer: "Nashik District Office",
    carbonBaselineKgPerHa: 2400,
    recommendedCropVariety: `High-yield ${crop} variety suitable for Maharashtra`,
    waterRequirement: "800-1000mm/season",
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`AI4Bharat ECS service running on port ${PORT}`);
});
