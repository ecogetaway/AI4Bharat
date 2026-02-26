# Design.md Generation Prompt for Real-time Linguistic Bridge for Local Trade (AWS Kiro)

Generate a comprehensive Design.md document for an AI-powered web platform that enables local vendors in India to discover real-time prices and negotiate with buyers/suppliers across language barriers. Use **AWS services only** and ground all architecture decisions in the AWS Well-Architected Framework.

---

## Section 1: System Architecture Overview

- Provide a high-level system architecture diagram (Mermaid preferred)
- Describe the overall structure of the solution
- Key components:
  - **Frontend**: React/Next.js hosted on S3 + CloudFront
  - **API Layer**: API Gateway + Lambda
  - **Translation**: Amazon Translate
  - **Speech**: Amazon Transcribe (STT) + Amazon Polly (TTS)
  - **AI/LLM**: Amazon Bedrock (negotiation assistant, context understanding)
  - **Database**: DynamoDB (user data, deals) + S3 (price history)
  - **Real-time**: AWS AppSync or WebSockets via API Gateway
  - **Price ingestion**: Lambda + EventBridge (scheduled AGMARKNET pulls)
- Highlight AI/ML integration points
- Explain data flow for key use cases (price lookup, translation, negotiation)

---

## Section 2: AI/ML Pipeline Design

### Data Collection:
- AGMARKNET API for mandi prices (scheduled Lambda pulls)
- Crowdsourced vendor-reported prices (API → DynamoDB)
- Voice audio from users (Transcribe input)

### Data Preprocessing:
- Normalize commodity names across languages (synonym mapping)
- Clean price outliers
- Validate location data

### Feature Engineering:
- Price trends by commodity, location, season
- User negotiation patterns
- Language preferences

### Model Components:

| Component | AWS Service | Purpose |
|-----------|-------------|---------|
| Translation | Amazon Translate | Text translation across Indic languages |
| Speech-to-Text | Amazon Transcribe | Voice input in Indic languages |
| Text-to-Speech | Amazon Polly | Read prices/messages aloud |
| Negotiation AI | Amazon Bedrock (Claude/Titan) | Suggest counter-offers, fair prices |
| Price Prediction | SageMaker (Prophet/LSTM) | Forecast commodity prices |

### Inference:
- Real-time translation via API Gateway → Lambda → Translate
- Voice processing: Audio → S3 → Transcribe → Lambda → Response
- Negotiation: Chat context → Bedrock → Suggested reply

### Monitoring:
- CloudWatch for latency, error rates
- Translation quality feedback loop (user corrections)
- Price prediction drift detection

### Explainability:
- Show "market average" alongside AI-suggested price
- Display confidence level for price predictions
- Transparent negotiation reasoning in user's language

---

## Section 3: Technology Stack (AWS-Aligned)

| Layer | Technology | AWS Service |
|-------|------------|-------------|
| Frontend | React, TypeScript, Tailwind CSS | S3 + CloudFront |
| Backend API | Node.js / Python | API Gateway + Lambda |
| Translation | - | Amazon Translate |
| Speech-to-Text | - | Amazon Transcribe |
| Text-to-Speech | - | Amazon Polly |
| LLM / Negotiation AI | - | Amazon Bedrock |
| Price Prediction | Python, Prophet | Amazon SageMaker |
| Database | - | DynamoDB |
| Object Storage | - | S3 |
| Real-time Messaging | GraphQL | AWS AppSync |
| Scheduling | - | EventBridge + Lambda |
| Observability | - | CloudWatch, X-Ray |
| Auth | - | Amazon Cognito |
| CDN | - | CloudFront |

---

## Section 4: Data Flow Diagrams

### Price Discovery Flow (Mermaid):
```
flowchart LR
    A[User Voice/Text Input] --> B[API Gateway]
    B --> C[Lambda: Parse Intent]
    C --> D[Amazon Translate: To English]
    D --> E[Query DynamoDB: Prices]
    E --> F[Amazon Translate: To User Language]
    F --> G[Amazon Polly: TTS Optional]
    G --> H[Response to User]
```

### Negotiation Flow (Mermaid):
```
flowchart LR
    A[Buyer Message in Hindi] --> B[Translate to English]
    B --> C[Bedrock: Analyze Intent]
    C --> D[Bedrock: Suggest Counter-Offer]
    D --> E[Translate to Vendor Language Tamil]
    E --> F[Display to Vendor]
    F --> G[Vendor Reply in Tamil]
    G --> H[Translate to Hindi for Buyer]
```

### Price Ingestion Flow:
```
flowchart LR
    A[EventBridge: Scheduled Trigger] --> B[Lambda: Fetch AGMARKNET]
    B --> C[Process & Normalize]
    C --> D[Store in DynamoDB]
    D --> E[Update Price Cache in S3]
```

---

## Section 5: User Interface Design Concepts

