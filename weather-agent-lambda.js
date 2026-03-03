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

const TABLE_NAME = "farm-recommendations";
const CACHE_TTL_HOURS = 1;
const KNOWLEDGE_BASE_ID = "I9TQGNSPWH";

// Indian city coordinates mapping
const INDIAN_CITIES = {
  "mumbai": { lat: 19.0760, lon: 72.8777 },
  "delhi": { lat: 28.7041, lon: 77.1025 },
  "bangalore": { lat: 12.9716, lon: 77.5946 },
  "hyderabad": { lat: 17.3850, lon: 78.4867 },
  "ahmedabad": { lat: 23.0225, lon: 72.5714 },
  "chennai": { lat: 13.0827, lon: 80.2707 },
  "kolkata": { lat: 22.5726, lon: 88.3639 },
  "pune": { lat: 18.5204, lon: 73.8567 },
  "jaipur": { lat: 26.9124, lon: 75.7873 },
  "lucknow": { lat: 26.8467, lon: 80.9462 },
  "nashik": { lat: 19.9975, lon: 73.7898 },
  "nagpur": { lat: 21.1458, lon: 79.0882 },
  "indore": { lat: 22.7196, lon: 75.8577 },
  "bhopal": { lat: 23.2599, lon: 77.4126 },
  "patna": { lat: 25.5941, lon: 85.1376 }
};

// Generate MD5 hash for cache key
function generateCacheKey(input) {
  const data = JSON.stringify({
    location: input.location,
    crop: input.crop,
    farmSize: input.farmSize,
    irrigationType: input.irrigationType
  });
  const hash = crypto.createHash("md5").update(data).digest("hex");
  return `weather_${hash}`;
}

// Get coordinates from location string
function getCoordinates(location) {
  const cityName = location.toLowerCase().split(",")[0].trim();
  return INDIAN_CITIES[cityName] || INDIAN_CITIES["nashik"]; // Default to Nashik
}

// Fetch weather from Open-Meteo API
async function fetchWeather(location) {
  try {
    const coords = getCoordinates(location);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=Asia/Kolkata&forecast_days=7`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Map weather codes to conditions
    const weatherConditions = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Foggy",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      95: "Thunderstorm",
      96: "Thunderstorm with hail",
      99: "Thunderstorm with heavy hail"
    };
    
    const currentWeather = {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      rainfall: data.current.precipitation,
      condition: weatherConditions[data.current.weather_code] || "Unknown"
    };
    
    const forecast7Days = data.daily.time.map((date, index) => ({
      date: date,
      tempMax: data.daily.temperature_2m_max[index],
      tempMin: data.daily.temperature_2m_min[index],
      precipitation: data.daily.precipitation_sum[index],
      precipitationProbability: data.daily.precipitation_probability_max[index]
    }));
    
    return { currentWeather, forecast7Days };
  } catch (error) {
    console.error("Weather API error:", error);
    // Return mock data if API fails
    return getMockWeatherData();
  }
}

// Mock weather data fallback
function getMockWeatherData() {
  return {
    currentWeather: {
      temperature: 28,
      humidity: 65,
      rainfall: 0,
      condition: "Partly cloudy"
    },
    forecast7Days: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
      tempMax: 30 + Math.random() * 5,
      tempMin: 20 + Math.random() * 5,
      precipitation: Math.random() * 10,
      precipitationProbability: Math.floor(Math.random() * 100)
    }))
  };
}

// Generate weather alerts
function generateAlerts(currentWeather, forecast7Days) {
  const alerts = [];
  
  // High temperature alert
  if (currentWeather.temperature > 35) {
    alerts.push({
      type: "heat",
      severity: "high",
      message: "High temperature alert - Risk of heat stress to crops",
      action: "Increase irrigation frequency and provide shade if possible"
    });
  }
  
  // Heavy rainfall alert
  const upcomingRain = forecast7Days.slice(0, 3).reduce((sum, day) => sum + day.precipitation, 0);
  if (upcomingRain > 50) {
    alerts.push({
      type: "rainfall",
      severity: "medium",
      message: "Heavy rainfall expected in next 3 days",
      action: "Ensure proper drainage and delay fertilizer application"
    });
  }
  
  // Low humidity alert
  if (currentWeather.humidity < 40) {
    alerts.push({
      type: "humidity",
      severity: "medium",
      message: "Low humidity levels detected",
      action: "Monitor soil moisture closely and adjust irrigation"
    });
  }
  
  // Drought risk
  const recentRain = forecast7Days.slice(0, 7).reduce((sum, day) => sum + day.precipitation, 0);
  if (recentRain < 10) {
    alerts.push({
      type: "drought",
      severity: "high",
      message: "Low rainfall forecast for next week",
      action: "Implement water conservation measures immediately"
    });
  }
  
  return alerts;
}

// Call Amazon Bedrock Nova Lite for farming advice
async function getFarmingAdvice(input, weatherData) {
  try {
    const prompt = `You are an expert agricultural advisor for Indian farmers. Analyze the following data and provide specific farming recommendations:

Location: ${input.location}
Crop: ${input.crop}
Farm Size: ${input.farmSize} hectares
Irrigation Type: ${input.irrigationType}

Current Weather:
- Temperature: ${weatherData.currentWeather.temperature}°C
- Humidity: ${weatherData.currentWeather.humidity}%
- Rainfall: ${weatherData.currentWeather.rainfall}mm
- Condition: ${weatherData.currentWeather.condition}

7-Day Forecast Summary:
${weatherData.forecast7Days.map(day => `${day.date}: ${day.tempMin}-${day.tempMax}°C, Rain: ${day.precipitation}mm`).join('\n')}

Provide recommendations in JSON format with these exact fields:
{
  "irrigationRecommendation": "specific irrigation advice with timing and quantity",
  "pestRisk": "pest risk assessment and prevention measures",
  "harvestWindow": "optimal harvest timing based on weather",
  "carbonImpact": "carbon footprint considerations and reduction tips"
}`;

    // CORRECT format for Nova models - content must be an array
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

    const command = new InvokeModelCommand({
      modelId: "us.amazon.nova-lite-v1:0",
      body: JSON.stringify(payload),
      contentType: "application/json"
    });

    console.log("Calling Bedrock Nova Lite with payload:", JSON.stringify(payload, null, 2));
    
    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    console.log("Bedrock response:", JSON.stringify(responseBody, null, 2));
    
    // Parse the response - Nova returns content as array
    const content = responseBody.output?.message?.content?.[0]?.text || "";
    
    // Try to extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback if JSON parsing fails
    return {
      irrigationRecommendation: "Monitor soil moisture daily. Water early morning or evening to reduce evaporation.",
      pestRisk: "Moderate risk. Inspect crops regularly for signs of pest damage.",
      harvestWindow: "Monitor crop maturity. Harvest during dry weather for best quality.",
      carbonImpact: "Use drip irrigation to reduce water usage and carbon footprint by 30%."
    };
    
  } catch (error) {
    console.error("Bedrock API error:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    // Return default advice if Bedrock fails
    return {
      irrigationRecommendation: `For ${input.irrigationType} irrigation, maintain consistent moisture levels. Water during cooler hours.`,
      pestRisk: "Regular monitoring recommended. Use integrated pest management practices.",
      harvestWindow: "Check crop maturity indicators. Plan harvest during favorable weather conditions.",
      carbonImpact: "Optimize irrigation timing and consider organic practices to reduce carbon emissions."
    };
  }
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
        return response.Item.data;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Cache check error:", error);
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
  } catch (error) {
    console.error("Cache save error:", error);
    // Don't fail the request if cache save fails
  }
}

// Main Lambda handler
export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  // Handle OPTIONS preflight
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    // Parse input
    const body = JSON.parse(event.body);
    const { location, crop, farmSize, irrigationType } = body;
    
    // Validate input
    if (!location || !crop || !farmSize || !irrigationType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: "Missing required fields: location, crop, farmSize, irrigationType" 
        })
      };
    }
    
    // Generate cache key with weather_ prefix
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
    
    // Fetch weather data
    const weatherData = await fetchWeather(location);
    
    // Generate alerts
    const alerts = generateAlerts(weatherData.currentWeather, weatherData.forecast7Days);
    
    // Get farming advice from Bedrock
    const farmingAdvice = await getFarmingAdvice(body, weatherData);
    
    // Prepare response
    const responseData = {
      currentWeather: weatherData.currentWeather,
      forecast7Days: weatherData.forecast7Days,
      alerts,
      farmingAdvice,
      cached: false
    };
    
    // Save to cache (async, don't wait)
    saveToCache(recommendationId, responseData);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(responseData)
    };
    
  } catch (error) {
    console.error("Handler error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: "Internal server error",
        message: error.message 
      })
    };
  }
};
