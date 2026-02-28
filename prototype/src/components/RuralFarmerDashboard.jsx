import React from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { farmerData } from '../data/mockData'
import farmerAvatar from '../assets/farmer-avatar.jpeg'
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
        <div className="recommendations-list">
          {recommendations.map((rec, index) => (
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
