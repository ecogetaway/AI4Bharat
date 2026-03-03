import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const body = JSON.parse(event.body);
    const { farmSize, crop, fertilizerType, irrigationMethod, pesticideUsage, farmerName, location } = body;

    const prompt = `You are an expert agricultural sustainability advisor for Indian farmers. Farmer ${farmerName} has ${farmSize} hectares in ${location}. They grow ${crop} using ${fertilizerType} fertilizers, ${irrigationMethod} irrigation, and ${pesticideUsage} pesticide usage. Give exactly 3 specific recommendations to reduce carbon emissions. For each recommendation provide: title, priority (HIGH/MEDIUM/LOW), carbon reduction in tonnes CO2e/year, investment cost in INR, annual savings in INR, and one relevant Maharashtra/India government scheme. Format as JSON array with fields: title, priority, carbonReduction, investment, annualSavings, govtScheme, description.`;

    const payload = {
      anthropic_version: "bedrock-2023-05-31",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }]
    };

    const command = new InvokeModelCommand({
      modelId: "arn:aws:bedrock:us-east-1:192676124351:inference-profile/global.anthropic.claude-sonnet-4-6",
      body: JSON.stringify(payload),
      contentType: "application/json"
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const text = responseBody.content[0].text;
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const recommendations = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ recommendations })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
