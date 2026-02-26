# Supply Chain Decarbonization Platform - Prototype

AI-Powered Supply Chain Decarbonization Platform for Rural Ecosystems & Sustainability

## Overview

This prototype demonstrates three core features of the platform:

1. **Rural Farmer Dashboard** - Farm-level carbon footprint tracking with sustainability premium display
2. **Supply Chain Emission Hotspot View** - BOM-level analysis with high-emission suppliers flagged
3. **Cooperative/FPO Aggregation View** - Multiple farms rolled up with carbon credit potential

## Features

### 1. Rural Farmer Dashboard
- Real-time carbon footprint monitoring at farm level
- Crop-level emission breakdown
- Sustainability premium tracking and market price comparison
- Carbon credit potential calculation
- AI-powered recommendations for emission reduction
- Historical trend analysis

### 2. Emission Hotspot View
- Bill of Materials (BOM) carbon analysis
- Supplier-level emission tracking
- Scope 3.1 and 3.4 emissions visibility
- Critical hotspot identification with severity levels
- Transportation and logistics optimization
- Material alternative recommendations
- "No-regret" opportunity identification

### 3. Cooperative Aggregation View
- Collective emission tracking across all member farms
- Top performer leaderboard
- Carbon credit aggregation and trading
- Sustainability premium collective earnings
- Member improvement opportunities
- Cooperative-level recommendations
- Impact metrics (trees equivalent, cars off road)

## Technology Stack

- **Frontend**: React 18
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Icons**: Lucide React
- **Styling**: Custom CSS with responsive design

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup Steps

1. Navigate to the prototype directory:
```bash
cd prototype
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
prototype/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── RuralFarmerDashboard.js
│   │   ├── RuralFarmerDashboard.css
│   │   ├── EmissionHotspotView.js
│   │   ├── EmissionHotspotView.css
│   │   ├── CooperativeAggregationView.js
│   │   └── CooperativeAggregationView.css
│   ├── data/
│   │   └── mockData.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Mock Data

The prototype uses realistic mock data representing:

- **Farmer**: Rajesh Kumar from Nashik District, Maharashtra
- **Cooperative**: Maharashtra Organic Farmers Cooperative (247 members)
- **Product**: Organic Cotton T-Shirt with BOM analysis
- **Suppliers**: Multi-tier supply chain across India, China, and Bangladesh

All data is stored in `src/data/mockData.js` and can be easily modified for different scenarios.

## Key Metrics Demonstrated

### Farmer Level
- 12.4 tonnes CO₂e/year total emissions
- 3.2 tonnes CO₂e/year carbon sequestration
- 18.75% sustainability premium
- ₹9,600 potential carbon credit value

### Supply Chain Level
- 8.45 kg CO₂e per product
- 100% emission hotspot identification
- 24.9% potential emission reduction through optimization
- Multiple "no-regret" opportunities identified

### Cooperative Level
- 3,068 tonnes CO₂e/year total emissions
- 790 tonnes CO₂e/year sequestration
- ₹23.7 Lakhs carbon credit value
- ₹16.7 Lakhs sustainability premium earnings
- 11.1% emission reduction since 2022

## Features Not Implemented (Mocked)

The following features are represented with static data only:

- CSRD compliance reporting
- CBAM declarations
- GRI standards reporting
- CDP/TCFD frameworks
- Catena-X data exchange
- PACT format exports
- Real-time IoT sensor integration
- ERP system integration
- Actual AI/ML model inference

## Responsive Design

The prototype is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Backend API integration
- Real-time data updates via WebSocket
- User authentication and authorization
- Multi-language support (Hindi, Marathi, etc.)
- Offline-first mobile app
- Advanced AI/ML model integration
- Blockchain-based carbon credit tracking
- Integration with government schemes

## AI4Bharat Hackathon

This prototype was developed for the AI4Bharat Hackathon 2026 - Rural Ecosystems & Sustainability Track.

**Focus Areas Addressed:**
- ✅ Rural ecosystem support (FPO/cooperative tools)
- ✅ Sustainability intelligence (carbon tracking)
- ✅ Resource-efficient systems (optimization recommendations)
- ✅ Market access (sustainability premium visibility)
- ✅ Scalability (village to enterprise)

## License

This project is part of the AI4Bharat Hackathon submission.

## Contact

For questions or feedback, please contact the development team.
