# AI4Bharat - CloudFront Deployment Guide (AWS Console Only)

Deploy the frontend to **AWS S3 + CloudFront** using only the AWS web console—no CLI required.

## Prerequisites

- AWS account
- Build output in `prototype/dist/`

---

## Step 1: Build the App

On your computer, in a terminal:

```bash
cd prototype
npm run build
```

This creates the `dist/` folder with your built app.

---

## Step 2: Create S3 Bucket

1. Go to [AWS Console](https://console.aws.amazon.com) → **S3**
2. Click **Create bucket**
3. **Bucket name:** `ai4bharat-frontend` (or any unique name like `ai4bharat-frontend-12345`)
4. **Region:** `us-east-1` (N. Virginia)
5. **Block Public Access:** Uncheck **Block all public access** (we need public read for the website)
6. Acknowledge the warning
7. Click **Create bucket**

---

## Step 3: Enable Static Website Hosting

1. Open your bucket → **Properties** tab
2. Scroll to **Static website hosting** → **Edit**
3. Select **Enable**
4. **Index document:** `index.html`
5. **Error document:** `index.html` (required for React Router)
6. Click **Save changes**

---

## Step 4: Upload Build Files to S3

1. Open your bucket → **Objects** tab
2. Click **Upload**
3. Click **Add files** and select **all files** from `prototype/dist/`:
   - `index.html` (in dist root)
   - Everything inside `dist/assets/` (JS, CSS, images)
4. Click **Upload**
5. Wait for upload to complete

---

## Step 5: Create CloudFront Distribution

1. Go to [CloudFront](https://console.aws.amazon.com/cloudfront) → **Create distribution**

2. **Origin settings:**
   - **Origin domain:** Choose your S3 bucket from the dropdown (e.g. `ai4bharat-frontend.s3.us-east-1.amazonaws.com`)
   - **Origin access:** Select **Origin access control settings (recommended)**
   - Click **Create control setting** → keep defaults → **Create**
   - **Name:** leave default

3. **Default cache behavior:**
   - **Viewer protocol policy:** Redirect HTTP to HTTPS
   - **Allowed HTTP methods:** GET, HEAD, OPTIONS
   - **Cache policy:** CachingOptimized

4. **Settings:**
   - **Price class:** Use only North America and Europe (cheaper) or Use all edge locations

5. Click **Create distribution**

6. **Important:** A yellow banner will appear: *"The S3 bucket policy needs to be updated"*. Click **Copy policy** — you’ll use this in Step 6.

---

## Step 6: Update S3 Bucket Policy

1. Go back to **S3** → your bucket → **Permissions** tab
2. Scroll to **Bucket policy** → **Edit**
3. Paste the policy you copied from CloudFront (replace any existing policy)
4. Update the bucket name in the policy if it says `"Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"` — replace `YOUR-BUCKET-NAME` with your actual bucket name
5. Click **Save changes**

---

## Step 7: Add Error Pages (for React Router)

1. Go to **CloudFront** → your distribution → **Error pages** tab
2. Click **Create custom error response**

   **First error:**
   - **HTTP error code:** 403
   - **Customize error response:** Yes
   - **Response page path:** `/index.html`
   - **HTTP response code:** 200
   - Click **Save**

   **Second error:**
   - Click **Create custom error response** again
   - **HTTP error code:** 404
   - **Customize error response:** Yes
   - **Response page path:** `/index.html`
   - **HTTP response code:** 200
   - Click **Save**

---

## Step 8: Get Your URL

1. In CloudFront → your distribution
2. Copy the **Distribution domain name** (e.g. `d1234abcd.cloudfront.net`)
3. Your site is live at: **https://d1234abcd.cloudfront.net**

It may take 5–10 minutes for the first deployment to propagate.

---

## Re-deploying (When You Push Changes)

1. **Build:** `cd prototype && npm run build`
2. **Upload:** In S3 → your bucket → **Objects** → select all files → **Delete**
3. **Upload:** Click **Upload** → add all files from `prototype/dist/` again
4. **Invalidate cache:** In CloudFront → your distribution → **Invalidations** tab → **Create invalidation** → enter `/*` → **Create**

---

## Custom Domain (Optional)

1. CloudFront → your distribution → **General** → **Edit** → add your domain under **Alternate domain names (CNAMEs)**
2. Request an ACM certificate in **us-east-1** for your domain
3. Add a CNAME record in your DNS pointing to the CloudFront domain

---

## Cost Estimate

- **S3:** ~$0.023/GB storage
- **CloudFront:** ~$0.085/GB (free tier: 1TB/month for 12 months)
- **Typical:** ~$1–5/month for a low-traffic site
