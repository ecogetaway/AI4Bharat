# Requirements.md Generation Prompt for AI-Powered Sustainability Solution (AWS Kiro)

## Context

You are designing an innovative AI solution to address critical sustainability challenges. The solution must be practical, measurable, and scalable, with clear environmental and economic benefits. Use **AWS Kiro only** to generate the document, and align requirements to AWS managed services where relevant.

## Document Structure

### 1. PROBLEM DEFINITION

Define ONE specific sustainability challenge from these domains (pick one and stick to it throughout):

- Industrial carbon footprint monitoring and reduction
- Commercial/residential building energy optimization
- Smart waste management and circular economy
- Water resource conservation and quality management
- Renewable energy grid optimization and forecasting
- Supply chain sustainability and emissions tracking

Include:

- **Current state**: What makes this problem critical right now?
- **Target users**: Who experiences this problem daily?
- **Impact metrics**: Quantify the environmental and economic cost (e.g., "X million tons CO2 annually" or "Y% energy waste")
- **Root causes**: Why hasn't this been solved effectively yet?
- **Why now**: Regulatory, cost, or technology shifts creating urgency

### 2. USER STORIES (INVEST Format)

Create 6-8 user stories across these roles:

- Sustainability/ESG Officer
- Facility/Operations Manager
- Energy Auditor/Consultant
- C-Suite Executive (CFO/CSO)
- Frontline Worker/Technician
- Regulatory Compliance Manager

**Format**: "As a [role], I want [capability] so that [measurable sustainability outcome]"

**Examples**:
- "As a facility manager, I want real-time energy anomaly alerts so that I can reduce unnecessary consumption by 15% monthly"
- "As an ESG officer, I want automated carbon accounting so that I can generate compliance reports 80% faster"

