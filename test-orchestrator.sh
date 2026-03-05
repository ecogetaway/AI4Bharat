#!/bin/bash

# Kisan Saarthi Orchestrator Integration Test Script
# Date: March 4, 2026

echo "🧪 Kisan Saarthi Multi-Agent System - Integration Test"
echo "========================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if orchestrator URL is provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Orchestrator URL not provided${NC}"
    echo ""
    echo "Usage: ./test-orchestrator.sh <ORCHESTRATOR_URL>"
    echo ""
    echo "Example:"
    echo "  ./test-orchestrator.sh https://abc123xyz.lambda-url.us-east-1.on.aws/"
    echo ""
    exit 1
fi

ORCHESTRATOR_URL=$1

echo "📍 Testing Orchestrator URL: $ORCHESTRATOR_URL"
echo ""

# Test payload
PAYLOAD='{
  "farmerName": "Rajesh Kumar",
  "location": "Nashik, Maharashtra India",
  "farmSize": 5,
  "crop": "grapes",
  "fertilizerType": "Organic",
  "irrigationMethod": "Drip",
  "pesticideUsage": "Low",
  "expectedYield": 125
}'

echo "📤 Sending test request..."
echo ""

# Make the request and capture response
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$ORCHESTRATOR_URL" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

# Extract HTTP status code (last line)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

# Extract response body (everything except last line)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "📥 Response Status: $HTTP_CODE"
echo ""

# Check HTTP status
if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ HTTP Status: OK${NC}"
else
    echo -e "${RED}❌ HTTP Status: Failed (Expected 200, got $HTTP_CODE)${NC}"
    echo ""
    echo "Response Body:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    exit 1
fi

echo ""
echo "📊 Analyzing Response..."
echo ""

# Check if jq is available for JSON parsing
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}⚠️  jq not installed. Install with: brew install jq${NC}"
    echo ""
    echo "Raw Response:"
    echo "$BODY"
    exit 0
fi

# Parse and validate response
FARMER_NAME=$(echo "$BODY" | jq -r '.farmerName // empty')
SUMMARY=$(echo "$BODY" | jq -r '.summary // empty')
AGENTS_USED=$(echo "$BODY" | jq -r '.agentsUsed // empty')
WEATHER_DATA=$(echo "$BODY" | jq -r '.weatherInsights // empty')
MARKET_DATA=$(echo "$BODY" | jq -r '.marketInsights // empty')
RECOMMENDATIONS=$(echo "$BODY" | jq -r '.sustainabilityRecommendations // empty')
CACHED=$(echo "$BODY" | jq -r '.cached // false')

# Validation checks
echo "🔍 Validation Results:"
echo ""

# Check farmer name
if [ -n "$FARMER_NAME" ]; then
    echo -e "${GREEN}✅ Farmer Name: $FARMER_NAME${NC}"
else
    echo -e "${RED}❌ Farmer Name: Missing${NC}"
fi

# Check summary
if [ -n "$SUMMARY" ]; then
    echo -e "${GREEN}✅ Summary: Present${NC}"
    echo "   \"${SUMMARY:0:80}...\""
else
    echo -e "${RED}❌ Summary: Missing${NC}"
fi

# Check agents used
if [ -n "$AGENTS_USED" ] && [ "$AGENTS_USED" != "null" ]; then
    AGENT_COUNT=$(echo "$BODY" | jq '.agentsUsed | length')
    echo -e "${GREEN}✅ Agents Used: $AGENT_COUNT agents${NC}"
    echo "$BODY" | jq -r '.agentsUsed[]' | while read agent; do
        echo "   - $agent"
    done
else
    echo -e "${YELLOW}⚠️  Agents Used: None (check if agents are deployed)${NC}"
fi

# Check weather insights
if [ -n "$WEATHER_DATA" ] && [ "$WEATHER_DATA" != "null" ]; then
    TEMP=$(echo "$BODY" | jq -r '.weatherInsights.currentWeather.temperature // empty')
    CONDITION=$(echo "$BODY" | jq -r '.weatherInsights.currentWeather.condition // empty')
    echo -e "${GREEN}✅ Weather Insights: Present${NC}"
    if [ -n "$TEMP" ]; then
        echo "   Temperature: ${TEMP}°C"
    fi
    if [ -n "$CONDITION" ]; then
        echo "   Condition: $CONDITION"
    fi
