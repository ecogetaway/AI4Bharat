import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { supplyChainData } from '../data/mockData'
import './EmissionHotspotView.css'

const SEVERITY_COLORS = {
  critical: '#d32f2f',
  high: '#f57c00',
  medium: '#fbc02d',
  low: '#388e3c'
}

function EmissionHotspotView() {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const { productName, productId, totalEmissions, bomAnalysis, hotspots, scope3Breakdown, transportationAnalysis, optimizationOpportunities } = supplyChainData;

  const getSeverityColor = (severity) => SEVERITY_COLORS[severity] || '#757575'

  return (
    <div className="hotspot-view">
      <div className="view-header">
        <div className="header-content">
          <h2>🔥 Supply Chain Emission Hotspots</h2>
          <p className="product-info">{productName} (SKU: {productId})</p>
        </div>
        <div className="total-emissions-hero">
          <span className="hero-label">Total Product Emissions</span>
          <span className="hero-value">{totalEmissions}</span>
          <span className="hero-unit">kg CO₂e</span>
        </div>
      </div>

      {/* Scope 3 Breakdown */}
      <div className="scope-breakdown">
        <div className="scope-card">
          <h4>Scope 3.1</h4>
          <p className="scope-label">Purchased Goods & Services</p>
          <p className="scope-value">{scope3Breakdown.scope31} kg CO₂e</p>
          <p className="scope-percentage">{((scope3Breakdown.scope31 / totalEmissions) * 100).toFixed(1)}%</p>
        </div>
        <div className="scope-card">
          <h4>Scope 3.4</h4>
          <p className="scope-label">Upstream Transportation</p>
          <p className="scope-value">{scope3Breakdown.scope34} kg CO₂e</p>
          <p className="scope-percentage">{((scope3Breakdown.scope34 / totalEmissions) * 100).toFixed(1)}%</p>
        </div>
        <div className="scope-card total">
          <h4>Total Scope 3</h4>
          <p className="scope-label">Combined Emissions</p>
          <p className="scope-value">{scope3Breakdown.total} kg CO₂e</p>
          <p className="scope-percentage">100%</p>
        </div>
      </div>

      {/* BOM Analysis Chart */}
      <div className="section-card">
        <h3>📊 Bill of Materials (BOM) Carbon Analysis</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={bomAnalysis} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="componentName" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              interval={0}
            />
            <YAxis label={{ value: 'Emissions (kg CO₂e)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="custom-tooltip">
                      <p className="tooltip-title">{data.componentName}</p>
                      <p><strong>Supplier:</strong> {data.supplierName}</p>
                      <p><strong>Location:</strong> {data.location}</p>
                      <p><strong>Emissions:</strong> {data.emissions} kg CO₂e ({data.percentage}%)</p>
                      <p><strong>Carbon Intensity:</strong> {data.carbonIntensity} kg CO₂e/kg</p>
                      <p><strong>Severity:</strong> <span style={{color: getSeverityColor(data.severity), fontWeight: 'bold'}}>{data.severity.toUpperCase()}</span></p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="emissions" 
              fill="#8884d8"
              onClick={(data) => setSelectedComponent(data)}
            >
              {bomAnalysis.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getSeverityColor(entry.severity)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* BOM Components Table */}
      <div className="section-card">
        <h3>🔍 Detailed Component Analysis</h3>
        <div className="components-table">
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>Supplier</th>
                <th>Location</th>
                <th>Tier</th>
                <th>Emissions</th>
                <th>% of Total</th>
                <th>Intensity</th>
                <th>Severity</th>
                <th>Alternatives</th>
              </tr>
            </thead>
            <tbody>
              {bomAnalysis.map((component) => (
                <tr 
                  key={component.componentId}
                  className={selectedComponent?.componentId === component.componentId ? 'selected' : ''}
                  onClick={() => setSelectedComponent(component)}
                >
                  <td className="component-name">{component.componentName}</td>
                  <td>{component.supplierName}</td>
                  <td>{component.location}</td>
                  <td><span className="tier-badge">Tier {component.tier}</span></td>
                  <td className="emissions-cell">{component.emissions} kg</td>
                  <td>{component.percentage}%</td>
                  <td>{component.carbonIntensity} kg/kg</td>
                  <td>
                    <span className={`severity-badge ${component.severity}`}>
                      {component.severity === 'critical' && <span className="severity-pulse"></span>}
                      {component.severity}
                    </span>
                  </td>
                  <td className="alternatives-cell">{component.alternatives} available</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Critical Hotspots */}
      <div className="section-card hotspots-section">
        <h3>🚨 Critical Emission Hotspots</h3>
        <div className="hotspots-list">
          {hotspots.map((hotspot) => (
            <div key={hotspot.id} className={`hotspot-card severity-${hotspot.severity}`}>
              <div className="hotspot-header">
                <div>
                  <h4>{hotspot.component}</h4>
                  <p className="hotspot-supplier">{hotspot.supplier}</p>
                </div>
                <div className="hotspot-emissions">
                  <span className="emissions-value">{hotspot.emissions}</span>
                  <span className="emissions-unit">kg CO₂e</span>
                </div>
              </div>
              
              <div className="hotspot-content">
                <div className="hotspot-reason">
                  <strong>⚠️ Issue:</strong>
                  <p>{hotspot.reason}</p>
                </div>
                
                <div className="hotspot-recommendation">
                  <strong>💡 Recommendation:</strong>
                  <p>{hotspot.recommendation}</p>
                </div>
                
                <div className="hotspot-impact">
                  <div className="impact-stat">
                    <span className="impact-label">Potential Reduction:</span>
                    <span className="impact-value success">{hotspot.potentialReduction} kg CO₂e ({((hotspot.potentialReduction / hotspot.emissions) * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="impact-stat">
                    <span className="impact-label">Cost Impact:</span>
                    <span className="impact-value">{hotspot.costImpact}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transportation Analysis */}
      <div className="section-card">
        <h3>🚚 Transportation & Logistics Analysis</h3>
        <div className="transport-grid">
          {transportationAnalysis.map((route, index) => (
            <div key={index} className="transport-card">
              <h4>{route.route}</h4>
              <div className="transport-stats">
                <div className="transport-stat">
                  <span className="label">Distance:</span>
                  <span className="value">{route.distance} km</span>
                </div>
                <div className="transport-stat">
                  <span className="label">Current Mode:</span>
                  <span className="value">{route.mode}</span>
                </div>
                <div className="transport-stat">
                  <span className="label">Emissions:</span>
                  <span className="value">{route.emissions} kg CO₂e</span>
                </div>
              </div>
              
              {route.alternatives.length > 0 && (
                <div className="transport-alternatives">
                  <strong>Alternative Options:</strong>
                  {route.alternatives.map((alt, altIndex) => (
                    <div key={altIndex} className="alternative-option">
                      <span className="alt-mode">{alt.mode}</span>
                      <span className="alt-emissions">{alt.emissions} kg CO₂e</span>
                      <span className="alt-time">{alt.time}</span>
                      <span className={`alt-cost ${alt.cost.includes('-') ? 'savings' : 'increase'}`}>{alt.cost}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Optimization Opportunities */}
      <div className="section-card optimization-section">
        <h3>✨ Optimization Opportunities</h3>
        <div className="opportunities-list">
          {optimizationOpportunities.map((opp, index) => (
            <div key={opp.id} className={`opportunity-card ${opp.noRegret ? 'no-regret' : ''}`}>
              <div className="priority-number">{String(index + 1).padStart(2, '0')}</div>
              {opp.noRegret && <div className="no-regret-badge">🎯 No-Regret Opportunity</div>}
              
              <div className="opp-header">
                <h4>{opp.title}</h4>
                <span className="opp-type">{opp.type}</span>
              </div>
              
              <div className="opp-metrics">
                <div className="opp-metric highlight">
                  <span className="metric-icon">📉</span>
                  <div>
                    <span className="metric-label">Emission Reduction</span>
                    <span className="metric-value">{opp.emissionReduction} kg CO₂e ({opp.reductionPercentage}%)</span>
                  </div>
                </div>
                
                <div className="opp-metric savings-highlight">
                  <span className="metric-icon">💰</span>
                  <div>
                    <span className="metric-label">Cost Impact</span>
                    <span className={`metric-value ${opp.costImpact < 0 ? 'savings' : 'cost'}`}>
                      {opp.costImpact > 0 ? '+' : ''}{opp.costImpact}%
                    </span>
                  </div>
                </div>
                
                <div className="opp-metric">
                  <span className="metric-icon">⚙️</span>
                  <div>
                    <span className="metric-label">Implementation</span>
                    <span className="metric-value">{opp.implementation}</span>
                  </div>
                </div>
                
                <div className="opp-metric">
                  <span className="metric-icon">📅</span>
                  <div>
                    <span className="metric-label">Timeline</span>
                    <span className="metric-value">{opp.timeline}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmissionHotspotView
