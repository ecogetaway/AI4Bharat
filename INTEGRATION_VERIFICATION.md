# Kisan Saarthi Multi-Agent System - Integration Verification
**Date**: March 4, 2026  
**Status**: Ready for Testing

---

## 🎯 Integration Overview

The Kisan Saarthi Multi-Agent System consists of:
1. **Weather Agent** - Real-time weather + AI farming advice
2. **Market Agent** - Mandi prices + carbon credit opportunities  
3. **Orchestrator Agent** - Coordinates all agents + Bedrock synthesis
4. **React Frontend** - Rural Farmer Dashboard with AI recommendations

---

## ✅ Integration Checklist

### Backend Components

- [ ] **Weather Agent Lambda** deployed and working
  - Function name: `ai4bharat-weather-agent`
  - Runtime: Node.js 20.x
  - Timeout: 30 seconds
  - Environment variables: `DYNAMODB_TABLE=farm-recommendations`
  - DynamoDB permissions configured
  - Bedrock permissions configured

- [ ] **Market Agent Lambda** deployed and working
  - Function name: `ai4bharat-market-agent`
  - Runtime: Node.js 20.x
  - Timeout: 30 seconds
  - Environment variables: `DYNAMODB_TABLE=farm-recommendations`
  - DynamoDB permissions configured
  - Bedrock permissions configured

- [ ] **Orchestrator Lambda** deployed and working
  - Function name: `ai4bharat-orchestrator`
  - Runtime: Node.js 20.x
  - Timeout: 60 seconds
  - Environment variables: 
    - `DYNAMODB_TABLE=farm-recommendations`
    - `RECOMMENDATION_AGENT_URL` (optional)
  - IAM policy for Lambda invocation attached
  - DynamoDB permissions configured
  - Bedrock permissions configured
  - Function URL created with CORS enabled

- [ ] **DynamoDB Table** created
  - Table name: `farm-recommendations`
  - Partition key: `recommendationId` (String)
  - TTL enabled on `ttl` attribute

### Frontend Components

- [ ] **RuralFarmerDashboard.jsx** updated
  - Orchestrator URL configured (line 67)
  - State management for `orchestratorData`
  - Weather insights section implemented
  - Market insights section implemented
  - Error handling implemented
  - Loading states implemented

- [ ] **CSS Styling** complete
  - Weather section styles
  - Market section styles
  - Responsive design for mobile
  - Loading spinner animation

---

## 🧪 Testing Plan

### Test 1: Check Orchestrator URL Configuration

**Status**: ⚠️ NEEDS ATTENTION

**Current State**:
```javascript
const ORCHESTRATOR_URL = 'YOUR_ORCHESTRATOR_FUNCTION_URL_HERE'
```

**Required Action**:
1. Go to AWS Console → Lambda → `ai4bharat-orchestrator`
2. Click Configuration → Function URL
3. Copy the Function URL
4. Replace line 67 in `RuralFarmerDashboard.jsx` with actual URL

**Expected Result**: URL should look like:
```javascript
const ORCHESTRATOR_URL = 'https://abc123xyz.lambda-url.us-east-1.on.aws/'
```

---

### Test 2: Local Development Server

**Steps**:
```bash
cd prototype
npm run dev
```

**Expected Result**:
- Server starts on http://localhost:5173
- No console errors
- Dashboard loads with mock data

**Verification**:
- [ ] Server starts successfully
- [ ] No build errors
- [ ] Dashboard displays correctly
- [ ] Form is visible and functional

---

### Test 3: API Integration Test (Without Orchestrator)

**Purpose**: Test if frontend can make API calls

**Steps**:
1. Open browser DevTools (F12)
2. Go to Rural Farmer Dashboard
3. Fill in the form:
   - Farm Size: 5
   - Primary Crop: Grapes
   - Fertilizer Type: Organic
   - Irrigation Method: Drip
   - Pesticide Usage: Low
4. Click "Get AI Recommendations"

**Expected Behavior** (without orchestrator URL):
- Loading spinner appears
- After 3-5 seconds, error message appears
- Console shows: `Error getting recommendations: TypeError: Failed to fetch`

**Verification**:
- [ ] Form submission works
- [ ] Loading state activates
- [ ] Error handling works
- [ ] No JavaScript errors (other than fetch failure)

---

### Test 4: Full Integration Test (With Orchestrator)

**Prerequisites**:
- Orchestrator Lambda deployed
- Function URL configured in frontend
- All three agents working

**Steps**:
1. Update `ORCHESTRATOR_URL` in `RuralFarmerDashboard.jsx`
2. Restart dev server: `npm run dev`
3. Open browser: http://localhost:5173
4. Navigate to Rural Farmer Dashboard
5. Fill in the form:
   - Farm Size: 5
   - Primary Crop: Grapes
   - Fertilizer Type: Organic
   - Irrigation Method: Drip
   - Pesticide Usage: Low
6. Click "Get AI Recommendations"
7. Wait 3-5 seconds

