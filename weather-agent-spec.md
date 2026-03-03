# Weather Agent Spec — AI4Bharat Kisan Saarthi

## Overview
Specialized AI agent providing real-time weather data for Indian farming regions, translating meteorological data into actionable agricultural advice.

## Responsibilities
- Fetch current weather for farm location in India
- Provide 7-day rainfall and temperature forecast
- Detect extreme weather events (drought, flood, heatwave)
- Generate weather-based farming alerts
- Calculate carbon impact of weather on farm operations

## AWS Services
- Lambda (Node.js 20.x, Mumbai region)
- Amazon Bedrock Nova Lite v1 (us-east-1)
- DynamoDB cache (TTL: 1 hour)
- API Gateway endpoint: /weather-context

## Input
```json
{
  "location": "string (city, state India)",
  "crop": "string",
  "farmSize": "number (hectares)",
  "irrigationType": "string"
}
```

## Output
```json
{
  "currentWeather": {
    "temperature": "number",
    "humidity": "number",
    "rainfall": "number (mm)",
    "condition": "string"
  },
  "forecast7Days": [...],
  "alerts": [
    {
      "type": "drought/flood/heatwave/pest-risk",
      "severity": "LOW/MEDIUM/HIGH/CRITICAL",
      "message": "string",
      "action": "string"
    }
  ],
  "farmingAdvice": {
    "irrigationRecommendation": "string",
    "pestRisk": "LOW/MEDIUM/HIGH",
    "harvestWindow": "string",
    "carbonImpact": "string"
  },
  "cached": "boolean"
}
```

## Logic Flow
1. Check DynamoDB cache (1 hour TTL) → return instantly if hit
2. Call Open-Meteo API (free, no key): https://api.open-meteo.com/v1/forecast
3. Pass weather + crop data to Bedrock Nova Lite v1
4. Generate farming-specific advice
5. Save to DynamoDB with TTL
6. Return structured response

## Error Handling
- Weather API fails → use cached data with staleness warning
- Bedrock fails → return raw weather without AI advice
- Location not found → return helpful error message

## Environment Variables
- KNOWLEDGE_BASE_ID: I9TQGNSPWH
- DYNAMODB_TABLE: farm-recommendations
- BEDROCK_REGION: us-east-1
