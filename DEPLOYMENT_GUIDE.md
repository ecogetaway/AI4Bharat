# AI4Bharat Kisan Saarthi - Lambda Deployment Guide

## Overview
This guide covers deploying three Lambda functions for the AI4Bharat Kisan Saarthi agricultural AI system.

## Prerequisites
- AWS Account with appropriate permissions
- AWS CLI configured
- Node.js 20.x runtime
- DynamoDB table created: `farm-recommendations`

---

## Step 1: Create DynamoDB Table

```bash
aws dynamodb create-table \
  --table-name farm-recommendations \
  --attribute-definitions AttributeName=recommendationId,AttributeType=S \
  --key-schema AttributeName=recommendationId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

Enable TTL on the table:
```bash
aws dynamodb update-time-to-live \
  --table-name farm-recommendations \
  --time-to-live-specification "Enabled=true, AttributeName=ttl" \
  --region us-east-1
```

---

## Step 2: Create IAM Role for Lambda Functions

Create a file `lambda-trust-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

Create the IAM role:
```bash
aws iam create-role \
  --role-name AI4Bharat-Lambda-Role \
  --assume-role-policy-document file://lambda-trust-policy.json
```

Attach policies:
```bash
# Basic Lambda execution
aws iam attach-role-policy \
  --role-name AI4Bharat-Lambda-Role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# DynamoDB access
aws iam attach-role-policy \
  --role-name AI4Bharat-Lambda-Role \
  --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess

# Bedrock access
aws iam attach-role-policy \
  --role-name AI4Bharat-Lambda-Role \
  --policy-arn arn:aws:iam::aws:policy/AmazonBedrockFullAccess
```

---

## Step 3: Deploy Weather Agent Lambda

### Package the function:
```bash
zip weather-agent.zip weather-agent-lambda.js
```

### Create Lambda function:
```bash
aws lambda create-function \
  --function-name ai4bharat-weather-agent \
  --runtime nodejs20.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/AI4Bharat-Lambda-Role \
  --handler weather-agent-lambda.handler \
  --zip-file fileb://weather-agent.zip \
  --timeout 30 \
  --memory-size 512 \
  --environment Variables="{DYNAMODB_TABLE=farm-recommendations}" \
  --region us-east-1
```

### Update existing function (if already created):
```bash
aws lambda update-function-code \
  --function-name ai4bharat-weather-agent \
  --zip-file fileb://weather-agent.zip \
  --region us-east-1
```

### Create Function URL:
```bash
aws lambda create-function-url-config \
  --function-name ai4bharat-weather-agent \
  --auth-type NONE \
  --cors AllowOrigins="*",AllowMethods="POST,OPTIONS",AllowHeaders="content-type" \
  --region us-east-1
```

### Test the function:
```bash
aws lambda invoke \
  --function-name ai4bharat-weather-agent \
  --payload file://test-weather.json \
  --region us-east-1 \
  response.json

cat response.json
```

Create `test-weather.json`:
```json
{
  "body": "{\"location\":\"Nashik, Maharashtra India\",\"crop\":\"grapes\",\"farmSize\":5,\"irrigationType\":\"drip\"}"
}
```

---

## Step 4: Deploy Market Agent Lambda

### Package the function:
```bash
zip market-agent.zip market-agent-lambda.js
```

### Create Lambda function:
```bash
aws lambda create-function \
  --function-name ai4bharat-market-agent \
  --runtime nodejs20.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/AI4Bharat-Lambda-Role \
  --handler market-agent-lambda.handler \
  --zip-file fileb://market-agent.zip \
  --timeout 30 \
  --memory-size 512 \
  --environment Variables="{DYNAMODB_TABLE=farm-recommendations}" \
  --region us-east-1
```

### Update existing function:
```bash
aws lambda update-function-code \
  --function-name ai4bharat-market-agent \
  --zip-file fileb://market-agent.zip \
  --region us-east-1
```

### Create Function URL:
```bash
aws lambda create-function-url-config \
  --function-name ai4bharat-market-agent \
  --auth-type NONE \
  --cors AllowOrigins="*",AllowMethods="POST,OPTIONS",AllowHeaders="content-type" \
  --region us-east-1
```

### Test the function:
```bash
aws lambda invoke \
  --function-name ai4bharat-market-agent \
  --payload file://test-market.json \
  --region us-east-1 \
  response.json

cat response.json
```

Create `test-market.json`:
```json
{
  "body": "{\"location\":\"Nashik, Maharashtra India\",\"crop\":\"grapes\",\"farmSize\":5,\"expectedYield\":125,\"carbonReductionTonnes\":2.5}"
}
```

---

## Step 5: Deploy Orchestrator Agent Lambda

### Create IAM policy for Lambda invocation:
```bash
aws iam create-policy \
  --policy-name AI4Bharat-Orchestrator-Policy \
  --policy-document file://orchestrator-iam-policy.json
```

### Attach the policy to the Lambda role:
```bash
aws iam attach-role-policy \
  --role-name AI4Bharat-Lambda-Role \
  --policy-arn arn:aws:iam::YOUR_ACCOUNT_ID:policy/AI4Bharat-Orchestrator-Policy
```

### Package the function:
```bash
zip orchestrator-agent.zip orchestrator-agent-lambda.js
```

