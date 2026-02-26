import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import RuralFarmerDashboard from './components/RuralFarmerDashboard'
import EmissionHotspotView from './components/EmissionHotspotView'
import CooperativeAggregationView from './components/CooperativeAggregationView'
import './App.css'

function App() {
  const [activeView, setActiveView] = useState('farmer')

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1 className="app-title">🌱 Supply Chain Decarbonization Platform</h1>
            <p className="app-subtitle">AI-Powered Carbon Tracking for Rural Ecosystems</p>
          </div>
        </header>

        <nav className="app-nav">
          <Link 
            to="/" 
            className={`nav-link ${activeView === 'farmer' ? 'active' : ''}`}
            onClick={() => setActiveView('farmer')}
          >
            👨‍🌾 Farmer Dashboard
          </Link>
          <Link 
            to="/hotspots" 
            className={`nav-link ${activeView === 'hotspots' ? 'active' : ''}`}
            onClick={() => setActiveView('hotspots')}
          >
            🔥 Emission Hotspots
          </Link>
          <Link 
            to="/cooperative" 
            className={`nav-link ${activeView === 'cooperative' ? 'active' : ''}`}
            onClick={() => setActiveView('cooperative')}
          >
            🤝 Cooperative View
          </Link>
        </nav>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<RuralFarmerDashboard />} />
            <Route path="/hotspots" element={<EmissionHotspotView />} />
            <Route path="/cooperative" element={<CooperativeAggregationView />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>AI4Bharat Hackathon 2026 | Rural Ecosystems & Sustainability Track</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
