# Market Intelligence Agent Spec — AI4Bharat Kisan Saarthi

## Overview
Specialized AI agent providing real-time mandi prices, carbon credit valuations, and market timing advice for Indian farmers.

## Responsibilities
- Fetch current mandi prices for farmer's crop
- Track carbon credit market prices (Indian Carbon Market)
- Recommend optimal selling timing
- Calculate potential carbon credit earnings
- Compare local vs distant market prices

## AWS Services
- Lambda (Node.js 20.x, Mumbai region)
- Amazon Bedrock Nova Lite v1 (us-east-1)
- DynamoDB cache (TTL: 6 hours)
- API Gateway endpoint: /market-context

## Input
```json
{
  "location": "string (city, state India)",
  "crop": "string",
  "farmSize": "number (hectares)",
  "expectedYield": "number (tonnes)",
  "carbonReductionTonnes": "number"
}
```

## Output
```json
{
  "mandiPrices": {
    "cropName": "string",
    "currentPrice": "number (INR per quintal)",
    "mspPrice": "number (minimum support price)",
    "nearestMandi": "string",
    "pricetrend": "RISING/FALLING/STABLE",
    "bestSellingWindow": "string"
  },
  "carbonCredits": {
    "currentPricePerTonne": "number (INR)",
    "estimatedEarnings": "number (INR)",
    "registrationScheme": "string",
    "verificationRequired": "string"
  },
  "marketAdvice": {
    "sellNowOrWait": "SELL_NOW/WAIT/PARTIAL_SELL",
    "reasoning": "string",
    "alternativeMarkets": ["string"],
    "govtSchemes": ["string"]
  },
  "totalPotentialIncome": "number (INR)",
  "cached": "boolean"
}
```

## Logic Flow
1. Check DynamoDB cache (6 hour TTL)
2. Fetch mandi prices from data.gov.in API (free)
3. Use hardcoded Indian Carbon Market prices (₹500-2000/tonne)
4. Pass all data to Bedrock Nova Lite v1
5. Generate market timing and carbon credit advice
6. Save to DynamoDB with TTL
7. Return structured response

## Error Handling
- Mandi API fails → use last known prices with timestamp
- Bedrock fails → return raw prices without advice

## Environment Variables
- KNOWLEDGE_BASE_ID: I9TQGNSPWH
- DYNAMODB_TABLE: farm-recommendations
- BEDROCK_REGION: us-east-1
