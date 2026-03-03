# Agent Orchestrator Spec — AI4Bharat Kisan Saarthi

## Overview
Master orchestrator that coordinates Weather Agent, Market Agent, and Recommendation Agent to deliver holistic farm management advice in a single API call.

## Responsibilities
- Accept farmer profile as input
- Call all 3 agents in parallel
- Synthesize outputs into unified farm advice
- Prioritize recommendations by urgency and ROI
- Return single comprehensive response to frontend

## AWS Services
- Lambda (Node.js 20.x, Mumbai region)
- Amazon Bedrock Nova Lite v1 (final synthesis)
- DynamoDB (cache orchestrated response, TTL: 30 mins)
- API Gateway endpoint: /farm-advisor (main endpoint)

## Input
```json
{
  "farmerName": "string",
  "location": "string",
  "farmSize": "number",
  "crop": "string",
  "fertilizerType": "string",
  "irrigationMethod": "string",
  "pesticideUsage": "string",
  "expectedYield": "number (optional)"
}
```

## Output
```json
{
  "farmerName": "string",
  "summary": "string (2-3 sentence farm health summary)",
  "urgentAlerts": [
    {
      "source": "weather/market/sustainability",
      "severity": "HIGH/CRITICAL",
      "message": "string",
      "action": "string"
    }
  ],
  "weatherInsights": "object (from Weather Agent)",
  "marketInsights": "object (from Market Agent)",
  "sustainabilityRecommendations": "array (from Recommendation Agent)",
  "totalPotentialSavings": "number (INR/year)",
  "totalCarbonReduction": "number (tonnes CO2e/year)",
  "prioritizedActionPlan": [
    {
      "rank": "number",
      "action": "string",
      "timeframe": "string (immediate/this-week/this-season)",
      "estimatedROI": "string"
    }
  ],
  "cached": "boolean",
  "agentsUsed": ["weather", "market", "sustainability"],
  "timestamp": "string"
}
```

## Logic Flow
1. Check orchestrator cache (30 min TTL)
2. Call all 3 agents IN PARALLEL using Promise.all():
   - Weather Agent Lambda
   - Market Agent Lambda  
   - Recommendation Agent Lambda (existing)
3. Pass all 3 responses to Bedrock for synthesis
4. Generate prioritized action plan
5. Cache and return unified response

## Synthesis Prompt
```
You are the master agricultural advisor for Indian farmers.

You have received analysis from 3 specialized agents:

WEATHER AGENT: {weatherData}
MARKET AGENT: {marketData}  
SUSTAINABILITY AGENT: {sustainabilityData}

Farmer: {farmerName}, Location: {location}, Crop: {crop}

Synthesize all insights into:
1. A 2-3 sentence farm health summary
2. Top 3 urgent alerts ranked by priority
3. A prioritized action plan for the next 30 days

Format as JSON matching the output schema.
```

## Error Handling
- If any agent fails → continue with available agents
- Mark failed agents in agentsUsed array
- Never return 500 — always return partial results

## Environment Variables
- WEATHER_AGENT_URL: Lambda function URL
- MARKET_AGENT_URL: Lambda function URL
- RECOMMENDATION_AGENT_URL: existing Lambda
- KNOWLEDGE_BASE_ID: I9TQGNSPWH
- DYNAMODB_TABLE: farm-recommendations
- BEDROCK_REGION: us-east-1