Prioritize using **MoSCoW** (Must have, Should have, Could have, Won't have) and present in a table.

### 3. FUNCTIONAL REQUIREMENTS

#### Core AI Capabilities:

- **Predictive analytics** (specify: energy forecasting, demand prediction, failure prediction)
- **Optimization algorithms** (specify: resource allocation, scheduling, routing)
- **Anomaly detection** (specify: waste patterns, energy spikes, water leaks)
- **Recommendation engine** (specify: efficiency actions, alternative materials, process improvements)
- **Computer vision** (if applicable: waste sorting, equipment monitoring, land use analysis)

#### User Features:

- **Data ingestion methods** (APIs, IoT sensors, manual upload, third-party integrations)
- **Dashboard and visualization** (real-time metrics, historical trends, comparative analysis)
- **Alert and notification system** (threshold-based, ML-driven, escalation workflows)
- **Reporting and export** (automated reports, custom exports, regulatory formats)
- **Mobile accessibility** (field operations, on-site audits, remote monitoring)

#### Integration Requirements:

- Specify systems to connect: BMS, SCADA, ERP, IoT platforms, weather APIs, grid operators
- Data formats and protocols: MQTT, OPC-UA, REST APIs, CSV/JSON uploads
- Authentication and authorization mechanisms

#### Sustainability-Specific Features:

- **Carbon footprint calculator** (scope 1, 2, 3 emissions)
- **ROI calculator** (cost savings, payback period, NPV)
- **Scenario modeling** (what-if analysis, impact simulation)
- **Benchmarking** against industry standards (ENERGY STAR, ISO 50001, GHG Protocol)

### 4. NON-FUNCTIONAL REQUIREMENTS

#### Performance:

- Response time: < 2 seconds for dashboards, < 500ms for alerts
- Data processing: Handle X records/second from IoT sensors
- Scalability: Support Y buildings/facilities/sites concurrently
- AI inference: < 100ms for real-time predictions

#### Usability:

- Accessibility: WCAG 2.1 Level AA compliance
- Multi-language: Support for [specify languages]
- Training requirement: New users productive within 30 minutes
- Mobile-responsive design for iOS and Android

#### Reliability:

- Uptime: 99.5% availability
- Data accuracy: > 95% for AI predictions
- Recovery: < 15 minutes RTO, < 1 hour RPO

#### Security & Privacy:

- Data encryption: At rest (AES-256) and in transit (TLS 1.3)
- Compliance: GDPR, SOC 2, ISO 27001
- Role-based access control (RBAC)
- Audit logging for all data access and changes

#### Solution Sustainability:

- Energy-efficient architecture (serverless, auto-scaling, edge computing)
- Carbon-aware computing (utilize AWS sustainability services)
- Minimal data transfer and storage footprint

### 5. AI/ML REQUIREMENTS

#### Data Requirements:

- **Training data**: Specify volume (e.g., 2 years historical data), quality thresholds
- **Data sources**: IoT sensors (types, frequency), external datasets (weather, carbon factors), user inputs
- **Labeling strategy**: For supervised learning, specify annotation process
- **Data refresh**: Real-time streaming vs. batch updates

#### Model Specifications:

- **Algorithms**: Time series (LSTM, Prophet), classification (XGBoost, Random Forest), optimization (linear programming, genetic algorithms)
- **Performance targets**:
  - Energy prediction: < 10% MAPE (Mean Absolute Percentage Error)
  - Anomaly detection: > 90% precision, > 85% recall
  - Optimization: > 20% improvement over baseline
- **Explainability**: SHAP values, feature importance, natural language explanations
- **Bias detection**: Regular audits for demographic, temporal, or operational bias

#### MLOps:

- Model versioning and A/B testing capability
- Retraining frequency: Weekly/monthly based on data drift
- Monitoring: Track accuracy degradation, data drift, concept drift
- Rollback mechanism for model updates
- Specify AWS services for MLOps (SageMaker Pipelines, Model Registry, CloudWatch)

### 6. SUCCESS METRICS

#### Environmental Impact KPIs:

- Energy consumption reduction: X% or Y kWh saved
- Carbon emissions avoided: Z tons CO2e annually
- Waste diverted from landfill: W tons or %
- Water saved: V gallons/liters
- Renewable energy utilization: % increase

#### Business Metrics:

- Cost savings: $ annually
- ROI: Target payback period (months)
- Process efficiency: % time saved on manual tasks
- User adoption: % of target users actively using within 90 days
- Customer satisfaction: Net Promoter Score (NPS) > 40

#### Technical Metrics:

- AI model accuracy: As specified in Section 5
- System uptime and reliability: As specified in Section 4
- API response times: As specified in Section 4
- Data quality score: > 90% completeness and accuracy

### 7. STAKEHOLDERS

#### Primary Stakeholders (Direct Users):

- Role, pain points, success criteria, engagement frequency

#### Secondary Stakeholders (Beneficiaries):

- Executive leadership, regulatory bodies, investors/board, community/public

#### Technical Team:

- Data scientists, software engineers, DevOps/MLOps, UX/UI designers, domain experts (energy engineers, environmental scientists)

### 8. SCOPE

#### In Scope:

- List specific features, user roles, data sources, integrations for MVP

#### Out of Scope (Future Phases):

- Advanced features, additional integrations, expanded geographies, mobile app (if web-only initially)

#### Constraints:

- Hackathon timeline: [specify days]
- Budget limitations: Use free-tier or limited AWS resources
- Data availability: May use synthetic or public datasets initially
- Technical skills: Team expertise in [languages/frameworks]

### 9. ASSUMPTIONS & DEPENDENCIES

#### Assumptions:

- Users have internet connectivity
- IoT sensors are operational and accessible (or synthetic data available)
- Basic AWS infrastructure knowledge within team
- Users willing to adopt AI-driven recommendations

#### Dependencies:

- AWS services availability (specify: SageMaker, Lambda, IoT Core, etc.)
- Access to relevant datasets (public APIs, open data, synthetic generation)
- Third-party integrations (weather APIs, carbon factor databases)
- Stakeholder availability for validation and feedback

#### Risk Mitigation:

- Dependency unavailable → Fallback plan (e.g., use mock data, alternative service)
- Assumption proves false → Contingency (e.g., offline mode, alternative user workflow)

---

## Output Format

Generate a markdown document with:

- Clear hierarchical headings (H1, H2, H3)
- Tables for user stories, requirements lists, and metrics
- Bullet points for lists
- Bold for emphasis on key terms
- Quantifiable metrics wherever possible (avoid vague terms like "improved" without numbers)
- Tie requirements to AWS services where relevant (IAM, KMS, CloudWatch, SageMaker, IoT Core)