### Create Lambda function with environment variables:
```bash
aws lambda create-function \
  --function-name ai4bharat-orchestrator \
  --runtime nodejs20.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/AI4Bharat-Lambda-Role \
  --handler orchestrator-agent-lambda.handler \
  --zip-file fileb://orchestrator-agent.zip \
  --timeout 60 \
  --memory-size 1024 \
  --environment Variables="{DYNAMODB_TABLE=farm-recommendations,RECOMMENDATION_AGENT_URL=https://6qg6qznso7.execute-api.ap-south-1.amazonaws.com/recommendations}" \
  --region us-east-1
```

**Note**: The orchestrator uses Lambda invocation (not HTTP) to call Market and Weather agents, so no URLs needed for those.

### Update existing function:
```bash
aws lambda update-function-code \
  --function-name ai4bharat-orchestrator \
  --zip-file fileb://orchestrator-agent.zip \
  --region us-east-1
```

### Create Function URL:
```bash
aws lambda create-function-url-config \
  --function-name ai4bharat-orchestrator \
  --auth-type NONE \
  --cors AllowOrigins="*",AllowMethods="POST,OPTIONS",AllowHeaders="content-type" \
  --region us-east-1
```

### Test the function:
```bash
aws lambda invoke \
  --function-name ai4bharat-orchestrator \
  --payload file://test-orchestrator.json \
  --region us-east-1 \
  response.json

cat response.json
```

Create `test-orchestrator.json`:
```json
{
  "body": "{\"farmerName\":\"Rajesh Kumar\",\"location\":\"Nashik, Maharashtra India\",\"farmSize\":5,\"crop\":\"grapes\",\"fertilizerType\":\"organic\",\"irrigationMethod\":\"drip\",\"pesticideUsage\":\"low\",\"expectedYield\":125}"
}
```

---

## Step 6: Monitor and Debug

### View CloudWatch Logs:
```bash
# Weather Agent logs
aws logs tail /aws/lambda/ai4bharat-weather-agent --follow --region us-east-1

# Market Agent logs
aws logs tail /aws/lambda/ai4bharat-market-agent --follow --region us-east-1

# Orchestrator logs
aws logs tail /aws/lambda/ai4bharat-orchestrator --follow --region us-east-1
```

### Check DynamoDB cache:
```bash
aws dynamodb scan \
  --table-name farm-recommendations \
  --limit 10 \
  --region us-east-1
```

---

## Step 7: API Gateway Setup (Optional)

If you prefer API Gateway instead of Function URLs:

### Create REST API:
```bash
aws apigateway create-rest-api \
  --name "AI4Bharat Kisan Saarthi API" \
  --description "Agricultural AI Advisory System" \
  --region us-east-1
```

### Create resources and methods for each endpoint:
- `/weather-context` → Weather Agent
- `/market-context` → Market Agent
- `/farm-advisor` → Orchestrator Agent

---

## Environment Variables Summary

### Weather Agent:
- `DYNAMODB_TABLE`: farm-recommendations

### Market Agent:
- `DYNAMODB_TABLE`: farm-recommendations

### Orchestrator Agent:
- `DYNAMODB_TABLE`: farm-recommendations
- `RECOMMENDATION_AGENT_URL`: Existing recommendation Lambda URL (HTTP endpoint)

**Note**: Orchestrator uses direct Lambda invocation for Market and Weather agents (no URLs needed).

---

## Testing Checklist

- [ ] DynamoDB table created with TTL enabled
- [ ] IAM role created with correct permissions
- [ ] Weather Agent deployed and tested
- [ ] Market Agent deployed and tested
- [ ] Orchestrator Agent deployed with correct environment variables
- [ ] All Function URLs created with CORS enabled
- [ ] CloudWatch logs showing structured JSON logs
- [ ] Cache working (check DynamoDB table)
- [ ] Bedrock calls succeeding (check logs)
- [ ] Retry logic working (simulate failures)
- [ ] Input validation working (test with invalid payloads)

---

## Troubleshooting

### Issue: "Module not found" error
**Solution**: Ensure you're using ES modules. Add `"type": "module"` to package.json if needed.

### Issue: Bedrock timeout
**Solution**: Increase Lambda timeout to 60 seconds and check Bedrock model availability in us-east-1.

### Issue: DynamoDB access denied
**Solution**: Verify IAM role has DynamoDB permissions and table name matches environment variable.

### Issue: CORS errors
**Solution**: Ensure Function URL CORS config includes your frontend origin.

### Issue: Cache not working
**Solution**: Check DynamoDB TTL is enabled and cache keys are being generated correctly.

---

## Cost Optimization

1. **DynamoDB**: Use on-demand billing for variable workloads
2. **Lambda**: Start with 512MB memory, adjust based on CloudWatch metrics
3. **Bedrock**: Monitor token usage, implement caching aggressively
4. **CloudWatch**: Set log retention to 7-14 days

---

## Security Best Practices

1. Enable AWS CloudTrail for audit logging
2. Use AWS Secrets Manager for sensitive configuration
3. Implement API throttling in API Gateway
4. Enable AWS WAF for DDoS protection
5. Rotate IAM credentials regularly
6. Use VPC endpoints for DynamoDB access (optional)

---

## Next Steps

1. Set up CloudWatch alarms for errors and latency
2. Implement API key authentication in API Gateway
3. Add request/response logging for compliance
4. Set up CI/CD pipeline for automated deployments
5. Create staging and production environments
6. Implement blue-green deployment strategy
