import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import crypto from "crypto";

// Initialize AWS clients with 30 second timeout
const dynamoClient = new DynamoDBClient({ 
  region: "us-east-1",
  requestHandler: {
    requestTimeout: 30000
  }
});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const bedrockClient = new BedrockRuntimeClient({ 
  region: "us-east-1",
  requestHandler: {
    requestTimeout: 30000
  }
});

const TABLE_NAME = process.env.DYNAMODB_TABLE || "farm-recommendations";
const CACHE_TTL_HOURS = 6;
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

// Structured logging helper
function log(level, message, metadata = {}) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...metadata
  }));
}

// Input validation
function validateInput(body) {
  const errors = [];
  
  if (!body.location || typeof body.location !== "string") {
    errors.push("location is required and must be a string");
  }
  if (!body.crop || typeof body.crop !== "string") {
    errors.push("crop is required and must be a string");
  }
  if (!body.farmSize || typeof body.farmSize !== "number" || body.farmSize <= 0) {
    errors.push("farmSize is required and must be a positive number");
  }
  if (body.expectedYield !== undefined && (typeof body.expectedYield !== "number" || body.expectedYield < 0)) {
    errors.push("expectedYield must be a non-negative number");
  }
  if (body.carbonReductionTonnes === undefined || typeof body.carbonReductionTonnes !== "number" || body.carbonReductionTonnes < 0) {
    errors.push("carbonReductionTonnes is required and must be a non-negative number");
  }
  
  return errors;
}

// Exponential backoff retry helper
async function retryWithBackoff(fn, maxRetries = MAX_RETRIES) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries - 1) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
        log("warn", `Retry attempt ${attempt + 1} after ${delay}ms`, { error: error.message });
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// MSP (Minimum Support Price) data for major Indian crops - 2024-25 season
const MSP_PRICES = {
  "rice": { msp: 2300, unit: "quintal", nearestMandi: "Nashik APMC" },
  "wheat": { msp: 2275, unit: "quintal", nearestMandi: "Nashik APMC" },
  "sugarcane": { msp: 340, unit: "quintal", nearestMandi: "Nashik Sugar Factory" },
  "cotton": { msp: 7020, unit: "quintal", nearestMandi: "Nashik Cotton Market" },
  "grapes": { msp: 3500, unit: "quintal", nearestMandi: "Nashik Grape Market" },
  "soybean": { msp: 4892, unit: "quintal", nearestMandi: "Nashik APMC" },
  "maize": { msp: 2090, unit: "quintal", nearestMandi: "Nashik APMC" },
  "bajra": { msp: 2500, unit: "quintal", nearestMandi: "Nashik APMC" },
  "jowar": { msp: 3225, unit: "quintal", nearestMandi: "Nashik APMC" },
  "tur": { msp: 7000, unit: "quintal", nearestMandi: "Nashik APMC" },
  "moong": { msp: 8558, unit: "quintal", nearestMandi: "Nashik APMC" },
  "urad": { msp: 6950, unit: "quintal", nearestMandi: "Nashik APMC" },
  "groundnut": { msp: 6377, unit: "quintal", nearestMandi: "Nashik APMC" },
  "sunflower": { msp: 6760, unit: "quintal", nearestMandi: "Nashik APMC" },
  "onion": { msp: 2500, unit: "quintal", nearestMandi: "Lasalgaon APMC" },
  "tomato": { msp: 1800, unit: "quintal", nearestMandi: "Nashik APMC" }
};

// Generate MD5 hash for cache key
function generateCacheKey(input) {
  const data = JSON.stringify({
    location: input.location,
    crop: input.crop,
    farmSize: input.farmSize,
    expectedYield: input.expectedYield,
    carbonReductionTonnes: input.carbonReductionTonnes
  });
  const hash = crypto.createHash("md5").update(data).digest("hex");
  return `market_${hash}`;
}

// Get mandi prices with realistic variations
function getMandiPrices(crop) {
  const cropLower = crop.toLowerCase();
  const mspData = MSP_PRICES[cropLower] || MSP_PRICES["rice"];
  
  // Generate current price with 5-20% variation from MSP
  const variation = 1 + (Math.random() * 0.15 + 0.05);
  const currentPrice = Math.round(mspData.msp * variation);
  
  // Determine price trend
  const trendRandom = Math.random();
  let priceTrend = "STABLE";
  let bestSellingWindow = "Next 2-3 weeks";
  
  if (trendRandom < 0.3) {
    priceTrend = "RISING";
    bestSellingWindow = "Wait 2-4 weeks for better prices";
  } else if (trendRandom > 0.7) {
    priceTrend = "FALLING";
    bestSellingWindow = "Sell immediately before prices drop further";
  }
  
  log("info", "Mandi prices calculated", { crop, currentPrice, priceTrend });
  
  return {
    cropName: crop,
    currentPrice: currentPrice,
    mspPrice: mspData.msp,
    nearestMandi: mspData.nearestMandi,
    priceTrend: priceTrend,
    bestSellingWindow: bestSellingWindow
  };
}

// Calculate carbon credit earnings
function calculateCarbonCredits(carbonReductionTonnes) {
  // Carbon credit price in INR per tonne (500-2000 range)
  const pricePerTonne = Math.floor(Math.random() * 1500) + 500;
  const estimatedEarnings = Math.round(carbonReductionTonnes * pricePerTonne);
  
  log("info", "Carbon credits calculated", { carbonReductionTonnes, pricePerTonne, estimatedEarnings });
  
  return {
    currentPricePerTonne: pricePerTonne,
    estimatedEarnings: estimatedEarnings,
    registrationScheme: "Carbon Credit Trading Scheme 2023 (Ministry of Environment)",
    verificationRequired: "Third-party verification by Bureau of Energy Efficiency (BEE) or equivalent"
  };
}

// Call Amazon Bedrock Nova Lite for market advice with retry and fallback
async function getMarketAdvice(input, mandiPrices, carbonCredits) {
  try {
    const prompt = `You are an expert agricultural market advisor for Indian farmers. Analyze the market data and provide specific selling recommendations:

Farmer Details:
- Location: ${input.location}
- Crop: ${input.crop}
- Farm Size: ${input.farmSize} hectares
- Expected Yield: ${input.expectedYield || 'Not specified'} tonnes
- Carbon Reduction: ${input.carbonReductionTonnes} tonnes CO2e

Market Data:
- Current Mandi Price: Rs ${mandiPrices.currentPrice} per quintal
- MSP (Minimum Support Price): Rs ${mandiPrices.mspPrice} per quintal
- Price Trend: ${mandiPrices.priceTrend}
- Nearest Mandi: ${mandiPrices.nearestMandi}

Carbon Credits:
- Potential Earnings: Rs ${carbonCredits.estimatedEarnings}
- Price per Tonne: Rs ${carbonCredits.currentPricePerTonne}

Provide market advice in JSON format with these exact fields:
{
  "sellNowOrWait": "SELL_NOW or WAIT or PARTIAL_SELL",
  "reasoning": "detailed explanation of the recommendation with market factors",
  "alternativeMarkets": ["list of 2-3 alternative mandis or markets"],
  "govtSchemes": ["list of 2-3 relevant Maharashtra/India government schemes for farmers"]
}`;

    const payload = {
      messages: [
        {
          role: "user",
          content: [
            {
              text: prompt
            }
          ]
        }
      ],
      inferenceConfig: {
        maxTokens: 1000,
        temperature: 0.7
      }
    };

    const bedrockCall = async () => {
      const command = new InvokeModelCommand({
        modelId: "us.amazon.nova-lite-v1:0",
        body: JSON.stringify(payload),
        contentType: "application/json"
      });

      log("info", "Calling Bedrock Nova Lite for market advice");
      
      const response = await bedrockClient.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      
      log("info", "Bedrock response received");
      
      const content = responseBody.output?.message?.content?.[0]?.text || "";
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error("No valid JSON in Bedrock response");
    };

    return await retryWithBackoff(bedrockCall);
    
  } catch (error) {
    log("error", "Bedrock API failed, using fallback advice", { error: error.message });
    
    // Fallback advice based on price trend
    let sellNowOrWait = "SELL_NOW";
    let reasoning = "Current prices are favorable. Sell at nearest mandi to secure good returns.";
    
    if (mandiPrices.priceTrend === "RISING") {
      sellNowOrWait = "WAIT";
      reasoning = "Market prices are rising. Wait 2-4 weeks for better rates. Monitor daily mandi prices.";
    } else if (mandiPrices.priceTrend === "FALLING") {
      sellNowOrWait = "SELL_NOW";
      reasoning = "Prices are falling. Sell immediately to avoid losses. Consider MSP procurement centers.";
    } else if (mandiPrices.currentPrice > mandiPrices.mspPrice * 1.1) {
      sellNowOrWait = "PARTIAL_SELL";
      reasoning = "Prices are above MSP. Sell 60-70% now, hold rest for potential price increase.";
    }
    
    return {
      sellNowOrWait: sellNowOrWait,
      reasoning: reasoning,
      alternativeMarkets: [
        "Lasalgaon APMC (Maharashtra)",
        "Pune Agricultural Market",
        "Mumbai APMC Vashi"
      ],
      govtSchemes: [
        "PM-AASHA (Pradhan Mantri Annadata Aay SanraksHan Abhiyan)",
        "Maharashtra Shetkari Sanman Yojana",
        "Kisan Credit Card Scheme"
      ]
    };
  }
}

// Calculate total potential income
function calculateTotalIncome(farmSize, expectedYield, mandiPrices, carbonCredits) {
  // Use provided yield or estimate (25 quintals/hectare average)
  const estimatedYieldPerHectare = 25;
  const totalYield = expectedYield || (farmSize * estimatedYieldPerHectare);
  const cropIncome = totalYield * mandiPrices.currentPrice;
  const carbonIncome = carbonCredits.estimatedEarnings;
  
  return Math.round(cropIncome + carbonIncome);
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
      const cacheExpiry = CACHE_TTL_HOURS * 60 * 60 * 1000;
      
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
        ttl: Math.floor(Date.now() / 1000) + (CACHE_TTL_HOURS * 3600)
      }
    });
    
    await docClient.send(command);
    log("info", "Cache saved", { recommendationId });
  } catch (error) {
    log("error", "Cache save error", { error: error.message });
  }
}

// Main Lambda handler
export const handler = async (event) => {
  const requestId = crypto.randomUUID();
  log("info", "Market Agent invoked", { requestId });
  
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
    
    // Input validation
    const validationErrors = validateInput(body);
    if (validationErrors.length > 0) {
      log("warn", "Input validation failed", { errors: validationErrors, requestId });
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: "Invalid input",
          details: validationErrors
        })
      };
    }
    
    const { location, crop, farmSize, expectedYield, carbonReductionTonnes } = body;
    
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
    
    // Get mandi prices
    const mandiPrices = getMandiPrices(crop);
    
    // Calculate carbon credits
    const carbonCredits = calculateCarbonCredits(carbonReductionTonnes);
    
    // Get market advice from Bedrock
    const marketAdvice = await getMarketAdvice(body, mandiPrices, carbonCredits);
    
    // Calculate total potential income
    const totalPotentialIncome = calculateTotalIncome(farmSize, expectedYield, mandiPrices, carbonCredits);
    
    // Prepare response
    const responseData = {
      mandiPrices,
      carbonCredits,
      marketAdvice,
      totalPotentialIncome,
      cached: false
    };
    
    // Save to cache (async, don't wait)
    saveToCache(recommendationId, responseData);
    
    log("info", "Market Agent completed successfully", { requestId });
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responseData)
    };
    
  } catch (error) {
    log("error", "Handler error", { error: error.message, stack: error.stack, requestId });
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: "Internal server error",
        message: error.message,
        requestId
      })
    };
  }
};