**Expected Results**:
- [ ] Loading spinner appears
- [ ] Console shows: `Orchestrator response: {...}`
- [ ] Sustainability recommendations appear
- [ ] Weather insights section appears (if weather agent returns data)
- [ ] Market intelligence section appears (if market agent returns data)
- [ ] No error messages
- [ ] All data displays correctly

**Console Output Should Show**:
```javascript
{
  farmerName: "Rajesh Kumar",
  summary: "Farm assessment for Rajesh Kumar...",
  urgentAlerts: [...],
  weatherInsights: {
    currentWeather: {...},
    alerts: [...],
    farmingAdvice: {...}
  },
  marketInsights: {
    mandiPrices: {...},
    carbonCredits: {...},
    marketAdvice: {...}
  },
  sustainabilityRecommendations: [...],
  agentsUsed: ["market", "weather", "sustainability"],
  timestamp: "2026-03-04T...",
  cached: false
}
```

---

### Test 5: Weather Insights Display

**Prerequisites**: Orchestrator returns weather data

**Verification**:
- [ ] Weather section appears after API call
- [ ] Current weather displays:
  - [ ] Temperature
  - [ ] Humidity
  - [ ] Rainfall
  - [ ] Condition
- [ ] Weather alerts display (if any)
- [ ] Farming advice displays:
  - [ ] Irrigation recommendation
  - [ ] Pest risk
  - [ ] Harvest window
  - [ ] Carbon impact
- [ ] Styling is correct (purple gradient background)

---

### Test 6: Market Intelligence Display

**Prerequisites**: Orchestrator returns market data

**Verification**:
- [ ] Market section appears after API call
- [ ] Mandi prices display:
  - [ ] Current price (large display)
  - [ ] MSP price
  - [ ] Nearest mandi
  - [ ] Price trend (with arrow)
  - [ ] Best selling window
- [ ] Carbon credits display:
  - [ ] Price per tonne
  - [ ] Estimated earnings
  - [ ] Registration scheme
- [ ] Market advice displays:
  - [ ] Decision (SELL_NOW/WAIT/PARTIAL_SELL)
  - [ ] Reasoning
  - [ ] Alternative markets (if any)
  - [ ] Government schemes (if any)
- [ ] Total potential income displays
- [ ] Styling is correct (green gradient background)

---

### Test 7: Error Handling

**Test 7a: Network Error**
- Disconnect internet
- Click "Get AI Recommendations"
- **Expected**: Error message appears: "Failed to get AI recommendations. Please try again."

**Test 7b: Invalid Response**
- Orchestrator returns 400/500 error
- **Expected**: Error message appears with status code

**Test 7c: Timeout**
- Orchestrator takes > 60 seconds
- **Expected**: Error message appears

**Verification**:
- [ ] Error messages display correctly
- [ ] Error styling is correct (red background)
- [ ] User can retry after error
- [ ] No console errors (other than expected fetch errors)

---

### Test 8: Loading States

**Verification**:
- [ ] Button shows spinner when loading
- [ ] Button text changes to "Getting Recommendations..."
- [ ] Button is disabled during loading
- [ ] Loading state clears after response
- [ ] Loading state clears after error

---

### Test 9: Data Transformation

**Purpose**: Verify orchestrator response is correctly transformed

**Check**:
1. Open browser console
2. After successful API call, inspect `orchestratorData` state
3. Verify recommendations are formatted correctly:

**Expected Format**:
```javascript
{
  id: "ai-1",
  title: "Switch to drip irrigation",
  impact: "2.5 tonnes CO₂e/year reduction",
  cost: "₹50,000 initial investment",
  savings: "₹75,000/year savings",
  priority: "high",
  description: "...",
  govtScheme: "..."
}
```

**Verification**:
- [ ] Recommendations array is populated
- [ ] Each recommendation has all required fields
- [ ] Numbers are formatted with Indian locale (₹ symbol, commas)
- [ ] Priority is lowercase ("high", "medium", "low")

---

### Test 10: Responsive Design

**Test on Different Screen Sizes**:

**Desktop (1920x1080)**:
- [ ] All sections display side-by-side
- [ ] Charts are readable
- [ ] No horizontal scrolling

**Tablet (768x1024)**:
- [ ] Sections stack vertically
- [ ] Form fields stack
- [ ] Charts resize correctly

**Mobile (375x667)**:
- [ ] All content is readable
- [ ] Form is usable
- [ ] No text overflow
- [ ] Touch targets are large enough

---

### Test 11: Production Deployment

**Prerequisites**: Code pushed to GitHub

**Steps**:
1. Push code to GitHub:
   ```bash
   git add .
   git commit -m "Configure orchestrator URL - March 4, 2026"
   git push origin main
   ```
2. Wait 1-2 minutes for Netlify to deploy
3. Go to https://ai4bharat.netlify.app/
4. Navigate to Rural Farmer Dashboard
5. Test AI recommendations form

**Verification**:
- [ ] Netlify build succeeds
- [ ] Site deploys successfully
- [ ] Dashboard loads on production
- [ ] API calls work on production
- [ ] Weather/market sections display
- [ ] No console errors

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error
**Symptom**: Console shows "CORS policy blocked"

