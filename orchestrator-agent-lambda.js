import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";

const lambdaClient = new LambdaClient({ 
  region: "us-east-1",
  requestHandler: { requestTimeout: 30000 }
});

const bedrockClient = new BedrockRuntimeClient({ 
  region: "us-east-1",
  requestHandler: { requestTimeout: 30000 }
});

const dynamoClient = new DynamoDBClient({ 
  region: "us-east-1",
  requestHandler: { requestTimeout: 30000 }
});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

// Lambda function names (same as deployed names)
const MARKET_AGENT = "ai4bharat-market-agent";
const WEATHER_AGENT = "ai4bharat-weather-agent";
const RECOMMENDATION_AGENT = process.env.RECOMMENDATION_AGENT_URL;

const TABLE_NAME = process.env.DYNAMODB_TABLE || "farm-recommendations";
const CACHE_TTL_MINUTES = 30;

// Structured logging helper
function log(level, message, metadata = {}) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...metadata
  }));
}

// Generate MD5 hash for cache key
function generateCacheKey(input) {
  const data = JSON.stringify({
    farmerName: input.farmerName,
    location: input.location,
    farmSize: input.farmSize,
    crop: input.crop,
    fertilizerType: input.fertilizerType,
    irrigationMethod: input.irrigationMethod,
    pesticideUsage: input.pesticideUsage
  });
  const hash = crypto.createHash("md5").update(data).digest("hex");
  return `orchestrator_${hash}`;
}

// Retry wrapper for Lambda invocation
async function invokeLambdaWithRetry(functionName, payload, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const command = new InvokeCommand({
        FunctionName: functionName,
        Payload: JSON.stringify({ body: JSON.stringify(payload) }),
        InvocationType: "RequestResponse"
      });
      
      log("info", `Invoking Lambda: ${functionName}`, { attempt: i + 1 });
      
      const response = await lambdaClient.send(command);
      const result = JSON.parse(new TextDecoder().decode(response.Payload));
      
      if (result.statusCode === 200) {
        log("info", `Lambda invocation successful: ${functionName}`);
        return JSON.parse(result.body);
      }
      
      throw new Error(`Lambda returned status ${result.statusCode}`);
    } catch (error) {
      log("error", `Attempt ${i + 1} failed for ${functionName}`, { error: error.message });
      
      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  log("error", `All retry attempts failed for ${functionName}`);
  return null;
}

