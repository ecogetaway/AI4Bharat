# Design.md Refinement Prompt for AWS Kiro

Please update the design.md with the following additions and corrections:

---

## 1. Add AWS Region Specification

Add a section specifying the primary AWS region:
- **Primary Region**: ap-south-1 (Mumbai) — required for India data residency compliance
- **DR Region**: ap-southeast-1 (Singapore) — for disaster recovery
- Mention compliance with India's Digital Personal Data Protection Act (DPDPA) 2023

---

## 2. Add Cost Estimation Section

Add a new section "## Cost Estimation (MVP)" with approximate monthly costs:
- Lambda: ~$50-100 (based on 100K invocations/day)
- DynamoDB: ~$25-50 (on-demand mode for MVP)
- S3 + CloudFront: ~$20-30
- Amazon Translate: ~$15/million characters
- Amazon Transcribe: ~$0.024/minute
- Amazon Polly: ~$4/million characters
- Amazon Bedrock: ~$50-100 (based on usage)
- Total MVP estimate: ~$200-400/month

---

## 3. Add WhatsApp Integration

Under "External APIs" or as a new component, add:
- **WhatsApp Business API Integration** via Amazon Pinpoint or third-party (Twilio/Gupshup)
- Critical for India market — most vendors use WhatsApp
- Use cases: Price alerts, deal confirmations, voice notes

---

## 4. Add Specific Indic Language Support Details

Create a table showing AWS service support for each language:

| Language | AWS Translate | AWS Transcribe | AWS Polly |
|----------|---------------|----------------|-----------|
| Hindi | ✅ | ✅ | ✅ |
| Tamil | ✅ | ✅ | ✅ |
| Telugu | ✅ | ✅ | ✅ |
| Kannada | ✅ | ✅ | ✅ |
| Bengali | ✅ | ✅ | ✅ |
| Marathi | ✅ | ✅ | ✅ |
| Gujarati | ✅ | ✅ | ✅ |
| Malayalam | ✅ | ✅ | ✅ |

Note: For languages with limited AWS support, fallback to Amazon Bedrock with multilingual LLMs.

---

## 5. Add AGMARKNET API Integration Details

Expand the AGMARKNET integration section:
- **API Endpoint**: https://agmarknet.gov.in/
- **Data Available**: Daily mandi prices for 300+ commodities across 7000+ markets
- **Update Frequency**: Daily (previous day's closing prices)
- **Fallback**: eNAM (National Agriculture Market) API
- **Data Format**: JSON/XML
- **Rate Limits**: Handle with caching and scheduled Lambda pulls (2x daily)

---

## 6. Add MVP vs Future Phases Section

### MVP Scope (Hackathon - 10 hours):
- 5 commodities: Tomato, Potato, Onion, Rice, Wheat
- 5 languages: Hindi, Tamil, Telugu, Kannada, Bengali
- Core features: Price discovery, voice search, basic chat translation
- Single region: ap-south-1

### Phase 2 (Post-Hackathon):
- 15 commodities, 10 languages
- WhatsApp integration
- Full negotiation assistant
- Deal history and analytics

### Phase 3 (Production):
- All 22 scheduled languages
- UPI payment integration
- Supplier inventory management
- Multi-region deployment

---

## 7. Add Security Hardening Section

Expand security details:
- **WAF Rules**: Rate limiting, SQL injection protection, geographic restrictions
- **API Gateway**: Throttling (1000 req/sec burst, 500 req/sec sustained)
- **Cognito**: MFA via SMS OTP (common in India)
- **Data Encryption**: KMS-managed keys for DynamoDB and S3
- **Audit Logging**: CloudTrail enabled for all API calls
- **PII Handling**: Phone numbers hashed, location data anonymized

---

## 8. Add Monitoring Dashboard Section

Specify CloudWatch dashboard metrics:
- Translation latency (P50, P95, P99)
- Voice processing success rate
- API Gateway 4xx/5xx error rates
- DynamoDB throttling events
- Lambda cold starts and duration
- Active users (DAU/MAU)
- Deals completed per day

---

## 9. Fix Typo at End

Remove the trailing text at the end of the document: "mechanisms.Caan i suggest any edit s/updates to it?"

---

## 10. Add Offline-First Architecture Details

Expand offline capabilities:
- Service Worker for PWA caching
- IndexedDB for local price data storage
- Background sync for pending transactions
- Cache strategy: Network-first for prices, cache-first for static assets
- Max offline duration: 24 hours with stale data warning

---

## Output

Regenerate the design.md with these additions integrated into the appropriate sections. Maintain the existing structure and Mermaid diagrams.
