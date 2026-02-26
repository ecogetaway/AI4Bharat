# Requirements.md Generation Prompt for Real-time Linguistic Bridge for Local Trade (AWS Kiro)

You are designing an AI-powered web platform that enables local vendors in India to discover real-time prices and negotiate with buyers/suppliers across language barriers. The solution must be practical, mobile-first, and work for users with low digital literacy. Use **AWS services only** throughout the design.

---

## 1. PROBLEM DEFINITION

**Domain**: Local Trade / Commerce in India

**Problem Statement**:
Local vendors (kirana stores, mandi sellers, street vendors) in India face:
- **Language barriers**: India has 22+ official languages; buyers and suppliers often speak different languages
- **Price opacity**: No easy access to real-time market prices; vendors often sell below market rate or buy above it
- **Negotiation inefficiency**: Haggling is cultural but time-consuming; no data-driven support for fair pricing
- **Digital exclusion**: Many vendors have low literacy and limited tech skills

**Impact Metrics**:
- 63 million MSMEs in India; majority are local trade vendors
- Price information asymmetry causes 10-30% margin loss for small vendors
- Language barriers limit trade reach to local geographic areas only

**Root Causes**:
- No unified multilingual platform for local trade
- Existing price discovery tools are in English or single-language only
- Voice-first solutions for Indic languages are underdeveloped

**Why Now**:
- Indic language AI/NLP has matured (Amazon Translate, Bedrock, IndicBERT)
- Government push for digital MSMEs (ONDC, Open Network for Digital Commerce)
- Mobile penetration in rural India is now >70%

---

## 2. USER STORIES (INVEST Format)

Create 6-8 user stories across these roles:
- **Local Vendor** (kirana store owner, mandi seller, street vendor)
- **Buyer** (retail customer, small business owner)
- **Supplier/Wholesaler** (mandi agent, distributor)
- **Platform Admin** (monitors quality, resolves disputes)

**Format**: "As a [role], I want [capability] so that [measurable outcome]"

**Examples to include**:
- As a vendor, I want to see today's mandi prices in my language so that I can set competitive prices
- As a vendor, I want to negotiate with buyers in their language so that I can expand my customer base
- As a buyer, I want to compare prices across vendors so that I get the best deal
- As a vendor, I want voice input so that I don't need to type in a script I can't read

