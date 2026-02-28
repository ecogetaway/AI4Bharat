import React from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { cooperativeData } from '../data/mockData'
import './CooperativeAggregationView.css'

const COLORS = ['#ef5350', '#ff7043', '#ffa726', '#66bb6a', '#42a5f5']

function CooperativeAggregationView() {
  const {
    cooperativeName,
    location,
    memberCount,
    totalFarmArea,
    aggregatedEmissions,
    topPerformers,
    improvementOpportunities,
    carbonCredits,
    sustainabilityPremium,
    collectiveImpact,
    memberDistribution,
    cropDistribution,
    recommendations
  } = cooperativeData;

  return (
    <div className="cooperative-view">
      <div className="view-header">
        <div className="header-content">
          <h2>🤝 {cooperativeName}</h2>
          <p className="coop-info">📍 {location}</p>
        </div>
        <div className="header-stats-cards">
          <div className="stat-card-large">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <span className="stat-label">Members</span>
              <span className="stat-value">{memberCount}</span>
            </div>
          </div>
          <div className="stat-card-large">
            <div className="stat-icon">🌾</div>
            <div className="stat-content">
              <span className="stat-label">Total Area</span>
              <span className="stat-value">{totalFarmArea.toLocaleString()}</span>
              <span className="stat-unit">hectares</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-header">
          <h3>Emission Reduction Progress</h3>
          <span className="progress-stats">{collectiveImpact.reductionPercentage}% of 20% target</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{width: `${(collectiveImpact.reductionPercentage / 20) * 100}%`}}></div>
          <div className="progress-target" style={{left: '100%'}}>
            <span className="target-marker">🎯</span>
            <span className="target-label">20% Target</span>
          </div>
        </div>
        <div className="progress-details">
          <span>Current: {collectiveImpact.reductionPercentage}%</span>
          <span>Remaining: {(20 - collectiveImpact.reductionPercentage).toFixed(1)}%</span>
        </div>
      </div>

      {/* Aggregate Metrics */}
      <div className="metrics-grid">
        <div className="metric-card emissions">
          <div className="metric-icon">🏭</div>
          <div className="metric-content">
            <h3>Total Emissions</h3>
            <p className="metric-value">{aggregatedEmissions.totalEmissions.toLocaleString()} <span className="trend-indicator">↓</span></p>
            <p className="metric-unit">tonnes CO₂e/year</p>
            <p className="metric-sub">{aggregatedEmissions.emissionsPerHectare} tonnes/hectare avg</p>
          </div>
        </div>

        <div className="metric-card sequestration">
          <div className="metric-icon">🌳</div>
          <div className="metric-content">
            <h3>Total Sequestration</h3>
            <p className="metric-value">{aggregatedEmissions.totalSequestration.toLocaleString()} <span className="trend-indicator up">↑</span></p>
            <p className="metric-unit">tonnes CO₂e/year</p>
            <p className="metric-sub success-text">Collective carbon capture</p>
          </div>
        </div>

        <div className="metric-card net">
          <div className="metric-icon">⚖️</div>
          <div className="metric-content">
            <h3>Net Emissions</h3>
            <p className="metric-value">{aggregatedEmissions.netEmissions.toLocaleString()} <span className="trend-indicator">↓</span></p>
            <p className="metric-unit">tonnes CO₂e/year</p>
            <p className="metric-sub">{((aggregatedEmissions.totalSequestration / aggregatedEmissions.totalEmissions) * 100).toFixed(1)}% offset</p>
          </div>
        </div>

        <div className="metric-card reduction">
          <div className="metric-icon">📉</div>
          <div className="metric-content">
            <h3>Emission Reduction</h3>
            <p className="metric-value">{collectiveImpact.emissionReduction} <span className="trend-indicator up">↑</span></p>
            <p className="metric-unit">tonnes CO₂e</p>
            <p className="metric-sub success-text">{collectiveImpact.reductionPercentage}% vs 2022 baseline</p>
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
                data={aggregatedEmissions.breakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percentage }) => `${category}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="emissions"
              >
                {aggregatedEmissions.breakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Emission Trend (2022-2025)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={aggregatedEmissions.trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="emissions" stroke="#ef5350" strokeWidth={2} name="Emissions" />
              <Line type="monotone" dataKey="sequestration" stroke="#66bb6a" strokeWidth={2} name="Sequestration" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers */}
      <div className="section-card">
        <h3>🏆 Top Performing Farmers</h3>
        <div className="performers-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Farmer Name</th>
                <th>Farmer ID</th>
                <th>Emissions (tonnes/ha)</th>
                <th>Reduction vs Baseline</th>
              </tr>
            </thead>
            <tbody>
              {topPerformers.map((farmer, index) => (
                <tr key={farmer.farmerId}>
                  <td className="rank-cell">
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && `#${index + 1}`}
                  </td>
                  <td className="farmer-name">{farmer.name}</td>
                  <td>{farmer.farmerId}</td>
                  <td className="emissions-cell">{farmer.emissions}</td>
                  <td className="reduction-cell success-text">-{farmer.reduction}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Improvement Opportunities */}
      <div className="section-card">
        <h3>📊 Member Improvement Opportunities</h3>
        <div className="improvement-grid">
          {improvementOpportunities.map((opp, index) => (
            <div key={index} className="improvement-card">
              <h4>{opp.category}</h4>
              <div className="improvement-stats">
                <div className="improvement-stat">
                  <span className="label">Members:</span>
                  <span className="value">{opp.count} farmers</span>
                </div>
                <div className="improvement-stat">
                  <span className="label">Avg Emissions:</span>
                  <span className="value">{opp.avgEmissions} tonnes/ha</span>
                </div>
                <div className="improvement-stat">
                  <span className="label">Target:</span>
                  <span className="value success-text">{opp.targetEmissions} tonnes/ha</span>
                </div>
                <div className="improvement-stat">
                  <span className="label">Potential Reduction:</span>
                  <span className="value highlight">{opp.potentialReduction}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carbon Credits */}
      <div className="section-card credits-section">
        <h3>🌍 Collective Carbon Credits</h3>
        <div className="credits-overview">
          <div className="credits-summary">
            <div className="credit-box verified">
              <div className="credit-icon">✓</div>
              <div className="credit-content">
                <span className="credit-label">Verified Credits</span>
                <span className="credit-value">{carbonCredits.verifiedCredits} tonnes CO₂e</span>
                <span className="credit-sub">₹{(carbonCredits.verifiedCredits * 3000).toLocaleString()}</span>
              </div>
            </div>
            
            <div className="credit-box pending">
              <div className="credit-icon">⏳</div>
              <div className="credit-content">
                <span className="credit-label">Pending Verification</span>
                <span className="credit-value">{carbonCredits.pendingVerification} tonnes CO₂e</span>
                <span className="credit-sub">₹{(carbonCredits.pendingVerification * 3000).toLocaleString()}</span>
              </div>
            </div>
            
            <div className="credit-box total">
              <div className="credit-icon rupee-icon">₹</div>
              <div className="credit-content">
                <span className="credit-label">Total Value</span>
                <span className="credit-value">₹{(carbonCredits.totalValue / 100000).toFixed(2)} Lakhs</span>
                <span className="credit-sub">₹{carbonCredits.distributionPerFarmer.toLocaleString()} per farmer avg</span>
              </div>
            </div>
          </div>

          <div className="buyers-section">
            <h4>Carbon Credit Buyers</h4>
            <div className="buyers-list">
              {carbonCredits.buyers.map((buyer, index) => (
                <div key={index} className="buyer-card">
                  <div className="buyer-info">
                    <span className="buyer-name">{buyer.name}</span>
                    <span className="buyer-credits">{buyer.credits} tonnes CO₂e</span>
                  </div>
                  <div className="buyer-value">₹{(buyer.value / 100000).toFixed(2)} Lakhs</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sustainability Premium */}
      <div className="section-card premium-section">
        <h3><span className="rupee-icon">₹</span> Collective Sustainability Premium</h3>
        <div className="premium-overview">
          <div className="premium-stats-grid">
            <div className="premium-stat-card">
              <span className="premium-icon">💵</span>
              <div>
                <span className="premium-label">Total Premium Earned</span>
                <span className="premium-value">₹{(sustainabilityPremium.totalPremiumEarned / 100000).toFixed(2)} Lakhs/year</span>
              </div>
            </div>
            
            <div className="premium-stat-card">
              <span className="premium-icon">👨‍🌾</span>
              <div>
                <span className="premium-label">Average per Farmer</span>
                <span className="premium-value">₹{sustainabilityPremium.averagePerFarmer.toLocaleString()}/year</span>
              </div>
            </div>
            
            <div className="premium-stat-card">
              <span className="premium-icon">📈</span>
              <div>
                <span className="premium-label">Premium Percentage</span>
                <span className="premium-value">{sustainabilityPremium.premiumPercentage}%</span>
              </div>
            </div>
          </div>

          <div className="certifications-box">
            <h4>Collective Certifications</h4>
            <div className="cert-badges">
              {sustainabilityPremium.certifications.map((cert, index) => (
                <span key={index} className="cert-badge">{cert}</span>
              ))}
            </div>
          </div>

          <div className="market-access-box">
            <h4>Market Access</h4>
            <div className="market-badges">
              {sustainabilityPremium.marketAccess.map((market, index) => (
                <span key={index} className="market-badge">{market}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Collective Impact */}
      <div className="section-card impact-section">
        <h3>🌟 Collective Impact Achievements</h3>
        <div className="impact-highlights">
          <div className="impact-metric-box">
            <span className="impact-icon">🌳</span>
            <div>
              <span className="impact-value">{collectiveImpact.treesEquivalent.toLocaleString()}</span>
              <span className="impact-label">Trees Planted Equivalent</span>
            </div>
          </div>
          
          <div className="impact-metric-box">
            <span className="impact-icon">🚗</span>
            <div>
              <span className="impact-value">{collectiveImpact.carsOffRoad}</span>
              <span className="impact-label">Cars Off Road (1 year)</span>
            </div>
          </div>
        </div>

        <div className="achievements-list">
          {collectiveImpact.achievements.map((achievement, index) => (
            <div key={index} className="achievement-item">
              <span className="achievement-icon">✓</span>
              <span className="achievement-text">{achievement}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Member & Crop Distribution */}
      <div className="charts-row">
        <div className="chart-card">
          <h3>Member Distribution by Farm Size</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={memberDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#42a5f5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Crop Distribution by Area</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={cropDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ crop, percentage }) => `${crop}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="area"
              >
                {cropDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cooperative Recommendations */}
      <div className="section-card">
        <h3>💡 Cooperative-Level Recommendations</h3>
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
                <div className="rec-stat">
                  <span className="rec-icon">👥</span>
                  <span className="rec-text">Beneficiaries: {rec.beneficiaries} farmers</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CooperativeAggregationView
