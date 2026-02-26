# 🌱 AI-Powered Supply Chain Decarbonization Platform

> **AI for Rural Innovation & Sustainable Systems**  
> AI4Bharat Hackathon Submission — Team EcoGetaway

[![Live Demo]((https://ai4bharat.netlify.app/))



## 🎯 Problem Statement

Build an AI-powered solution that supports rural ecosystems, sustainability, or resource-efficient systems.

India's agricultural supply chains are responsible for nearly **16% of national greenhouse gas emissions**. Yet the **86 million smallholder farmers** who drive those chains have:

- No visibility into their own carbon footprint
- No way to access sustainability premiums that global markets are willing to pay
- No tools to participate in carbon credit markets individually
- No connection between their sustainability actions and their earnings

This platform solves all four problems — simultaneously.

---

## 💡 Solution Overview

An AI-powered supply chain decarbonization platform that moves **"beyond reporting to real-world reductions"** by connecting three layers:

```
Individual Farmer → Rural Cooperative (FPO) → Enterprise Supply Chain
```

Each layer feeds data upward and receives market signals downward — creating a closed loop between farm-level action and enterprise sourcing decisions.

---

## 🖥️ Three Core Screens

### 1. 🧑‍🌾 Rural Farmer Dashboard
**What it does:** Gives individual farmers a complete carbon profile with actionable, financially quantified recommendations.

**Key features:**
- Farm-level carbon footprint (total emissions, sequestration, net emissions)
- Crop-level breakdown by area and emission intensity
- AI-powered recommendations with investment, savings, and carbon credit calculations
- Sustainability premium comparison — conventional vs certified price per quintal
- Carbon credit eligibility tracking with verification status

**Demo:** Rajesh Kumar, Nashik District, Maharashtra — 5.2 hectares, ₹67,500/year sustainability premium potential

---

### 2. 🔥 Supply Chain Emission Hotspots
**What it does:** BOM-level carbon analysis for enterprise products, with AI-flagged hotspots and actionable supplier/material alternatives.

**Key features:**
- Scope 3.1 (Purchased Goods) and Scope 3.4 (Upstream Transportation) breakdown
- Bill of Materials carbon analysis with per-component severity classification
- Critical hotspot identification with specific supplier recommendations
- Material alternative benchmarking with carbon and cost impact
- Multi-modal transportation optimization with emissions comparison

**Demo:** Organic Cotton T-Shirt (SKU-TEX-001) — 8.45 kg CO₂e total, Synthetic Dye flagged CRITICAL at 14 kg/kg intensity

---

### 3. 🤝 Cooperative / FPO Aggregation View
**What it does:** Aggregates individual farm data to cooperative level, unlocking carbon markets and collective interventions that individual farmers cannot access alone.

**Key features:**
- Cooperative-level emissions, sequestration, and reduction tracking
- Top performing farmers leaderboard with reduction vs baseline
- Member segmentation (High/Medium/Low emitters) with targeted improvement pathways
- Collective carbon credit pool with verified buyer marketplace
- Cooperative-level intervention recommendations with government subsidy details

**Demo:** Maharashtra Organic Farmers Cooperative — 247 members, 1,284 hectares, ₹23.70 Lakhs carbon credit value, ₹2.37 Cr earned to date

---

## 📋 Requirements Coverage

| Requirement | Coverage |
|---|---|
| Req 1 — BOM Carbon Footprint | ✅ Emission Hotspots screen |
| Req 2 — Scope 3 Visibility | ✅ Scope 3.1 + 3.4 breakdown |
| Req 4 — Supplier Intelligence | ✅ Component analysis table with severity |
| Req 5 — Material Alternatives | ✅ Hotspot recommendations with alternatives |
| Req 7 — Optimization Engine | ✅ Transport + supplier optimization |
| Req 8 — Cost Impact | ✅ ROI on every recommendation |
| Req 9 — Scenario Planning | ✅ Cooperative intervention modeling |
| Req 10 — Sustainable Sourcing | ✅ AI-powered sourcing recommendations |
| Req 16 — Rural Ecosystem Support | ✅ Farmer Dashboard + Cooperative View |

---

## 🤖 AI/ML Models (Production Architecture)

| Model | Purpose | Source |
|---|---|---|
| **Isolation Forest** | Anomaly detection in supplier data, DT mismatch | Liu et al., ICDM 2008 |
| **DBSCAN** | Farmer clustering by emission profile | Ester et al., KDD 1996 |
| **LSTM** | Consumption baseline learning over time | Hochreiter & Schmidhuber, 1997 |
| **Temporal Fusion Transformer** | Multi-horizon emission forecasting | Lim et al., IJF 2021 |
| **GraphSAGE** | Supply chain network topology validation | Hamilton et al., NeurIPS 2017 |
| **XGBoost** | Recommendation ranking and classification | Chen & Guestrin, KDD 2016 |

> **Note:** The prototype uses comprehensive mock data for demonstration. Production models would ingest real supplier data, IoT sensor feeds, and government emission factor databases.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Charts | Recharts |
| Routing | React Router v6 |
| Styling | Custom CSS with CSS variables |
| Data | Comprehensive mock data (mockData.js) |
| Deployment | Netlify (GitHub continuous deployment) |

---

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/ecogetaway/AI4Bharat.git
cd AI4Bharat/prototype

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser at http://localhost:3000
```

---

## 📦 Project Structure

```
AI4Bharat/
├── requirements.md              # Hackathon requirements document
├── design.md                    # System design document
├── prototype/
│   ├── src/
│   │   ├── App.jsx              # Main app with routing
│   │   ├── mockData.js          # Comprehensive demo data
│   │   ├── RuralFarmerDashboard.jsx    # Screen 1
│   │   ├── EmissionHotspotView.jsx     # Screen 2
│   │   ├── CooperativeAggregationView.jsx  # Screen 3
│   │   └── *.css                # Component styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── supply-chain-sustainability/
    └── diagrams/                # Architecture diagrams
```

---

## 🌍 Impact Potential

| Metric | Value |
|---|---|
| Target farmers | 86 million smallholders in India |
| FPO reach | 10,000+ registered FPOs → 30M farmers |
| Emission reduction target | 15–20% Scope 3 reduction per enterprise |
| Sustainability premium unlock | ₹450–₹850/quintal for certified farmers |
| Carbon credit potential | ₹9,595/farmer/year at cooperative scale |
| Government alignment | RDSS, PM-KUSUM, Carbon Credit Trading Scheme 2023 |

---

## 📊 Compliance Frameworks Supported

- CSRD (Corporate Sustainability Reporting Directive)
- CBAM (Carbon Border Adjustment Mechanism)
- GRI, CDP, TCFD reporting standards
- Catena-X data exchange
- PACT framework for Product Carbon Footprints
- Fair Trade, Organic, Rainforest Alliance certifications

---

## 👥 Team

**Team EcoGetaway**  
AI4Bharat Hackathon 2026  
*AI for Rural Innovation & Sustainable Systems*

---

## 📄 License

MIT License — see LICENSE for details.
