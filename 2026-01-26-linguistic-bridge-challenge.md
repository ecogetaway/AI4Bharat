# Challenge Breakdown: Real-time Linguistic Bridge for Local Trade

**Date**: 2026-01-26  
**Hackathon**: AWS Kiro  
**Deadline**: ~10 hours

---

## Challenge Statement

> **Creating a Real-time Linguistic Bridge for Local Trade**  
> A web platform for local vendors that provides instant AI-driven price discovery and negotiation tools.  
> Target: India

---

## Challenge Breakdown

| Term | Meaning |
|------|---------|
| **Linguistic Bridge** | AI-powered translation/communication across India's 22+ languages and dialects (Hindi, Tamil, Telugu, Marathi, Bengali, etc.) |
| **Real-time** | Instant translation, live price feeds, immediate negotiation support |
| **Local Trade** | Small vendors—kirana stores, mandi (wholesale markets), street sellers, local retailers |

---

## What the App Should Do

### 1. Price Discovery
- Show real-time market prices for goods (vegetables, grains, commodities, etc.)
- Compare prices across nearby markets or mandis
- Help vendors know fair buying/selling prices

### 2. Negotiation Tools
- AI-assisted haggling (common in Indian trade)
- Suggest counter-offers based on market data
- Multilingual buyer-seller chat with instant translation

### 3. Linguistic Bridge
- Vendor speaks Tamil, buyer speaks Hindi → app translates in real-time
- Voice-first option (many vendors have literacy barriers)
- Support for regional scripts and romanized input

---

## India-Specific Considerations

| Factor | Design Implication |
|--------|---------------------|
| 22+ languages | Multilingual NLP, Indic language models |
| Low digital literacy | Simple UI, voice input, minimal text |
| Mobile-first | Responsive web, works on low-end phones |
| Haggling culture | AI negotiation assistant is core feature |
| Price opacity | Real-time price feeds from AGMARKNET, mandis |
| Connectivity | Offline-first or low-bandwidth mode |

---

## Example User Flow

1. Vendor (speaks Kannada) opens the app
2. Searches for "tomato price today" via voice
3. App shows live mandi prices in Kannada
4. Buyer (speaks Hindi) messages vendor to negotiate
5. App translates messages both ways in real-time
6. AI suggests a counter-offer based on market rate
7. Deal is closed, price is logged

---

## Next Steps

- [ ] Generate `requirements.md` prompt for AWS Kiro
- [ ] Generate `design.md` prompt for AWS Kiro
- [ ] Run prompts through Kiro to get final documents
- [ ] Build MVP web application
- [ ] Prepare submission (diagrams, answers, demo)

---

## AWS Services (Potential)

| Component | AWS Service |
|-----------|-------------|
| Frontend hosting | S3 + CloudFront |
| Backend API | API Gateway + Lambda |
| Translation | Amazon Translate |
| Speech-to-Text | Amazon Transcribe |
| Text-to-Speech | Amazon Polly |
| Database | DynamoDB / RDS |
| Price data ingestion | Lambda + EventBridge |
| AI/ML | Amazon Bedrock / SageMaker |
| Real-time messaging | AWS AppSync / IoT Core |
