import React, { useState } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { farmerData } from '../data/mockData'
import farmerAvatar from '../assets/farmer-avatar.jpeg'
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import './RuralFarmerDashboard.css'

const COLORS = ['#ef5350', '#ff7043', '#ffa726', '#66bb6a', '#42a5f5']

function RuralFarmerDashboard() {
  const { 
    farmerName, 
    location, 
    farmSize, 
    carbonFootprint, 
    carbonSequestration,
    netEmissions,
    crops,
    sustainabilityPremium,
    carbonCredits,
    recommendations 
  } = farmerData;

  // State for AI recommendations
  const [aiRecommendations, setAiRecommendations] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    farmSize: farmSize.toString(),
    primaryCrop: 'Rice',
    fertilizerType: 'Mixed',
    irrigationMethod: 'Flood',
    pesticideUsage: 'Medium'
  })

  // Initialize Bedrock client
  const bedrockClient = new BedrockRuntimeClient({
    region: import.meta.env.VITE_AWS_REGION,
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
    }
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const getAIRecommendations = async () => {
    setLoading(true)
    setError(null)

    try {
      const prompt = `Farm Details:
- Farm Size: ${formData.farmSize} hectares
- Primary Crop: ${formData.primaryCrop}
- Fertilizer Type: ${formData.fertilizerType}
- Irrigation Method: ${formData.irrigationMethod}
- Pesticide Usage: ${formData.pesticideUsage}
- Location: ${location}

Please provide exactly 3 specific, actionable recommendations for reducing carbon emissions. For each recommendation, provide:
1. A clear title (max 8 words)
2. The carbon emission reduction impact in tonnes CO₂e/year
3. Initial investment cost in Indian Rupees
4. Annual savings in Indian Rupees (including carbon credits)
5. Priority level (high/medium/low)

Format your response as a JSON array with this exact structure:
[
  {
    "title": "recommendation title",
    "impact": "X.X tonnes CO₂e/year reduction",
    "cost": "₹X,XXX initial investment",
    "savings": "₹X,XXX/year savings + ₹X,XXX carbon credits",
    "priority": "high"
  }
]

Include specific Maharashtra government schemes, KVK resources, and local suppliers where applicable.`

      const payload = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 2000,
        system: "You are an expert agricultural sustainability advisor for Indian farmers. Provide specific, actionable recommendations for reducing carbon emissions with exact costs in Indian Rupees, government scheme names, and local resources. Always mention relevant Maharashtra government schemes and KVK resources.",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      }

      const command = new InvokeModelCommand({
        modelId: import.meta.env.VITE_BEDROCK_MODEL_ID,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(payload)
      })

      const response = await bedrockClient.send(command)
      const responseBody = JSON.parse(new TextDecoder().decode(response.body))
      
      // Parse the AI response
      const aiText = responseBody.content[0].text
      
      // Extract JSON from the response
      const jsonMatch = aiText.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const parsedRecommendations = JSON.parse(jsonMatch[0])
        
        // Transform to match our recommendation format
        const formattedRecommendations = parsedRecommendations.map((rec, index) => ({
          id: `ai-${index + 1}`,
          title: rec.title,
          impact: rec.impact,
          cost: rec.cost,
          savings: rec.savings,
          priority: rec.priority
        }))
        
        setAiRecommendations(formattedRecommendations)
      } else {
        throw new Error('Could not parse AI response')
      }
    } catch (err) {
      console.error('Error calling Bedrock:', err)
      setError('Failed to get AI recommendations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const displayRecommendations = aiRecommendations || recommendations

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="farmer-profile-card">
          <img src={farmerAvatar} alt="Farmer Avatar" className="farmer-avatar" />
          <div className="farmer-info">
            <h2 className="farmer-name">{farmerName}</h2>
            <p className="location">📍 {location} | {farmSize} hectares</p>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-badge success premium-badge-pulse">
            <span className="stat-label">Sustainability Premium</span>
            <span className="stat-value">+{sustainabilityPremium.premiumPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card emissions">
          <div className="metric-icon">🏭</div>
          <div className="metric-content">
            <h3>Total Emissions</h3>
            <p className="metric-value">{carbonFootprint.totalEmissions} <span className="trend-indicator">↓</span></p>
            <p className="metric-unit">tonnes CO₂e/year</p>
            <p className="metric-sub">{carbonFootprint.emissionsPerHectare} tonnes/hectare</p>
          </div>
        </div>

        <div className="metric-card sequestration">
          <div className="metric-icon">🌳</div>
          <div className="metric-content">
            <h3>Carbon Sequestration</h3>
            <p className="metric-value">{carbonSequestration} <span className="trend-indicator up">↑</span></p>
            <p className="metric-unit">tonnes CO₂e/year</p>
            <p className="metric-sub success-text">Soil & vegetation capture</p>
          </div>
        </div>

        <div className="metric-card net">
          <div className="metric-icon">⚖️</div>
          <div className="metric-content">
            <h3>Net Emissions</h3>
            <p className="metric-value">{netEmissions} <span className="trend-indicator">↓</span></p>
            <p className="metric-unit">tonnes CO₂e/year</p>
            <p className="metric-sub">{((carbonSequestration / carbonFootprint.totalEmissions) * 100).toFixed(1)}% offset</p>
          </div>
        </div>

        <div className="metric-card premium">
          <div className="metric-icon rupee-icon">₹</div>
          <div className="metric-content">
            <h3>Sustainability Premium</h3>
            <p className="metric-value">₹{sustainabilityPremium.premiumAmount} <span className="trend-indicator up">↑</span></p>
            <p className="metric-unit">per quintal</p>
            <p className="metric-sub success-text">₹{sustainabilityPremium.potentialAnnualIncome.toLocaleString()}/year potential</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <div className="chart-card">
          <h3>Emission Sources Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={carbonFootprint.breakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => `${category}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="emissions"
              >
                {carbonFootprint.breakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Emission Trend (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={carbonFootprint.trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="emissions" stroke="#2e7d32" strokeWidth={2} name="Emissions (tonnes CO₂e)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Crops Analysis */}
      <div className="section-card">
        <h3>🌾 Crop-Level Carbon Footprint</h3>
        <div className="crops-grid">
          {crops.map((crop, index) => (
            <div key={index} className="crop-card">
              <h4>{crop.name}</h4>
              <div className="crop-stats">
                <div className="crop-stat">
                  <span className="label">Area:</span>
                  <span className="value">{crop.area} ha</span>
                </div>
                <div className="crop-stat">
                  <span className="label">Emissions:</span>
                  <span className="value">{crop.emissions} tonnes CO₂e</span>
                </div>
                <div className="crop-stat">
                  <span className="label">Yield:</span>
                  <span className="value">{crop.yield} tonnes/ha</span>
                </div>
                <div className="crop-stat">
                  <span className="label">Intensity:</span>
                  <span className="value">{(crop.emissions / crop.area).toFixed(2)} CO₂e/ha</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sustainability Premium */}
      <div className="section-card premium-section">
        <h3><span className="rupee-icon">₹</span> Sustainability Premium & Market Access</h3>
        <div className="premium-grid">
          <div className="premium-comparison">
            <div className="price-box conventional">
              <span className="price-label">Conventional Price</span>
              <span className="price-value">₹{sustainabilityPremium.conventionalPrice}</span>
              <span className="price-unit">per quintal</span>
            </div>
            <div className="arrow">→</div>
            <div className="price-box premium-price">
              <span className="price-label">Your Premium Price</span>
              <span className="price-value">₹{sustainabilityPremium.currentPrice}</span>
              <span className="price-unit">per quintal</span>
            </div>
          </div>
          
          <div className="premium-details">
            <div className="premium-stat">
              <span className="label">Premium Amount:</span>
              <span className="value success-text">+₹{sustainabilityPremium.premiumAmount} ({sustainabilityPremium.premiumPercentage}%)</span>
            </div>
            <div className="premium-stat">
              <span className="label">Annual Potential:</span>
              <span className="value">₹{sustainabilityPremium.potentialAnnualIncome.toLocaleString()}</span>
            </div>
            <div className="premium-stat">
              <span className="label">Certifications:</span>
              <span className="value">
                {sustainabilityPremium.certifications.map((cert, i) => (
                  <span key={i} className="cert-badge">{cert}</span>
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Carbon Credits */}
      <div className="section-card credits-section">
        <h3>🌍 Carbon Credit Potential</h3>
        <div className="credits-grid">
          <div className="credit-stat-box">
            <div className="credit-icon">✓</div>
            <div className="credit-content">
              <span className="credit-label">Eligible Credits</span>
              <span className="credit-value">{carbonCredits.potentialCredits} tonnes CO₂e</span>
            </div>
          </div>
          <div className="credit-stat-box">
            <div className="credit-icon">₹</div>
            <div className="credit-content">
              <span className="credit-label">Estimated Value</span>
              <span className="credit-value">₹{carbonCredits.estimatedValue.toLocaleString()}</span>
            </div>
          </div>
          <div className="credit-stat-box">
            <div className="credit-icon">📋</div>
            <div className="credit-content">
              <span className="credit-label">Status</span>
              <span className="credit-value status-pending">{carbonCredits.status}</span>
            </div>
          </div>
          <div className="credit-stat-box">
            <div className="credit-icon">📅</div>
            <div className="credit-content">
              <span className="credit-label">Verification Date</span>
              <span className="credit-value">{carbonCredits.verificationDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="section-card">
        <h3>💡 AI-Powered Recommendations</h3>
        
        {/* AI Recommendation Form */}
        <div className="ai-form-container">
          <h4>Get Personalized AI Recommendations</h4>
          <form className="ai-form" onSubmit={(e) => { e.preventDefault(); getAIRecommendations(); }}>
            <div className="form-row">
              <div className="form-group">
                <label>Farm Size (hectares)</label>
                <input
                  type="number"
                  name="farmSize"
                  value={formData.farmSize}
                  onChange={handleInputChange}
                  step="0.1"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Primary Crop</label>
                <select name="primaryCrop" value={formData.primaryCrop} onChange={handleInputChange}>
                  <option value="Rice">Rice</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Sugarcane">Sugarcane</option>
                  <option value="Pulses">Pulses</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Fertilizer Type</label>
                <select name="fertilizerType" value={formData.fertilizerType} onChange={handleInputChange}>
                  <option value="Chemical">Chemical</option>
                  <option value="Organic">Organic</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Irrigation Method</label>
                <select name="irrigationMethod" value={formData.irrigationMethod} onChange={handleInputChange}>
                  <option value="Flood">Flood</option>
                  <option value="Drip">Drip</option>
                  <option value="Sprinkler">Sprinkler</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Pesticide Usage</label>
                <select name="pesticideUsage" value={formData.pesticideUsage} onChange={handleInputChange}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              
              <div className="form-group">
                <button type="submit" className="ai-submit-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Getting Recommendations...
                    </>
                  ) : (
                    'Get AI Recommendations'
                  )}
                </button>
              </div>
            </div>
          </form>
          
          {error && <div className="error-message">{error}</div>}
        </div>
        
        {/* Recommendations List */}
        <div className="recommendations-list">
          {displayRecommendations.map((rec, index) => (
            <div key={rec.id} className={`recommendation-card priority-${rec.priority}`}>
              <div className="priority-number">{String(index + 1).padStart(2, '0')}</div>
              <div className="rec-header">
                <h4>{rec.title}</h4>
                <span className={`priority-badge ${rec.priority}`}>{rec.priority.toUpperCase()}</span>
              </div>
              <div className="rec-content">
                <div className="rec-stat">
                  <span className="rec-icon">🌱</span>
                  <span className="rec-text">{rec.impact}</span>
                </div>
                <div className="rec-stat">
                  <span className="rec-icon">💵</span>
                  <span className="rec-text">Investment: {rec.cost}</span>
                </div>
                <div className="rec-stat savings-highlight">
                  <span className="rec-icon rupee-icon">₹</span>
                  <span className="rec-text success-text">Savings: {rec.savings}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RuralFarmerDashboard