else
    echo -e "${YELLOW}⚠️  Weather Insights: Missing (check weather agent)${NC}"
fi

# Check market insights
if [ -n "$MARKET_DATA" ] && [ "$MARKET_DATA" != "null" ]; then
    PRICE=$(echo "$BODY" | jq -r '.marketInsights.mandiPrices.currentPrice // empty')
    TREND=$(echo "$BODY" | jq -r '.marketInsights.mandiPrices.priceTrend // empty')
    echo -e "${GREEN}✅ Market Insights: Present${NC}"
    if [ -n "$PRICE" ]; then
        echo "   Current Price: ₹$PRICE/quintal"
    fi
    if [ -n "$TREND" ]; then
        echo "   Price Trend: $TREND"
    fi
else
    echo -e "${YELLOW}⚠️  Market Insights: Missing (check market agent)${NC}"
fi

# Check sustainability recommendations
if [ -n "$RECOMMENDATIONS" ] && [ "$RECOMMENDATIONS" != "null" ] && [ "$RECOMMENDATIONS" != "[]" ]; then
    REC_COUNT=$(echo "$BODY" | jq '.sustainabilityRecommendations | length')
    echo -e "${GREEN}✅ Sustainability Recommendations: $REC_COUNT recommendations${NC}"
    echo "$BODY" | jq -r '.sustainabilityRecommendations[0].title // empty' | while read title; do
        if [ -n "$title" ]; then
            echo "   - $title"
        fi
    done
else
    echo -e "${YELLOW}⚠️  Sustainability Recommendations: Missing${NC}"
fi

# Check cache status
if [ "$CACHED" = "true" ]; then
    echo -e "${GREEN}✅ Cache Status: Cached response${NC}"
else
    echo -e "${GREEN}✅ Cache Status: Fresh response${NC}"
fi

echo ""
echo "📋 Full Response:"
echo ""
echo "$BODY" | jq '.'

echo ""
echo "========================================================"
echo "🎉 Integration Test Complete!"
echo ""

# Summary
TOTAL_CHECKS=6
PASSED_CHECKS=0

[ -n "$FARMER_NAME" ] && ((PASSED_CHECKS++))
[ -n "$SUMMARY" ] && ((PASSED_CHECKS++))
[ -n "$AGENTS_USED" ] && [ "$AGENTS_USED" != "null" ] && ((PASSED_CHECKS++))
[ -n "$WEATHER_DATA" ] && [ "$WEATHER_DATA" != "null" ] && ((PASSED_CHECKS++))
[ -n "$MARKET_DATA" ] && [ "$MARKET_DATA" != "null" ] && ((PASSED_CHECKS++))
[ -n "$RECOMMENDATIONS" ] && [ "$RECOMMENDATIONS" != "null" ] && [ "$RECOMMENDATIONS" != "[]" ] && ((PASSED_CHECKS++))

echo "Summary: $PASSED_CHECKS/$TOTAL_CHECKS checks passed"
echo ""

if [ $PASSED_CHECKS -eq $TOTAL_CHECKS ]; then
    echo -e "${GREEN}✅ All checks passed! Integration is working perfectly.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Update ORCHESTRATOR_URL in RuralFarmerDashboard.jsx (line 67)"
    echo "2. Test locally: cd prototype && npm run dev"
    echo "3. Deploy to production: git push origin main"
elif [ $PASSED_CHECKS -ge 3 ]; then
    echo -e "${YELLOW}⚠️  Partial success. Some agents may not be deployed.${NC}"
    echo ""
    echo "Check:"
    echo "- Weather agent deployment"
    echo "- Market agent deployment"
    echo "- Orchestrator IAM permissions"
else
    echo -e "${RED}❌ Integration test failed. Check orchestrator logs.${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "1. Check CloudWatch logs for orchestrator Lambda"
    echo "2. Verify all three agents are deployed"
    echo "3. Check IAM permissions"
    echo "4. Verify DynamoDB table exists"
fi

echo ""
