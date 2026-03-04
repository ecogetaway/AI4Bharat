#!/bin/bash
# AI4Bharat - Deploy frontend to S3 + CloudFront
# Usage: ./deploy-cloudfront.sh
# Set BUCKET_NAME and DIST_ID below after initial setup

set -e

BUCKET_NAME="${AI4BHARAT_BUCKET:-ai4bharat-frontend}"
DIST_ID="${AI4BHARAT_DIST_ID:-}"
PROTOTYPE_DIR="$(cd "$(dirname "$0")/prototype" && pwd)"

echo "🚀 Building frontend..."
cd "$PROTOTYPE_DIR"
npm run build

if [ ! -d "dist" ]; then
  echo "❌ Build failed - dist/ not found"
  exit 1
fi

echo "📤 Uploading to S3..."
aws s3 sync dist/ "s3://$BUCKET_NAME" --delete

if [ -n "$DIST_ID" ]; then
  echo "🔄 Invalidating CloudFront cache..."
  aws cloudfront create-invalidation --distribution-id "$DIST_ID" --paths "/*"
  echo "✅ Invalidation submitted. Changes will propagate in 1-2 minutes."
else
  echo "⚠️  No DIST_ID set. Set AI4BHARAT_DIST_ID to invalidate CloudFront cache."
fi

echo "✅ Deploy complete!"
