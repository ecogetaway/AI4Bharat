# Frontend Integration Guide - Kisan Saarthi Orchestrator
## Connecting React Frontend to Multi-Agent System

**Date**: March 4, 2026  
**Frontend URL**: https://ai4bharat.netlify.app/  
**GitHub Repo**: https://github.com/ecogetaway/AI4Bharat

---

## 🎯 Overview

This guide shows how to integrate the Kisan Saarthi orchestrator (which coordinates Weather, Market, and Sustainability agents) with your existing React frontend.

---

## Step 1: Get Orchestrator Function URL

### In AWS Console:
1. Go to **Lambda** → **Functions**
2. Click on `ai4bharat-orchestrator`
3. Click **Configuration** tab
4. Click **Function URL** (left sidebar)
5. If not created yet, click **Create function URL**:
   - **Auth type**: NONE
   - **CORS**: 
     - Allow origins: `*`
     - Allow methods: `POST, OPTIONS`
     - Allow headers: `content-type`
6. Click **Save**
7. **Copy the Function URL** (looks like: `https://abc123xyz.lambda-url.us-east-1.on.aws/`)

---

## Step 2: Update Frontend Code

### File: `prototype/src/components/RuralFarmerDashboard.jsx`

The code has already been updated. You just need to replace the placeholder URL:

**Find this line** (around line 67):
```javascript
const ORCHESTRATOR_URL = 'YOUR_ORCHESTRATOR_FUNCTION_URL_HERE'
```

**Replace with your actual Function URL**:
```javascript
const ORCHESTRATOR_URL = 'https://YOUR-ACTUAL-URL.lambda-url.us-east-1.on.aws/'
```

---

## Step 3: Test Locally

### Run the development server:
```bash
cd prototype
npm run dev
```

### Open browser:
```
http://localhost:5173
```

### Test the AI Recommendations:
1. Navigate to **Rural Farmer Dashboard**
2. Fill in the form:
   - Farm Size: 5
   - Primary Crop: Grapes
   - Fertilizer Type: Organic
   - Irrigation Method: Drip
   - Pesticide Usage: Low
3. Click **Get AI Recommendations**
4. Wait 3-5 seconds
5. You should see recommendations appear

### Check browser console:
- Open DevTools (F12)
- Look for: `Orchestrator response: {...}`
- This shows the full response from all 3 agents

---

## Step 4: Understanding the Response

The orchestrator returns a comprehensive response:

```json
{
  "farmerName": "Rajesh Kumar",
  "summary": "Farm assessment for Rajesh Kumar...",
  "urgentAlerts": [
    {
      "source": "weather",
      "severity": "HIGH",
      "message": "Low rainfall forecast",
      "action": "Implement water conservation"
    }
  ],
  "weatherInsights": {
    "currentWeather": {...},
    "forecast7Days": [...],
    "alerts": [...],
    "farmingAdvice": {...}
  },
  "marketInsights": {
    "mandiPrices": {...},
    "carbonCredits": {...},
    "marketAdvice": {...},
    "totalPotentialIncome": 450000
  },
  "sustainabilityRecommendations": [
    {
      "title": "Switch to drip irrigation",
      "carbonReduction": 2.5,
      "investment": 50000,
      "annualSavings": 75000,
      "priority": "HIGH"
    }
  ],
  "totalPotentialSavings": 150000,
  "totalCarbonReduction": 5.2,
  "prioritizedActionPlan": [...],
  "agentsUsed": ["market", "weather", "sustainability"],
  "timestamp": "2026-03-04T10:30:00.000Z",
  "cached": false
}
```

---

## Step 5: Enhance UI to Show All Insights

### Option A: Add Weather & Market Cards (Recommended)

Create new sections in the dashboard to display weather and market insights:

