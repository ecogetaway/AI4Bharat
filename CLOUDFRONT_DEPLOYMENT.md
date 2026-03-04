# AI4Bharat - CloudFront Deployment Guide

Deploy the frontend to **AWS S3 + CloudFront** for global CDN delivery and low-latency access (especially useful for rural areas).

## Prerequisites

- AWS CLI configured (`aws configure`)
- Build output in `prototype/dist/`

---

## Option A: One-Time Manual Setup

### Step 1: Build the App

```bash
cd prototype
npm run build
```

### Step 2: Create S3 Bucket

```bash
# Replace ai4bharat-your-unique-id with a globally unique bucket name
BUCKET_NAME=ai4bharat-frontend-$(date +%s)

aws s3 mb s3://$BUCKET_NAME --region us-east-1

# Enable static website hosting
aws s3 website s3://$BUCKET_NAME \
  --index-document index.html \
  --error-document index.html
```

### Step 3: Upload Build to S3

```bash
cd prototype
aws s3 sync dist/ s3://$BUCKET_NAME --delete
```

### Step 4: Create CloudFront Distribution

1. Go to **AWS Console** → **CloudFront** → **Create distribution**
2. **Origin settings:**
   - Origin domain: Select your S3 bucket (`$BUCKET_NAME.s3.us-east-1.amazonaws.com`)
   - Origin access: **Origin access control (recommended)** → Create new OAC
   - Or use **Legacy access identities** if OAC is not available
3. **Default cache behavior:**
   - Viewer protocol policy: **Redirect HTTP to HTTPS**
   - Allowed HTTP methods: **GET, HEAD, OPTIONS**
   - Cache policy: **CachingOptimized** (or CachingDisabled for dev)
4. **Error pages** (required for React Router SPA):
   - Add custom error response:
     - HTTP error code: **403**
     - Response page path: **/index.html**
     - HTTP response code: **200**
   - Add another for **404** → `/index.html` → 200
5. **Create distribution**

### Step 5: Update S3 Bucket Policy (if using OAC)

After creating the distribution, CloudFront will show a banner with a policy to copy. Apply it:

```bash
# Get the policy from CloudFront console, then:
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json
```

### Step 6: Get Your URL

CloudFront URL: `https://d1234abcd.cloudfront.net` (from the distribution details)

---

## Option B: Deploy Script (After Initial Setup)

```bash
# From project root
./deploy-cloudfront.sh
```

---

## SPA Routing (React Router)

For client-side routing to work, CloudFront must return `index.html` for 404/403 errors. This is configured in Step 4 above.

---

## Custom Domain (Optional)

1. In CloudFront distribution → **General** → **Edit** → Add custom domain (e.g. `app.ai4bharat.in`)
2. Request an ACM certificate in **us-east-1** for your domain
3. Add the CNAME record to your DNS pointing to the CloudFront domain

---

## Re-deploying

After pushing changes to GitHub:

```bash
cd prototype
npm run build
aws s3 sync dist/ s3://YOUR_BUCKET_NAME --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

The invalidation ensures users get the latest build within 1–2 minutes.

---

## Cost Estimate

- **S3**: ~$0.023/GB storage + minimal request costs
- **CloudFront**: ~$0.085/GB for first 10TB (free tier: 1TB/month for 12 months)
- **Typical**: ~$1–5/month for a low-traffic site