Prioritize using **MoSCoW** (Must have, Should have, Could have, Won't have) and present in a table.

---

## 3. FUNCTIONAL REQUIREMENTS

### Core AI Capabilities:
- **Real-time translation**: Text and voice translation across 10+ Indic languages (Hindi, Tamil, Telugu, Kannada, Bengali, Marathi, Gujarati, Malayalam, Punjabi, Odia)
- **Speech-to-text**: Voice input in Indic languages (Amazon Transcribe)
- **Text-to-speech**: Read out prices/messages in user's language (Amazon Polly)
- **Price prediction**: Suggest fair prices based on market data
- **Negotiation assistant**: AI-driven counter-offer suggestions

### User Features:
- **Price discovery dashboard**: Real-time prices by commodity, location, market
- **Multilingual chat**: Buyer-seller messaging with instant translation
- **Voice-first interface**: Speak to search, negotiate, confirm deals
- **Deal logging**: Record negotiated prices for future reference
- **Alerts**: Price change notifications in user's language

### Data Ingestion:
- **AGMARKNET API**: Government mandi price data
- **Crowdsourced prices**: Vendors report local prices
- **Location-based**: GPS for nearby market prices

### Integration Requirements:
- AGMARKNET / eNAM price feeds
- UPI payment confirmation (optional)
- WhatsApp or SMS fallback for notifications

---

## 4. NON-FUNCTIONAL REQUIREMENTS

### Performance:
- Translation latency: < 500ms for text, < 2s for voice
- Dashboard load time: < 3 seconds on 3G networks
- Support 10,000+ concurrent users

### Usability:
- Accessibility: Large fonts, high contrast, icon-based navigation
- Voice-first: All key actions accessible via voice
- Multi-script support: Devanagari, Tamil, Telugu, Kannada, Bengali, etc.
- Works on low-end Android phones (2GB RAM)

### Reliability:
- Uptime: 99.5%
- Offline mode: Cache recent prices locally
- Graceful degradation if translation service is slow

### Security & Privacy:
- Data encryption: At rest (AES-256) and in transit (TLS 1.3)
- No PII stored beyond session unless user opts in
- RBAC for admin functions
- Audit logging

### Localization:
- UI in 10+ Indic languages
- Date/currency formats localized
- Regional commodity names (e.g., "aloo" vs "potato" vs "உருளைக்கிழங்கு")

---

## 5. AI/ML REQUIREMENTS

### Data Requirements:
- **Training data**: Historical mandi prices (2+ years), commodity synonyms across languages
- **Translation models**: Amazon Translate for Indic languages, custom glossary for trade terms
- **Voice data**: Indic language speech samples for Transcribe tuning

### Model Specifications:
- **Translation**: Amazon Translate (Indic languages) or Amazon Bedrock for complex context
- **Speech-to-text**: Amazon Transcribe with Indic language support
- **Text-to-speech**: Amazon Polly (Indic voices)
- **Price prediction**: Time-series model (Prophet, LSTM) on SageMaker
- **Negotiation assistant**: LLM-based (Bedrock Claude/Titan) with trade context

### MLOps:
- Model versioning via SageMaker Model Registry
- A/B testing for translation quality
- Drift detection for price prediction accuracy
- Retraining trigger when MAPE > 15%

---

## 6. SUCCESS METRICS

### User Engagement:
- DAU/MAU ratio > 30%
- Average session duration > 3 minutes
- Voice input usage > 40% of sessions

### Business Impact:
- Vendor margin improvement: +10% within 3 months of use
- Cross-language transactions: 20% of all deals involve translation
- Price discovery usage: 70% of users check prices before selling

### Technical Metrics:
- Translation accuracy: > 90% BLEU score for trade conversations
- Speech recognition accuracy: > 85% for Indic languages
- Price prediction: < 12% MAPE

---

## 7. STAKEHOLDERS

### Primary (Direct Users):
- **Local Vendor**: Wants fair prices, more customers, easy-to-use app
- **Buyer**: Wants best deals, trust, language comfort
- **Supplier/Wholesaler**: Wants demand visibility, faster sales

### Secondary (Beneficiaries):
- Government (ONDC, digital India mission)
- Mandi boards (data insights)
- Payment providers (transaction volume)

### Technical Team:
- Full-stack developers, ML engineers, UX designers, Indic language specialists

---

## 8. SCOPE

### In Scope (MVP):
- Price discovery for 5 commodities (vegetables, fruits, grains)
- Translation for 5 languages (Hindi, Tamil, Telugu, Kannada, Bengali)
- Voice input/output
- Buyer-seller chat with translation
- Basic negotiation suggestions

### Out of Scope (Future):
- Payment integration (UPI)
- Inventory management
- Logistics/delivery coordination
- All 22 scheduled languages

### Constraints:
- Hackathon timeline: ~10 hours
- AWS services only
- Must work on mobile web (no native app)

---

## 9. ASSUMPTIONS & DEPENDENCIES

### Assumptions:
- Users have smartphones with internet (3G minimum)
- AGMARKNET API is accessible and returns data reliably
- Amazon Translate/Transcribe support required Indic languages

### Dependencies:
- AWS services: Translate, Transcribe, Polly, Bedrock, Lambda, API Gateway, DynamoDB, S3, CloudFront
- AGMARKNET / eNAM API access
- Sample commodity price data for demo

### Risk Mitigation:
- API unavailable → Use cached/mock data
- Translation quality low → Fallback to English with disclaimer
- Voice recognition fails → Text input fallback

---

## Output Format

- Clear hierarchical headings (H1, H2, H3)
- Tables for user stories, requirements, metrics
- Bullet points for lists
- Bold for key terms
- Quantifiable metrics wherever possible
- Tie all requirements to AWS services