// Retry wrapper for Bedrock
async function invokeBedrockWithRetry(payload, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const command = new InvokeModelCommand({
        modelId: "us.amazon.nova-lite-v1:0",
        body: JSON.stringify(payload),
        contentType: "application/json"
      });
      
      log("info", "Invoking Bedrock for synthesis", { attempt: i + 1 });
      return await bedrockClient.send(command);
    } catch (error) {
      log("error", `Bedrock attempt ${i + 1} failed`, { error: error.message });
      
      if (error.name === 'ThrottlingException' && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}

// Call Recommendation Agent (existing Lambda via HTTP)
async function callRecommendationAgent(input, maxRetries = 3) {
  if (!RECOMMENDATION_AGENT) {
    log("warn", "Recommendation Agent URL not configured");
    return null;
  }
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const payload = {
        farmSize: input.farmSize,
        crop: input.crop,
        fertilizerType: input.fertilizerType,
        irrigationMethod: input.irrigationMethod,
        pesticideUsage: input.pesticideUsage,
        farmerName: input.farmerName,
        location: input.location
      };

      log("info", "Calling Recommendation Agent", { attempt: i + 1 });
      
      const response = await fetch(RECOMMENDATION_AGENT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Recommendation Agent returned ${response.status}`);
      }

      const result = await response.json();
      log("info", "Recommendation Agent call successful");
      return result;
      
    } catch (error) {
      log("error", `Recommendation Agent attempt ${i + 1} failed`, { error: error.message });
      
      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  return null;
}

// Generate synthesis using Bedrock
async function synthesizeInsights(farmerData, marketData, weatherData, recommendationData) {
  const prompt = `You are an expert agricultural advisor. Synthesize insights for this farmer:

Farmer: ${JSON.stringify(farmerData)}
Market Data: ${marketData ? JSON.stringify(marketData) : "Not available"}
Weather Data: ${weatherData ? JSON.stringify(weatherData) : "Not available"}
Sustainability Recommendations: ${recommendationData ? JSON.stringify(recommendationData) : "Not available"}

Provide:
1. Executive summary (2-3 sentences covering farm health, opportunities, and risks)
2. Top 3 urgent actions with specific timeframes and ROI estimates
3. Prioritize by urgency and financial impact

Return as JSON with fields:
{
  "summary": "string",
  "urgentAlerts": [{"source": "weather/market/sustainability", "severity": "HIGH/CRITICAL", "message": "string", "action": "string"}],
  "prioritizedActionPlan": [{"rank": number, "action": "string", "timeframe": "immediate/this-week/this-season", "estimatedROI": "string"}]
}`;

  try {
    const payload = {
      messages: [{ role: "user", content: [{ text: prompt }] }],
      inferenceConfig: { maxTokens: 1500, temperature: 0.7 }
    };
    
    const response = await invokeBedrockWithRetry(payload);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const content = responseBody.output?.message?.content?.[0]?.text || "";
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      log("info", "Bedrock synthesis successful");
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    log("error", "Bedrock synthesis failed", { error: error.message });
  }

  // Fallback synthesis
  log("info", "Using fallback synthesis");
  return {
    summary: `Farm assessment for ${farmerData.farmerName} in ${farmerData.location}. Growing ${farmerData.crop} on ${farmerData.farmSize} hectares. Review available agent insights for optimization opportunities.`,
    urgentAlerts: [
      {
        source: "sustainability",
        severity: "HIGH",
        message: "Review farming practices for carbon reduction opportunities",
        action: "Implement sustainable practices from recommendations"
      }
    ],
    prioritizedActionPlan: [
      { rank: 1, action: "Monitor market prices daily", timeframe: "immediate", estimatedROI: "High" },
      { rank: 2, action: "Check weather forecasts", timeframe: "this-week", estimatedROI: "Medium" },
      { rank: 3, action: "Review sustainability recommendations", timeframe: "this-season", estimatedROI: "15-20% savings" }
    ]
  };
}

// Calculate totals from agent results
function calculateTotals(recommendationData) {
  let totalPotentialSavings = 0;
  let totalCarbonReduction = 0;
  
  if (recommendationData && recommendationData.recommendations) {
    recommendationData.recommendations.forEach(rec => {
      if (rec.annualSavings) totalPotentialSavings += rec.annualSavings;
      if (rec.carbonReduction) totalCarbonReduction += rec.carbonReduction;
    });
  }
  
  return { totalPotentialSavings, totalCarbonReduction };
}

// Check DynamoDB cache
async function checkCache(recommendationId) {
  try {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { recommendationId }
    });
    
    const response = await docClient.send(command);
    
    if (response.Item) {
      const now = Date.now();
      const cacheAge = now - response.Item.timestamp;
      const cacheExpiry = CACHE_TTL_MINUTES * 60 * 1000;
      
      if (cacheAge < cacheExpiry) {
        log("info", "Cache hit", { recommendationId });
        return response.Item.data;
      }
      
      log("info", "Cache expired", { recommendationId });
    }
    
    return null;
  } catch (error) {
    log("error", "Cache check error", { error: error.message });
    return null;
  }
}

// Save to DynamoDB cache
async function saveToCache(recommendationId, data) {
  try {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        recommendationId,
        data,
        timestamp: Date.now(),
        ttl: Math.floor(Date.now() / 1000) + (CACHE_TTL_MINUTES * 60)
      }
    });
    
    await docClient.send(command);
    log("info", "Cache saved", { recommendationId });
  } catch (error) {
    log("error", "Cache save error", { error: error.message });
  }
}

// Main handler
export const handler = async (event) => {
  const requestId = crypto.randomUUID();
  log("info", "Orchestrator Agent invoked", { requestId });
  
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const body = JSON.parse(event.body);
    const { farmerName, location, farmSize, crop, fertilizerType, irrigationMethod, pesticideUsage, expectedYield } = body;

    // Input validation
    if (!farmerName || !location || !farmSize || !crop) {
      log("warn", "Input validation failed", { requestId });
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing required fields: farmerName, location, farmSize, crop" })
      };
    }

    const recommendationId = generateCacheKey(body);
    
    // Check cache first
    const cachedData = await checkCache(recommendationId);
    if (cachedData) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          ...cachedData,
          cached: true
        })
      };
    }

    // Prepare payloads for agents
    const marketPayload = {
      location,
      crop,
      farmSize,
      expectedYield,
      carbonReductionTonnes: (farmSize * 0.5) // Estimate: 0.5 tonnes per hectare
    };

    const weatherPayload = {
      location,
      crop,
      farmSize,
      irrigationType: irrigationMethod
    };

    // Invoke agents in parallel with retry
    log("info", "Invoking all agents in parallel");
    const [marketData, weatherData, recommendationData] = await Promise.all([
      invokeLambdaWithRetry(MARKET_AGENT, marketPayload),
      invokeLambdaWithRetry(WEATHER_AGENT, weatherPayload),
      callRecommendationAgent(body)
    ]);

    const agentsUsed = [];
    if (marketData) agentsUsed.push('market');
    if (weatherData) agentsUsed.push('weather');
    if (recommendationData) agentsUsed.push('sustainability');

    log("info", "Agent invocations completed", { agentsUsed });

    // Synthesize with Bedrock
    const synthesis = await synthesizeInsights(body, marketData, weatherData, recommendationData);

    // Calculate totals
    const { totalPotentialSavings, totalCarbonReduction } = calculateTotals(recommendationData);

    // Prepare unified response
    const responseData = {
      farmerName,
      summary: synthesis.summary,
      urgentAlerts: synthesis.urgentAlerts || [],
      marketInsights: marketData,
      weatherInsights: weatherData,
      sustainabilityRecommendations: recommendationData?.recommendations || [],
      totalPotentialSavings,
      totalCarbonReduction,
      prioritizedActionPlan: synthesis.prioritizedActionPlan,
      agentsUsed,
      timestamp: new Date().toISOString(),
      cached: false
    };

    // Save to cache (async, don't wait)
    saveToCache(recommendationId, responseData);

    log("info", "Orchestrator completed successfully", { requestId, agentsUsed });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responseData)
    };

  } catch (error) {
    log("error", "Orchestrator error", { error: error.message, stack: error.stack, requestId });

    // Never return 500 - always return partial results
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        farmerName: body?.farmerName || "Unknown",
        summary: "Unable to complete full analysis. Please try again.",
        urgentAlerts: [],
        marketInsights: null,
        weatherInsights: null,
        sustainabilityRecommendations: [],
        totalPotentialSavings: 0,
        totalCarbonReduction: 0,
        prioritizedActionPlan: [],
        agentsUsed: [],
        timestamp: new Date().toISOString(),
        cached: false,
        error: error.message,
        requestId
      })
    };
  }
};