### Design Principles:
- **Voice-first**: Mic button prominent; all actions voice-accessible
- **Icon-heavy**: Reduce text reliance for low-literacy users
- **Large touch targets**: Minimum 48px for mobile
- **High contrast**: Dark mode default for AMOLED battery savings
- **Language selector**: Prominent; remembers preference

### Key Screens:

1. **Home / Price Discovery**
   - Search bar with mic icon
   - Commodity tiles with current price
   - Location selector
   - Language toggle

2. **Price Detail**
   - Current price, trend chart (7-day)
   - Nearby market comparison
   - "Fair price" AI suggestion
   - Share button (WhatsApp)

3. **Chat / Negotiate**
   - Buyer-seller thread with translated messages
   - AI suggestion chip ("Counter with ₹X?")
   - Voice message support
   - Deal confirmation button

4. **My Deals**
   - History of completed negotiations
   - Price achieved vs market average
   - Repeat buyer/seller contacts

### Wireframe Sketch:
```
+-----------------------------------------------+
|  🌐 Language: தமிழ்  |  📍 Chennai           |
+-----------------------------------------------+
|  🎤 [Search or speak...]                      |
+-----------------------------------------------+
|  🍅 Tomato    ₹42/kg   ↑5%                   |
|  🥔 Potato    ₹28/kg   ↓2%                   |
|  🧅 Onion     ₹35/kg   →                     |
+-----------------------------------------------+
|  💬 Chats (2 new)  |  📊 My Deals            |
+-----------------------------------------------+
```

---

## Section 6: Scalability and Deployment

### Scalability:
- **Lambda**: Auto-scales to handle traffic spikes
- **DynamoDB**: On-demand capacity mode
- **CloudFront**: Global edge caching for static assets
- **AppSync**: Managed WebSocket scaling

### Deployment:
- **CI/CD**: AWS CodePipeline + CodeBuild
- **Infrastructure as Code**: AWS CDK or SAM
- **Environments**: Dev → Staging → Prod

### Containerization (if needed):
- ECS Fargate for long-running processes (e.g., batch price updates)

### Disaster Recovery:
- Multi-AZ DynamoDB
- S3 cross-region replication for critical data
- Lambda versioning with aliases for rollback

---

## Section 7: Risk Assessment and Mitigation

| Risk | Severity | Mitigation |
|------|----------|------------|
| Translation errors for trade terms | High | Custom glossary in Amazon Translate; user feedback loop |
| Voice recognition fails for dialects | High | Fallback to text input; progressive improvement with data |
| AGMARKNET API downtime | Medium | Cache prices locally; show "last updated" timestamp |
| Low user adoption | Medium | Partner with mandi associations; WhatsApp integration |
| Data privacy concerns | Medium | Minimal PII; encryption; clear privacy policy in local languages |
| LLM hallucination in negotiation | Medium | Constrain Bedrock prompts; show "suggestion" not "answer" |

---

## Section 8: Accessibility and Localization

### Accessibility:
- Screen reader support (ARIA labels)
- Voice navigation for visually impaired
- Adjustable font sizes

### Localization:
- UI strings in 10+ languages (i18n JSON files)
- Regional commodity names (synonym database)
- Currency format: ₹ with Indian numbering (lakhs, crores)
- Date format: DD-MM-YYYY

---

## Section 9: Testing and Validation Strategy

### Testing Approach:
- **Unit tests**: Lambda functions, translation wrappers
- **Integration tests**: End-to-end price lookup, chat flow
- **Load testing**: Simulate 10K concurrent users (Artillery/Locust)
- **Translation quality**: Human evaluation for 5 languages
- **Voice accuracy**: Test with native speakers from different regions

### Validation:
- Beta test with 10-20 real vendors in one mandi
- Collect feedback on usability, translation quality
- Iterate before wider rollout

### Post-Deployment:
- CloudWatch dashboards for errors, latency
- User feedback widget in-app
- Weekly translation quality audits

---

## Section 10: MVP Scope and Roadmap

### MVP (Hackathon):
- Price discovery for 5 commodities
- 5 languages: Hindi, Tamil, Telugu, Kannada, Bengali
- Voice input + text
- Basic buyer-seller chat with translation
- AI counter-offer suggestion

### Post-Hackathon (1-3 months):
- Expand to 15 commodities, 10 languages
- WhatsApp integration
- Deal history analytics
- UPI payment confirmation

### Long-term (6-12 months):
- All 22 scheduled languages
- Supplier-side inventory management
- Logistics/delivery coordination
- Offline mode with sync

---

## Instructions for Kiro

- Use Mermaid for all diagrams
- Be specific about AWS service choices
- Prioritize mobile-first, voice-first design
- Link all design decisions to user needs (low literacy, multilingual)
- Use clear headings (H1–H3), bullets, and tables for readability
- Include trade-offs and justifications
