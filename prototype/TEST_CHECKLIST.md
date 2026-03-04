# Prototype Test Checklist

## Automated Checks (Already Run)

| Check | Status |
|-------|--------|
| Build (`npm run build`) | ✅ Passes |
| Orchestrator API (curl POST) | ✅ Returns 200 |

---

## Manual Checklist for Judges / Demo

### 1. Start the App
- [ ] Run `cd prototype && npm run dev`
- [ ] App opens at http://localhost:3000
- [ ] No console errors on load

### 2. Dashboard Loads
- [ ] Farmer profile card visible (Rajesh Kumar, Nashik)
- [ ] Key metrics show (Emissions, Sequestration, Net, Premium)
- [ ] Emission breakdown pie chart renders
- [ ] Emission trend line chart renders
- [ ] Crop-level carbon footprint cards show
- [ ] Sustainability premium section visible
- [ ] Carbon credit potential section visible

### 3. AI Recommendations Form
- [ ] Form fields visible (Farm Size, Crop, Fertilizer, Irrigation, Pesticide)
- [ ] "Get AI Recommendations" button works
- [ ] "Load demo data" button visible with hint "(Use when API is unavailable)"

### 4. When API Works (Get AI Recommendations)
- [ ] Loading spinner appears briefly
- [ ] Recommendations list populates (3+ cards)
- [ ] **Weather Insights** section appears (current temp, humidity, rainfall, 7-day forecast, alerts, farming advice)
- [ ] **Market Intelligence** section appears (mandi prices, carbon credits, market advice, total potential income)
- [ ] Total Potential Income box is readable (dark green text on yellow background)

### 5. When API Fails (Fallback)
- [ ] Error message appears: "API temporarily unavailable. Demo data has been loaded automatically..."
- [ ] Recommendations, Weather Insights, Market Intelligence still show (demo data)
- [ ] "Load demo data" button can reload demo data

### 6. Load Demo Data (Backup)
- [ ] Click "Load demo data" without calling API
- [ ] All sections populate (Recommendations, Weather, Market)
- [ ] No error message

### 7. Responsive / Polish
- [ ] Page scrolls smoothly
- [ ] No overlapping text or broken layout
- [ ] Footer visible: "AI4Bharat Hackathon 2026 | Rural Innovation & Sustainable Systems"

---

## Quick API Test (Terminal)

```bash
curl -X POST "https://gylv2iabjpsbte727qkawailjm0xnctf.lambda-url.us-east-1.on.aws/" \
  -H "Content-Type: application/json" \
  -d '{"farmerName":"Rajesh Kumar","location":"Nashik","farmSize":5.2,"crop":"rice","fertilizerType":"Mixed","irrigationMethod":"Flood","pesticideUsage":"Medium","expectedYield":130}'
```

Expected: JSON response with `sustainabilityRecommendations`, `weatherInsights`, `marketInsights`.
