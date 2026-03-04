# Fix CORS for Lambda Function URL

Your Lambda API works (curl succeeds). The browser blocks it because of missing CORS headers. Follow these steps:

## Step 1: Open AWS Lambda Console

1. Go to **https://console.aws.amazon.com/lambda**
2. Sign in to your AWS account
3. Find your orchestrator function (e.g. `ai4bharat-orchestrator` or similar)

## Step 2: Edit Function URL CORS

1. Click on the function name
2. Go to **Configuration** tab
3. In the left sidebar, click **Function URL**
4. Click **Edit**

## Step 3: Configure CORS

In the CORS section, set:

| Setting | Value |
|---------|-------|
| **Access-Control-Allow-Origin** | `*` (or `http://localhost:3000` for local dev only) |
| **Access-Control-Allow-Headers** | `Content-Type,Authorization` |
| **Access-Control-Allow-Methods** | `POST, OPTIONS` |
| **Access-Control-Max-Age** | `86400` (optional) |

If you see a JSON editor instead, use:

```json
{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
}
```

## Step 4: Save

Click **Save**. Changes take effect immediately.

## Step 5: Test in Browser

1. Refresh your app at `http://localhost:3000`
2. Click **Get AI Recommendations**
3. It should now work

---

**Note:** If your Lambda uses a **custom response**, ensure the handler returns these headers in the response:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Methods: POST, OPTIONS
```

Some Lambda setups require CORS headers in the function code itself. If the Function URL CORS settings don't work, the Lambda handler must add these headers to every response.