**Solution**:
1. Go to AWS Console → Lambda → `ai4bharat-orchestrator`
2. Configuration → Function URL
3. Verify CORS settings:
   - Allow origins: `*`
   - Allow methods: `POST, OPTIONS`
   - Allow headers: `content-type`
4. Save and test again

---

### Issue 2: 403 Forbidden
**Symptom**: API returns 403 status

**Solution**:
1. Check Function URL auth type is set to **NONE**
2. Verify Function URL is publicly accessible
3. Test Function URL directly with curl:
   ```bash
   curl -X POST https://YOUR-URL.lambda-url.us-east-1.on.aws/ \
     -H "Content-Type: application/json" \
     -d '{"farmerName":"Test","location":"Mumbai","farmSize":5,"crop":"rice"}'
   ```

---

### Issue 3: Timeout
**Symptom**: Request takes > 60 seconds

**Solution**:
1. Check Lambda timeout settings (should be 60 seconds)
2. Check if Weather/Market agents are responding
3. Test individual agents first
4. Check CloudWatch logs for bottlenecks

---

### Issue 4: No Weather/Market Data
**Symptom**: Recommendations show but no weather/market sections

**Solution**:
1. Check orchestrator response in console
2. Verify `weatherInsights` and `marketInsights` are present
3. Check if Weather/Market agents are deployed
4. Verify orchestrator has IAM permissions to invoke them
5. Check CloudWatch logs for errors

---

### Issue 5: Data Not Displaying
**Symptom**: API succeeds but sections don't appear

**Solution**:
1. Check browser console for JavaScript errors
2. Verify `orchestratorData` state is set correctly
3. Check conditional rendering logic:
   ```javascript
   {orchestratorData?.weatherInsights && (...)}
   ```
4. Verify data structure matches expected format

---

## 📊 Integration Status Summary

### Current Status: ⚠️ PENDING ORCHESTRATOR URL

**What's Working**:
- ✅ Frontend code is complete
- ✅ Weather/market display sections implemented
- ✅ Error handling implemented
- ✅ Loading states implemented
- ✅ CSS styling complete
- ✅ Responsive design implemented
- ✅ Data transformation logic implemented

**What's Needed**:
- ⚠️ Orchestrator Lambda Function URL
- ⚠️ Update line 67 in `RuralFarmerDashboard.jsx`
- ⚠️ Test with real orchestrator
- ⚠️ Verify all three agents return data
- ⚠️ Deploy to production

---

## 🚀 Quick Start Testing

### Fastest Way to Verify Integration:

1. **Deploy Orchestrator** (if not done):
   - AWS Console → Lambda → Create function
   - Copy code from `orchestrator-agent-lambda.js`
   - Configure timeout, environment variables, IAM policy
   - Create Function URL with CORS

2. **Update Frontend**:
   ```javascript
   // Line 67 in RuralFarmerDashboard.jsx
   const ORCHESTRATOR_URL = 'https://YOUR-ACTUAL-URL.lambda-url.us-east-1.on.aws/'
   ```

3. **Test Locally**:
   ```bash
   cd prototype
   npm run dev
   ```
   - Open http://localhost:5173
   - Fill form and click "Get AI Recommendations"
   - Check console for response

4. **Deploy to Production**:
   ```bash
   git add .
   git commit -m "Configure orchestrator URL"
   git push origin main
   ```

---

## 📝 Test Results Template

Use this template to document your test results:

```
## Test Results - March 4, 2026

### Environment
- [ ] Local Development
- [ ] Production (Netlify)

### Test 1: Orchestrator URL
- Status: ✅ / ❌
- URL: https://...
- Notes: 

### Test 2: Local Server
- Status: ✅ / ❌
- Notes:

### Test 3: API Integration
- Status: ✅ / ❌
- Response time: ___ seconds
- Agents used: []
- Notes:

### Test 4: Weather Display
- Status: ✅ / ❌
- Data received: Yes / No
- Display correct: Yes / No
- Notes:

### Test 5: Market Display
- Status: ✅ / ❌
- Data received: Yes / No
- Display correct: Yes / No
- Notes:

### Test 6: Error Handling
- Status: ✅ / ❌
- Notes:

### Test 7: Responsive Design
- Desktop: ✅ / ❌
- Tablet: ✅ / ❌
- Mobile: ✅ / ❌

### Overall Status
- Integration Complete: Yes / No
- Ready for Demo: Yes / No
- Issues Found: 
- Next Steps:
```

---

## 🎯 Demo Readiness Checklist

Before the hackathon demo:

- [ ] All three Lambda functions deployed and tested
- [ ] Orchestrator URL configured in frontend
- [ ] Local testing completed successfully
- [ ] Production deployment successful
- [ ] Weather insights displaying correctly
- [ ] Market intelligence displaying correctly
- [ ] Sustainability recommendations displaying correctly
- [ ] Error handling tested
- [ ] Responsive design verified
- [ ] Demo script prepared
- [ ] Backup plan ready (if API fails, show mock data)

---

**Next Action**: Deploy orchestrator Lambda and get Function URL, then update frontend and test! 🚀