```jsx
{/* Add after AI Recommendations section */}

{/* Weather Insights */}
{window.orchestratorData?.weatherInsights && (
  <div className="section-card">
    <h3>🌦️ Weather Insights</h3>
    <div className="weather-grid">
      <div className="weather-stat">
        <span className="label">Temperature:</span>
        <span className="value">{window.orchestratorData.weatherInsights.currentWeather.temperature}°C</span>
      </div>
      <div className="weather-stat">
        <span className="label">Humidity:</span>
        <span className="value">{window.orchestratorData.weatherInsights.currentWeather.humidity}%</span>
      </div>
      <div className="weather-stat">
        <span className="label">Condition:</span>
        <span className="value">{window.orchestratorData.weatherInsights.currentWeather.condition}</span>
      </div>
    </div>
    
    {window.orchestratorData.weatherInsights.alerts.length > 0 && (
      <div className="weather-alerts">
        <h4>⚠️ Weather Alerts</h4>
        {window.orchestratorData.weatherInsights.alerts.map((alert, i) => (
          <div key={i} className={`alert-card ${alert.severity}`}>
            <strong>{alert.type.toUpperCase()}:</strong> {alert.message}
            <br />
            <em>Action: {alert.action}</em>
          </div>
        ))}
      </div>
    )}
  </div>
)}

{/* Market Insights */}
{window.orchestratorData?.marketInsights && (
  <div className="section-card">
    <h3>💰 Market Intelligence</h3>
    <div className="market-grid">
      <div className="market-stat">
        <span className="label">Current Mandi Price:</span>
        <span className="value">₹{window.orchestratorData.marketInsights.mandiPrices.currentPrice}/quintal</span>
      </div>
      <div className="market-stat">
        <span className="label">MSP:</span>
        <span className="value">₹{window.orchestratorData.marketInsights.mandiPrices.mspPrice}/quintal</span>
      </div>
      <div className="market-stat">
        <span className="label">Price Trend:</span>
        <span className={`value trend-${window.orchestratorData.marketInsights.mandiPrices.priceTrend.toLowerCase()}`}>
          {window.orchestratorData.marketInsights.mandiPrices.priceTrend}
        </span>
      </div>
      <div className="market-stat">
        <span className="label">Best Selling Window:</span>
        <span className="value">{window.orchestratorData.marketInsights.mandiPrices.bestSellingWindow}</span>
      </div>
    </div>
    
    <div className="carbon-credits-info">
      <h4>🌍 Carbon Credit Opportunity</h4>
      <p>Estimated Earnings: <strong>₹{window.orchestratorData.marketInsights.carbonCredits.estimatedEarnings.toLocaleString()}</strong></p>
      <p>Price per Tonne: ₹{window.orchestratorData.marketInsights.carbonCredits.currentPricePerTonne}</p>
      <p className="scheme-info">{window.orchestratorData.marketInsights.carbonCredits.registrationScheme}</p>
    </div>
  </div>
)}
```

### Option B: Show Summary Only (Simpler)

Just display the AI-generated summary and prioritized action plan:

```jsx
{window.orchestratorData && (
  <div className="section-card orchestrator-summary">
    <h3>🤖 AI Farm Assessment</h3>
    <p className="summary-text">{window.orchestratorData.summary}</p>
    
    {window.orchestratorData.urgentAlerts.length > 0 && (
      <div className="urgent-alerts">
        <h4>⚠️ Urgent Actions Required</h4>
        {window.orchestratorData.urgentAlerts.map((alert, i) => (
          <div key={i} className={`alert-card ${alert.severity.toLowerCase()}`}>
            <strong>[{alert.source.toUpperCase()}]</strong> {alert.message}
            <br />
            <em>→ {alert.action}</em>
          </div>
        ))}
      </div>
    )}
    
    <div className="action-plan">
      <h4>📋 Prioritized Action Plan</h4>
      {window.orchestratorData.prioritizedActionPlan.map((action, i) => (
        <div key={i} className="action-item">
          <span className="rank">#{action.rank}</span>
          <div className="action-content">
            <strong>{action.action}</strong>
            <div className="action-meta">
              <span className="timeframe">{action.timeframe}</span>
              <span className="roi">{action.estimatedROI}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
```

---

## Step 6: Add CSS Styles

Add these styles to `RuralFarmerDashboard.css`:

```css
/* Weather Insights */
.weather-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.weather-stat {
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.weather-alerts {
  margin-top: 1.5rem;
}

.alert-card {
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  border-left: 4px solid;
}

.alert-card.high {
  background: #ffebee;
  border-color: #ef5350;
}

.alert-card.medium {
  background: #fff3e0;
  border-color: #ff9800;
}

/* Market Insights */
.market-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.market-stat {
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.trend-rising {
  color: #2e7d32;
  font-weight: bold;
}

.trend-falling {
  color: #d32f2f;
  font-weight: bold;
}

.carbon-credits-info {
  padding: 1.5rem;
  background: #e8f5e9;
  border-radius: 8px;
  margin-top: 1rem;
}

/* Orchestrator Summary */
.orchestrator-summary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.summary-text {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.urgent-alerts {
  margin: 1.5rem 0;
}

.action-plan {
  margin-top: 1.5rem;
}

.action-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.action-item .rank {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffd700;
}

.action-meta {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  opacity: 0.9;
}
```

---

## Step 7: Build and Deploy to Netlify

### Build the project:
```bash
cd prototype
npm run build
```

### Deploy to Netlify:

**Option A: Via Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

**Option B: Via GitHub (Recommended)**
1. Push code to GitHub:
```bash
git add .
git commit -m "Integrate orchestrator with frontend"
git push origin main
```

2. Netlify will auto-deploy from GitHub

---

## Step 8: Verify Deployment

### Check the live site:
1. Go to https://ai4bharat.netlify.app/
2. Navigate to Rural Farmer Dashboard
3. Fill in the form and click "Get AI Recommendations"
4. Verify you see recommendations

### Check browser console:
- Should see: `Orchestrator response: {...}`
- Should show all 3 agents used: `["market", "weather", "sustainability"]`

---

## 🐛 Troubleshooting

### Issue: CORS Error
**Solution**: Ensure orchestrator Lambda has CORS headers:
```javascript
headers: {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
}
```

### Issue: 403 Forbidden
**Solution**: Check Lambda Function URL auth type is set to "NONE"

### Issue: Timeout
**Solution**: Increase Lambda timeout to 60 seconds in Configuration → General configuration

### Issue: No recommendations showing
**Solution**: Check browser console for errors. Verify orchestrator is returning `sustainabilityRecommendations` array

### Issue: Old recommendations still showing
**Solution**: Clear browser cache or do hard refresh (Ctrl+Shift+R)

---

## 📊 Testing Checklist

- [ ] Orchestrator Lambda deployed and tested
- [ ] Function URL created with CORS enabled
- [ ] Frontend code updated with correct URL
- [ ] Local testing successful
- [ ] Weather insights displaying correctly
- [ ] Market insights displaying correctly
- [ ] Sustainability recommendations displaying correctly
- [ ] Browser console shows no errors
- [ ] Built and deployed to Netlify
- [ ] Live site tested and working

---

## 🚀 Next Steps

1. **Add loading states** for better UX
2. **Cache orchestrator response** in localStorage
3. **Add error retry logic** with exponential backoff
4. **Create dedicated pages** for Weather and Market insights
5. **Add charts** for 7-day weather forecast
6. **Show market price trends** with line charts
7. **Add notifications** for urgent weather alerts
8. **Implement real-time updates** with WebSockets

---

## 📝 Git Commands for Deployment

```bash
# Navigate to project root
cd /Users/sanjay/AI4Bharat

# Check status
git status

# Add all changes
git add .

# Commit with message
git commit -m "Integrate Kisan Saarthi orchestrator with frontend - March 4, 2026"

# Push to GitHub
git push origin main

# Netlify will auto-deploy
```

---

## 🎯 Demo Script Integration

When demoing, highlight:
1. **Single API call** gets insights from 3 specialized agents
2. **Real-time weather** from Open-Meteo API
3. **Market intelligence** with mandi prices and carbon credits
4. **AI-powered synthesis** using Amazon Bedrock Nova Lite
5. **Production-ready** with caching, retry logic, and fallbacks

---

**Integration complete! Your frontend now has the full power of the multi-agent system.** 🚀
