import { useState } from 'react'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { farmerData } from '../data/mockData'
import farmerAvatar from '../assets/farmer-avatar.jpeg'
import './RuralFarmerDashboard.css'

const COLORS = ['#ef5350', '#ff7043', '#ffa726', '#66bb6a', '#42a5f5']

const RECOMMENDATIONS_API_URL = 'https://6qg6qznso7.execute-api.ap-south-1.amazonaws.com/recommendations'
const ORCHESTRATOR_URL = 'https://gylv2iabjpsbte727qkawailjm0xnctf.lambda-url.us-east-1.on.aws/'

// Dynamic mock data generator based on form inputs
const generateMockResponse = (formData) => {
  // Crop-specific MSP and market prices (realistic Indian agriculture data)
  const cropData = {
    'Rice': { msp: 2183, currentPrice: 2850, trend: 'RISING', carbonPerHa: 2.4 },
    'Wheat': { msp: 2275, currentPrice: 2520, trend: 'STABLE', carbonPerHa: 2.1 },
    'Cotton': { msp: 6620, currentPrice: 7100, trend: 'RISING', carbonPerHa: 3.2 },
    'Sugarcane': { msp: 315, currentPrice: 340, trend: 'STABLE', carbonPerHa: 4.5 },
    'Pulses': { msp: 7000, currentPrice: 7850, trend: 'RISING', carbonPerHa: 1.8 },
    'Vegetables': { msp: 1500, currentPrice: 1820, trend: 'RISING', carbonPerHa: 2.0 },
    'Fruits': { msp: 2300, currentPrice: 3200, trend: 'RISING', carbonPerHa: 2.2 }
  }

  const crop = cropData[formData.primaryCrop] || cropData['Rice']
  const farmSize = parseFloat(formData.farmSize) || 5
  
  // Calculate carbon reduction based on practices
  let carbonReduction = 0
  let recommendations = []
  
  // Fertilizer recommendations
  if (formData.fertilizerType === 'Chemical') {
    carbonReduction += 2.1
    recommendations.push({
      title: 'Switch to Bio-Fertilizers',
      carbonReduction: 2.1,
      investment: 8500,
      annualSavings: 12000,
      priority: 'high',
      description: 'Reduce chemical fertilizer emissions',
      govtScheme: 'PM-KUSUM'
    })
  } else if (formData.fertilizerType === 'Mixed') {
    carbonReduction += 1.2
    recommendations.push({
      title: 'Transition to Organic Fertilizers',
      carbonReduction: 1.2,
      investment: 5000,
      annualSavings: 8000,
      priority: 'medium',
      description: 'Complete transition to organic',
      govtScheme: 'Paramparagat Krishi Vikas Yojana'
    })
  }
  
  // Irrigation recommendations
  if (formData.irrigationMethod === 'Flood') {
    carbonReduction += 1.5
    recommendations.push({
      title: 'Install Drip Irrigation',
      carbonReduction: 1.5,
      investment: 45000,
      annualSavings: 18000,
      priority: 'high',
      description: 'Save water and reduce emissions',
      govtScheme: 'Per Drop More Crop'
    })
  } else if (formData.irrigationMethod === 'Sprinkler') {
    carbonReduction += 0.8
    recommendations.push({
      title: 'Upgrade to Drip Irrigation',
      carbonReduction: 0.8,
      investment: 25000,
      annualSavings: 12000,
      priority: 'medium',
      description: 'Further optimize water use',
      govtScheme: 'Per Drop More Crop'
    })
  }
  
  // Pesticide recommendations
  if (formData.pesticideUsage === 'High') {
    carbonReduction += 1.2
    recommendations.push({
      title: 'Adopt Integrated Pest Management',
      carbonReduction: 1.2,
      investment: 3000,
      annualSavings: 7000,
      priority: 'high',
      description: 'Reduce pesticide use by 60%',
      govtScheme: 'National Mission on Sustainable Agriculture'
    })
  } else if (formData.pesticideUsage === 'Medium') {
    carbonReduction += 0.6
    recommendations.push({
      title: 'Implement Bio-Pesticides',
      carbonReduction: 0.6,
      investment: 2000,
      annualSavings: 4000,
      priority: 'medium',
      description: 'Switch to organic pest control',
      govtScheme: 'National Mission on Sustainable Agriculture'
    })
  }
  
  // Always add cover cropping if not already optimal
  if (recommendations.length < 3) {
    recommendations.push({
      title: 'Adopt Cover Cropping',
      carbonReduction: 0.8,
      investment: 3000,
      annualSavings: 5400,
      priority: 'medium',
      description: 'Increase soil carbon sequestration',
      govtScheme: 'Soil Health Card Scheme'
    })
  }
  
  // Calculate carbon credits
  const totalCarbonReduction = carbonReduction * farmSize
  const carbonCreditValue = Math.round(totalCarbonReduction * 3000)
  
  // Determine sell decision
  const priceAboveMSP = crop.currentPrice > crop.msp
  const sellDecision = priceAboveMSP && crop.trend === 'RISING' ? 'SELL_NOW' : 
                       priceAboveMSP ? 'SELL_NOW' : 'WAIT'
  
  const reasoning = `The current Mandi price of Rs ${crop.currentPrice} per quintal is ${priceAboveMSP ? 'higher' : 'lower'} than the Minimum Support Price (MSP) of Rs ${crop.msp} per quintal. Given the ${crop.trend.toLowerCase()} price trend, ${sellDecision === 'SELL_NOW' ? 'selling now will maximize the revenue' : 'it is advisable to wait for better prices'}. Additionally, considering the potential earnings from carbon credits (Rs ${carbonCreditValue}), it is financially prudent to ${sellDecision === 'SELL_NOW' ? 'sell the produce immediately' : 'monitor market conditions closely'}.`
  
  return {
    sustainabilityRecommendations: recommendations.slice(0, 3),
    weatherInsights: {
      currentWeather: { 
        temperature: 28 + Math.floor(Math.random() * 8), 
        humidity: 55 + Math.floor(Math.random() * 20), 
        rainfall: 0, 
        condition: 'Partly Cloudy' 
      },
      forecast: Array.from({ length: 7 }, (_, i) => ({
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][(new Date().getDay() + i) % 7],
        temp: 28 + Math.floor(Math.random() * 8),
        humidity: 55 + Math.floor(Math.random() * 20),
        rainfall: i === 3 || i === 4 ? Math.floor(Math.random() * 5) : 0,
        condition: i === 3 || i === 4 ? 'Rain' : 'Partly Cloudy'
      })),
      alerts: [
        { type: 'Temperature', severity: 'MEDIUM', message: 'Moderate temperature expected', action: 'Monitor crop health' },
        ...(Math.random() > 0.5 ? [{ type: 'Rain', severity: 'MEDIUM', message: 'Rain forecast mid-week', action: 'Delay irrigation' }] : [])
      ],
      farmingAdvice: {
        irrigationRecommendation: formData.irrigationMethod === 'Flood' 
          ? 'Consider switching to drip irrigation for water efficiency and emission reduction.'
          : 'Current irrigation method is efficient. Monitor soil moisture levels.',
        pestRisk: formData.pesticideUsage === 'High' 
          ? 'High pesticide use detected. Consider integrated pest management to reduce costs and emissions.'
          : 'Moderate pest risk. Continue current practices with regular monitoring.',
        harvestWindow: `Optimal harvest window: 2-3 weeks from now based on ${formData.primaryCrop} maturity cycle.`,
        carbonImpact: `Current practices generate approximately ${(crop.carbonPerHa * farmSize).toFixed(1)} tonnes CO₂e/year. Implementing recommendations can reduce this by ${carbonReduction.toFixed(1)} tonnes/hectare.`
      }
    },
    marketInsights: {
      mandiPrices: {
        currentPrice: crop.currentPrice,
        mspPrice: crop.msp,
        nearestMandi: 'Nashik APMC',
        priceTrend: crop.trend,
        bestSellingWindow: sellDecision === 'SELL_NOW' ? 'Next 2 weeks' : 'Wait 3-4 weeks'
      },
      carbonCredits: {
        currentPricePerTonne: 3000,
        estimatedEarnings: carbonCreditValue,
        registrationScheme: 'India Carbon Market (proposed)',
        verificationRequired: 'Third-party verification needed'
      },
      marketAdvice: {
        sellNowOrWait: sellDecision,
        reasoning: reasoning,
        alternativeMarkets: ['Pune APMC', 'Mumbai Agri-Produce Market Committee (APMC)', 'Surat APMC'],
        govtSchemes: ['Pradhan Mantri Fasal Bima Yojana (PMFBY)', 'PM-AASHA', 'e-NAM']
      },
      totalPotentialIncome: Math.round(crop.currentPrice * farmSize * 25 + carbonCreditValue)
    }
  }
}

// Static fallback for initial load (kept for backward compatibility)
const MOCK_ORCHESTRATOR_RESPONSE = {
  sustainabilityRecommendations: [
    { title: 'Switch to Bio-Fertilizers', carbonReduction: 2.1, investment: 8500, annualSavings: 12000, priority: 'high', description: 'Reduce emissions', govtScheme: 'PM-KUSUM' },
    { title: 'Install Drip Irrigation', carbonReduction: 1.5, investment: 45000, annualSavings: 18000, priority: 'high', description: 'Save water', govtScheme: 'Per Drop More Crop' }
  ],
  weatherInsights: {
    currentWeather: { temperature: 34, humidity: 62, rainfall: 0, condition: 'Partly Cloudy' },
    forecast: [
      { day: 'Wed', temp: 34, humidity: 62, rainfall: 0, condition: 'Partly Cloudy' },
      { day: 'Thu', temp: 35, humidity: 58, rainfall: 0, condition: 'Sunny' },
      { day: 'Fri', temp: 33, humidity: 68, rainfall: 2.5, condition: 'Cloudy' },
      { day: 'Sat', temp: 32, humidity: 72, rainfall: 5, condition: 'Rain' },
      { day: 'Sun', temp: 31, humidity: 75, rainfall: 3, condition: 'Cloudy' },
      { day: 'Mon', temp: 33, humidity: 65, rainfall: 0, condition: 'Sunny' },
      { day: 'Tue', temp: 34, humidity: 60, rainfall: 0, condition: 'Partly Cloudy' }
    ],
    alerts: [
      { type: 'Heat', severity: 'HIGH', message: 'High temperature expected', action: 'Avoid midday fieldwork' },
      { type: 'Rain', severity: 'MEDIUM', message: 'Rain forecast Fri-Sat', action: 'Delay irrigation' }
    ],
    farmingAdvice: {
      irrigationRecommendation: 'Reduce flood irrigation; consider drip for next season. Current soil moisture adequate.',
      pestRisk: 'Moderate pest risk due to humidity. Monitor for stem borer in rice.',
      harvestWindow: 'Optimal harvest window: 2-3 weeks from now. Avoid harvesting during forecast rain.',
      carbonImpact: 'Drip irrigation can reduce emissions by ~1.5 tonnes CO₂e/year.'
    }
  },
  marketInsights: {
    mandiPrices: {
      currentPrice: 2850,
      mspPrice: 2183,
      nearestMandi: 'Nashik APMC',
      priceTrend: 'RISING',
      bestSellingWindow: 'Next 2 weeks'
    },
    carbonCredits: {
      currentPricePerTonne: 3000,
      estimatedEarnings: 9600,
      registrationScheme: 'India Carbon Market (proposed)',
      verificationRequired: 'Third-party verification needed'
    },
    marketAdvice: {
      sellNowOrWait: 'SELL_NOW',
      reasoning: 'The current Mandi price of Rs 2850 per quintal is significantly higher than the Minimum Support Price (MSP) of Rs 2183 per quintal. Given the rising price trend, selling now will maximize revenue before seasonal price pressure. Additionally, with potential carbon credit earnings of Rs 9,600, this is an excellent window to sell.',
      alternativeMarkets: ['Pune APMC', 'Mumbai Agri-Produce Market Committee (APMC)', 'Surat APMC'],
      govtSchemes: ['Pradhan Mantri Fasal Bima Yojana (PMFBY)', 'PM-AASHA', 'e-NAM']
    },
    totalPotentialIncome: 380100
  }
}

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

  // State for AI recommendations and orchestrator data
  const [aiRecommendations, setAiRecommendations] = useState(null)
  const [orchestratorData, setOrchestratorData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    farmSize: farmSize.toString(),
    primaryCrop: 'Rice',
    fertilizerType: 'Mixed',
    irrigationMethod: 'Flood',
    pesticideUsage: 'Medium'
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
      const payload = {
        farmerName: 'Rajesh Kumar',
        location: 'Nashik, Maharashtra India',
        farmSize: parseFloat(formData.farmSize),
        crop: formData.primaryCrop.toLowerCase(),
        fertilizerType: formData.fertilizerType,
        irrigationMethod: formData.irrigationMethod,
        pesticideUsage: formData.pesticideUsage,
        expectedYield: parseFloat(formData.farmSize) * 25
      }

      // In dev, use Vite proxy to avoid CORS; in prod, use Lambda URL directly
      const apiUrl = import.meta.env.DEV ? '/api/orchestrator' : ORCHESTRATOR_URL
      const orchestratorResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!orchestratorResponse.ok) {
        throw new Error(`Orchestrator API error: ${orchestratorResponse.status}`)
      }

      let data = await orchestratorResponse.json()
      console.log('Orchestrator response:', data)

      // Transform API response to match our expected format (API uses forecast7Days, nested farmingAdvice, etc.)
      if (data.weatherInsights) {
        const wi = data.weatherInsights
        data = {
          ...data,
          weatherInsights: {
            currentWeather: wi.currentWeather || {},
            forecast: wi.forecast || (wi.forecast7Days || []).map((d) => ({
              day: new Date(d.date).toLocaleDateString('en-IN', { weekday: 'short' }),
              temp: d.tempMax ?? d.temp,
              humidity: wi.currentWeather?.humidity ?? '--',
              rainfall: d.precipitation ?? d.rainfall ?? 0,
              condition: (d.precipitation > 0 ? 'Rain' : 'Clear')
            })),
            alerts: wi.alerts || [],
            farmingAdvice: wi.farmingAdvice ? {
              irrigationRecommendation: typeof wi.farmingAdvice.irrigationRecommendation === 'object'
                ? [wi.farmingAdvice.irrigationRecommendation.advice, wi.farmingAdvice.irrigationRecommendation.timing].filter(Boolean).join(' ')
                : wi.farmingAdvice.irrigationRecommendation,
              pestRisk: typeof wi.farmingAdvice.pestRisk === 'object'
                ? wi.farmingAdvice.pestRisk.assessment
                : wi.farmingAdvice.pestRisk,
              harvestWindow: typeof wi.farmingAdvice.harvestWindow === 'object'
                ? wi.farmingAdvice.harvestWindow.optimalTiming
                : wi.farmingAdvice.harvestWindow,
              carbonImpact: typeof wi.farmingAdvice.carbonImpact === 'object'
                ? wi.farmingAdvice.carbonImpact.considerations
                : wi.farmingAdvice.carbonImpact
            } : null
          }
        }
      }
      if (data.marketInsights?.mandiPrices && !data.marketInsights.mandiPrices.mspPrice) {
        data.marketInsights.mandiPrices.mspPrice = data.marketInsights.mandiPrices.mspPrice ?? data.marketInsights.mandiPrices.msp
      }
      // Normalise field names from older deployed Lambda versions
      if (data.marketInsights) {
        const mi = data.marketInsights
        // If mandiPrices is missing but fields exist at top level of marketInsights
        if (!mi.mandiPrices && (mi.currentPrice || mi.price)) {
          mi.mandiPrices = {
            currentPrice: mi.currentPrice ?? mi.price,
            mspPrice: mi.mspPrice ?? mi.msp,
            priceTrend: mi.priceTrend ?? mi.trend ?? 'STABLE',
            nearestMandi: mi.nearestMandi ?? mi.mandi ?? 'Nashik APMC'
          }
        }
        if (mi.mandiPrices) {
          const mp = mi.mandiPrices
          mp.currentPrice = mp.currentPrice ?? mp.price ?? mp.marketPrice ?? mp.current_price
          mp.mspPrice     = mp.mspPrice ?? mp.msp ?? mp.minimum_support_price
          // If mspPrice still missing, look it up from our local crop data
          if (!mp.mspPrice) {
            const MSP_LOOKUP = { rice: 2183, wheat: 2275, cotton: 6620, sugarcane: 315, pulses: 7000, vegetables: 1500, fruits: 2300 }
            mp.mspPrice = MSP_LOOKUP[(mp.cropName || '').toLowerCase()] ?? MSP_LOOKUP[formData.primaryCrop.toLowerCase()] ?? 2183
          }
          mp.priceTrend   = mp.priceTrend ?? mp.trend ?? mp.price_trend ?? 'STABLE'
          mp.nearestMandi = mp.nearestMandi ?? mp.mandi ?? mp.nearest_mandi ?? 'Nashik APMC'
        }
        if (!mi.carbonCredits && (mi.estimatedEarnings || mi.carbonEarnings)) {
          mi.carbonCredits = {
            estimatedEarnings: mi.estimatedEarnings ?? mi.carbonEarnings ?? 0,
            currentPricePerTonne: mi.pricePerTonne ?? mi.carbonPrice ?? 3000,
            registrationScheme: mi.scheme ?? 'India Carbon Market (proposed)'
          }
        }
        if (mi.carbonCredits) {
          const cc = mi.carbonCredits
          cc.estimatedEarnings    = cc.estimatedEarnings ?? cc.earnings ?? cc.estimated_earnings ?? 0
          cc.currentPricePerTonne = cc.currentPricePerTonne ?? cc.pricePerTonne ?? cc.price_per_tonne ?? 0
          cc.registrationScheme   = cc.registrationScheme ?? cc.scheme ?? ''
        }
        if (!mi.marketAdvice && (mi.sellNowOrWait || mi.recommendation)) {
          mi.marketAdvice = {
            sellNowOrWait: mi.sellNowOrWait ?? mi.recommendation ?? 'SELL_NOW',
            reasoning: mi.reasoning ?? mi.advice ?? '',
            alternativeMarkets: mi.alternativeMarkets ?? [],
            govtSchemes: mi.govtSchemes ?? []
          }
        }
      }
      if (data.marketInsights?.marketAdvice?.govtSchemes && !Array.isArray(data.marketInsights.marketAdvice.govtSchemes)) {
        data.marketInsights.marketAdvice.govtSchemes = []
      }

      // Transform sustainability recommendations
      const formattedRecommendations = data.sustainabilityRecommendations?.map((rec, index) => ({
        id: `ai-${index + 1}`,
        title: rec.title,
        impact: `${rec.carbonReduction} tonnes CO₂e/year reduction`,
        cost: `₹${rec.investment?.toLocaleString('en-IN') ?? 0} initial investment`,
        savings: `₹${rec.annualSavings?.toLocaleString('en-IN') ?? 0}/year savings`,
        priority: (rec.priority || 'medium').toLowerCase(),
        description: rec.description,
        govtScheme: rec.govtScheme
      })) || []

      // Optionally fetch supplemental recommendations from recommendations API
      let mergedRecommendations = formattedRecommendations
      try {
        const recResponse = await fetch(RECOMMENDATIONS_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (recResponse.ok) {
          const recData = await recResponse.json()
          const supplemental = Array.isArray(recData.recommendations) ? recData.recommendations : (recData.data?.recommendations || [])
          if (supplemental.length > 0) {
            const formatted = supplemental.map((r, i) => ({
              id: `rec-${i + 1}`,
              title: r.title || r.name,
              impact: r.impact || r.description || '',
              cost: r.cost || '',
              savings: r.savings || '',
              priority: (r.priority || 'medium').toLowerCase(),
              description: r.description || '',
              govtScheme: r.govtScheme
            }))
            mergedRecommendations = [...formattedRecommendations, ...formatted]
          }
        }
      } catch (recErr) {
        console.warn('Recommendations API fallback skipped:', recErr)
      }

      setAiRecommendations(mergedRecommendations)
      setOrchestratorData(data)

    } catch (err) {
      console.error('Orchestrator API error:', err)
      setError('API temporarily unavailable. Demo data has been loaded automatically — you can explore all features below (Weather Insights, Market Intelligence, etc.). To reload demo data anytime, click "Load demo data".')
      // Use dynamic mock data generator based on form inputs
      const dynamicMockData = generateMockResponse(formData)
      const mockRecs = dynamicMockData.sustainabilityRecommendations?.map((rec, index) => ({
        id: `mock-${index + 1}`,
        title: rec.title,
        impact: `${rec.carbonReduction} tonnes CO₂e/year reduction`,
        cost: `₹${rec.investment?.toLocaleString('en-IN') ?? 0} initial investment`,
        savings: `₹${rec.annualSavings?.toLocaleString('en-IN') ?? 0}/year savings`,
        priority: (rec.priority || 'medium').toLowerCase(),
        description: rec.description,
        govtScheme: rec.govtScheme
      })) || []
      setAiRecommendations(mockRecs)
      setOrchestratorData(dynamicMockData)
    } finally {
      setLoading(false)
    }
  }

  const displayRecommendations = aiRecommendations || recommendations

  const getSeverityBadgeClass = (severity) => {
    const s = (severity || '').toUpperCase()
    if (s === 'HIGH') return 'severity-high'
    if (s === 'MEDIUM') return 'severity-medium'
    return 'severity-low'
  }

  const getForecastData = () => {
    const w = orchestratorData?.weatherInsights
    if (w?.forecast && Array.isArray(w.forecast) && w.forecast.length > 0) {
      return w.forecast
    }
    const cur = w?.currentWeather || {}
    return Array.from({ length: 7 }, (_, i) => ({
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][(new Date().getDay() + i) % 7],
      temp: (parseFloat(cur.temperature) || 32) + (i - 3) * 2,
      humidity: (parseInt(cur.humidity, 10) || 65) + (i % 3) * 5,
      rainfall: i === 2 || i === 5 ? (Math.random() * 5 + 1).toFixed(1) : 0,
      condition: i % 3 === 0 ? 'Sunny' : i % 3 === 1 ? 'Partly Cloudy' : 'Cloudy'
    }))
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="farmer-profile-card">
          <img src={farmerAvatar} alt="Farmer Avatar" className="farmer-avatar" />
          <div className="farmer-info">
            <h2 className="farmer-name">{farmerName}</h2>
            <p className="location">📍 {location} | {farmSize} hectares</p>
            <p className="vernacular-tagline">आमची माती आमची माणसं</p>
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
                {carbonFootprint.breakdown.map((_, index) => (
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

      {/* Seed Intelligence */}
      <div className="section-card seed-section">
        <h3>🌱 Seed Intelligence — Seed Sovereignty & Carbon Impact</h3>
        <p className="seed-intro">Seed choice directly affects your carbon footprint, input costs, and carbon credit eligibility. Indigenous seeds can reduce input costs by 20–50% and earn more carbon credits.</p>

        <div className="seed-comparison-grid">
          {/* Hybrid/Monsanto */}
          <div className="seed-card seed-card--hybrid">
            <div className="seed-card-header">
              <span className="seed-type-badge badge-hybrid">⚠️ Current: Hybrid / Commercial</span>
            </div>
            <div className="seed-stats">
              <div className="seed-stat">
                <span className="label">Example</span>
                <span className="value">BT Cotton (Monsanto), HYV Rice</span>
              </div>
              <div className="seed-stat">
                <span className="label">Carbon Intensity</span>
                <span className="value danger-text">2.8 kg CO₂e / kg seed</span>
              </div>
              <div className="seed-stat">
                <span className="label">Fertilizer Dependency</span>
                <span className="value danger-text">HIGH — requires chemical inputs</span>
              </div>
              <div className="seed-stat">
                <span className="label">Annual Seed Cost</span>
                <span className="value danger-text">₹8,000 – ₹18,000 / season</span>
              </div>
              <div className="seed-stat">
                <span className="label">Carbon Credits Eligible</span>
                <span className="value danger-text">LOW — high input dependency</span>
              </div>
              <div className="seed-stat">
                <span className="label">Farmer Control</span>
                <span className="value danger-text">❌ Cannot save / replant seeds</span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="seed-arrow">→</div>

          {/* Indigenous / Desi */}
          <div className="seed-card seed-card--indigenous">
            <div className="seed-card-header">
              <span className="seed-type-badge badge-indigenous">✅ Recommended: Indigenous / Desi</span>
            </div>
            <div className="seed-stats">
              <div className="seed-stat">
                <span className="label">Example</span>
                <span className="value">Desi Kapas, Sahbhagi Dhan, Joha Rice</span>
              </div>
              <div className="seed-stat">
                <span className="label">Carbon Intensity</span>
                <span className="value success-text">0.9 kg CO₂e / kg seed (-68%)</span>
              </div>
              <div className="seed-stat">
                <span className="label">Fertilizer Dependency</span>
                <span className="value success-text">LOW — thrives with organic inputs</span>
              </div>
              <div className="seed-stat">
                <span className="label">Annual Seed Cost</span>
                <span className="value success-text">₹500 – ₹2,000 or FREE (farm-saved)</span>
              </div>
              <div className="seed-stat">
                <span className="label">Carbon Credits Eligible</span>
                <span className="value success-text">HIGH — low-input farming qualifies</span>
              </div>
              <div className="seed-stat">
                <span className="label">Farmer Control</span>
                <span className="value success-text">✅ Save, replant & share seeds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seed Saving Potential */}
        <div className="seed-impact-row">
          <div className="seed-impact-card">
            <span className="impact-icon">💰</span>
            <div className="impact-content">
              <span className="impact-label">Input Cost Saving</span>
              <span className="impact-value success-text">₹12,000 – ₹20,000/year</span>
              <span className="impact-sub">Seed + reduced fertilizer costs</span>
            </div>
          </div>
          <div className="seed-impact-card">
            <span className="impact-icon">🌍</span>
            <div className="impact-content">
              <span className="impact-label">Carbon Reduction</span>
              <span className="impact-value success-text">1.2 tonnes CO₂e/year</span>
              <span className="impact-sub">From lower input dependency</span>
            </div>
          </div>
          <div className="seed-impact-card">
            <span className="impact-icon">₹</span>
            <div className="impact-content">
              <span className="impact-label">Extra Carbon Credits</span>
              <span className="impact-value success-text">₹3,600/year</span>
              <span className="impact-sub">Additional credits from transition</span>
            </div>
          </div>
          <div className="seed-impact-card">
            <span className="impact-icon">🏛️</span>
            <div className="impact-content">
              <span className="impact-label">Govt Scheme</span>
              <span className="impact-value">NMAE + PPV&FRA</span>
              <span className="impact-sub">Seed sovereignty protection</span>
            </div>
          </div>
        </div>

        {/* Seed Sources */}
        <div className="seed-sources">
          <h4>📍 Nearest Seed Sources — Nashik District</h4>
          <div className="seed-sources-grid">
            <div className="seed-source-card">
              <span className="source-icon">🏛️</span>
              <div className="source-content">
                <strong>NBPGR Regional Station</strong>
                <p>National Bureau of Plant Genetic Resources</p>
                <p className="source-detail">Indigenous variety catalog — 200+ drought-tolerant varieties for Maharashtra</p>
              </div>
            </div>
            <div className="seed-source-card">
              <span className="source-icon">🤝</span>
              <div className="source-content">
                <strong>Beej Swaraj Network</strong>
                <p>Community Seed Bank, Nashik</p>
                <p className="source-detail">Free indigenous seeds for registered cooperative members — 47 varieties available</p>
              </div>
            </div>
            <div className="seed-source-card">
              <span className="source-icon">🔬</span>
              <div className="source-content">
                <strong>ICAR — Agri Research Station</strong>
                <p>Igatpuri, Nashik District</p>
                <p className="source-detail">Low-carbon seed trials for grapes, rice & pulses — open to FPO members</p>
              </div>
            </div>
          </div>
        </div>

        <div className="seed-cta">
          <p className="seed-cta-text">
            🌾 <strong>Beej Swaraj</strong> (बीज स्वराज) — Seed Sovereignty. Your right to save, share and replant your own seeds. Less carbon. More independence. Better margins.
          </p>
        </div>
      </div>

      {/* AI-Powered Recommendations */}
      <div className="section-card">
        <h3>💡 AI-Powered Recommendations</h3>
        
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
                <button
                  type="button"
                  className="ai-demo-btn"
                  onClick={() => {
                    setError(null)
                    const mockRecs = MOCK_ORCHESTRATOR_RESPONSE.sustainabilityRecommendations?.map((rec, index) => ({
                      id: `demo-${index + 1}`,
                      title: rec.title,
                      impact: `${rec.carbonReduction} tonnes CO₂e/year reduction`,
                      cost: `₹${rec.investment?.toLocaleString('en-IN') ?? 0} initial investment`,
                      savings: `₹${rec.annualSavings?.toLocaleString('en-IN') ?? 0}/year savings`,
                      priority: (rec.priority || 'medium').toLowerCase(),
                      description: rec.description,
                      govtScheme: rec.govtScheme
                    })) || []
                    setAiRecommendations(mockRecs)
                    setOrchestratorData(MOCK_ORCHESTRATOR_RESPONSE)
                  }}
                  title="Use when API is unavailable — loads sample Weather, Market & Recommendation data"
                >
                  Load demo data
                </button>
                <span className="demo-btn-hint">(Use when API is unavailable)</span>
              </div>
            </div>
          </form>
          
          {error && <div className="error-message">{error}</div>}
        </div>
        
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

      {/* Weather Insights - shown when orchestrator returns data */}
      {orchestratorData?.weatherInsights && (
        <div className="section-card weather-section">
          <h3>🌦️ Weather Insights & Farming Advice</h3>
          
          <div className="weather-current">
            <h4>Current Conditions</h4>
            <div className="weather-grid">
              <div className="weather-stat">
                <span className="weather-icon">🌡️</span>
                <div className="weather-content">
                  <span className="label">Temperature</span>
                  <span className="value">{orchestratorData.weatherInsights.currentWeather?.temperature ?? '--'}°C</span>
                </div>
              </div>
              <div className="weather-stat">
                <span className="weather-icon">💧</span>
                <div className="weather-content">
                  <span className="label">Humidity</span>
                  <span className="value">{orchestratorData.weatherInsights.currentWeather?.humidity ?? '--'}%</span>
                </div>
              </div>
              <div className="weather-stat">
                <span className="weather-icon">🌧️</span>
                <div className="weather-content">
                  <span className="label">Rainfall</span>
                  <span className="value">{orchestratorData.weatherInsights.currentWeather?.rainfall ?? '--'} mm</span>
                </div>
              </div>
              <div className="weather-stat">
                <span className="weather-icon">☁️</span>
                <div className="weather-content">
                  <span className="label">Condition</span>
                  <span className="value">{orchestratorData.weatherInsights.currentWeather?.condition ?? '--'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast Table */}
          <div className="weather-forecast">
            <h4>📅 7-Day Forecast</h4>
            <table className="forecast-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Temp (°C)</th>
                  <th>Humidity</th>
                  <th>Rainfall (mm)</th>
                  <th>Condition</th>
                </tr>
              </thead>
              <tbody>
                {getForecastData().map((row, i) => (
                  <tr key={i}>
                    <td>{row.day}</td>
                    <td>{row.temp}</td>
                    <td>{typeof row.humidity === 'number' ? row.humidity : row.humidity}%</td>
                    <td>{row.rainfall ?? 0}</td>
                    <td>{row.condition ?? '--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Weather Alerts with severity badges */}
          {orchestratorData.weatherInsights.alerts && orchestratorData.weatherInsights.alerts.length > 0 && (
            <div className="weather-alerts">
              <h4>⚠️ Weather Alerts</h4>
              {orchestratorData.weatherInsights.alerts.map((alert, i) => (
                <div key={i} className={`alert-card ${getSeverityBadgeClass(alert.severity)}`}>
                  <div className="alert-header">
                    <span className="alert-type">{alert.type?.toUpperCase() ?? 'ALERT'}</span>
                    <span className={`alert-severity severity-badge ${getSeverityBadgeClass(alert.severity)}`}>
                      {alert.severity?.toUpperCase() ?? 'LOW'}
                    </span>
                  </div>
                  <p className="alert-message">{alert.message}</p>
                  <p className="alert-action"><strong>Action:</strong> {alert.action}</p>
                </div>
              ))}
            </div>
          )}

          {/* Farming Advice */}
          {orchestratorData.weatherInsights.farmingAdvice && (
            <div className="farming-advice">
              <h4>🌾 Farming Advice</h4>
              <div className="advice-grid">
                <div className="advice-card">
                  <span className="advice-icon">💧</span>
                  <div className="advice-content">
                    <h5>Irrigation</h5>
                    <p>{orchestratorData.weatherInsights.farmingAdvice.irrigationRecommendation}</p>
                  </div>
                </div>
                <div className="advice-card">
                  <span className="advice-icon">🐛</span>
                  <div className="advice-content">
                    <h5>Pest Risk</h5>
                    <p>{orchestratorData.weatherInsights.farmingAdvice.pestRisk}</p>
                  </div>
                </div>
                <div className="advice-card">
                  <span className="advice-icon">🌾</span>
                  <div className="advice-content">
                    <h5>Harvest Window</h5>
                    <p>{orchestratorData.weatherInsights.farmingAdvice.harvestWindow}</p>
                  </div>
                </div>
                <div className="advice-card">
                  <span className="advice-icon">🌱</span>
                  <div className="advice-content">
                    <h5>Carbon Impact</h5>
                    <p>{orchestratorData.weatherInsights.farmingAdvice.carbonImpact}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Market Intelligence - shown when orchestrator returns data */}
      {orchestratorData?.marketInsights && (
        <div className="section-card market-section">
          <h3>💰 Market Intelligence</h3>
          
          {/* Mandi Prices Table */}
          <div className="market-prices">
            <h4>📊 Mandi Prices</h4>
            <table className="mandi-table">
              <thead>
                <tr>
                  <th>Crop</th>
                  <th>Current Price (₹/q)</th>
                  <th>MSP (₹/q)</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{formData.primaryCrop}</td>
                  <td>₹{orchestratorData.marketInsights.mandiPrices?.currentPrice ?? '--'}</td>
                  <td>₹{orchestratorData.marketInsights.mandiPrices?.mspPrice ?? '--'}</td>
                  <td>
                    <span className={`trend-badge trend-${(orchestratorData.marketInsights.mandiPrices?.priceTrend ?? 'STABLE').toLowerCase()}`}>
                      {orchestratorData.marketInsights.mandiPrices?.priceTrend ?? 'STABLE'}
                      {(orchestratorData.marketInsights.mandiPrices?.priceTrend ?? '') === 'RISING' && ' ↑'}
                      {(orchestratorData.marketInsights.mandiPrices?.priceTrend ?? '') === 'FALLING' && ' ↓'}
                      {(orchestratorData.marketInsights.mandiPrices?.priceTrend ?? '') === 'STABLE' && ' →'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            {orchestratorData.marketInsights.mandiPrices?.nearestMandi && (
              <p className="mandi-note">Nearest Mandi: {orchestratorData.marketInsights.mandiPrices.nearestMandi}</p>
            )}
          </div>

          {/* Carbon Credits */}
          <div className="carbon-credits-market">
            <h4>🌍 Carbon Credits</h4>
            <div className="carbon-grid">
              <div className="carbon-stat">
                <span className="label">Price per Tonne</span>
                <span className="value">₹{orchestratorData.marketInsights.carbonCredits?.currentPricePerTonne ?? '--'}</span>
              </div>
              <div className="carbon-stat highlight">
                <span className="label">Carbon Credit Earnings</span>
                <span className="value-large">₹{(orchestratorData.marketInsights.carbonCredits?.estimatedEarnings ?? 0).toLocaleString('en-IN')}</span>
                <span className="label" style={{fontSize: '0.75rem', opacity: 0.8}}>Carbon credits only (not total income)</span>
              </div>
              <div className="carbon-stat">
                <span className="label">Scheme</span>
                <span className="value">{orchestratorData.marketInsights.carbonCredits?.registrationScheme ?? '--'}</span>
              </div>
            </div>
          </div>

          {/* Market Advice (SELL_NOW / WAIT / PARTIAL_SELL) */}
          {orchestratorData.marketInsights.marketAdvice && (
            <div className="market-advice">
              <h4>📊 Market Recommendation</h4>
              <div className={`advice-box recommendation-${(orchestratorData.marketInsights.marketAdvice.sellNowOrWait ?? 'WAIT').toLowerCase()}`}>
                <div className="advice-decision">
                  <span className="decision-label">Decision:</span>
                  <span className="decision-value">{orchestratorData.marketInsights.marketAdvice.sellNowOrWait?.replace(/_/g, ' ') ?? 'WAIT'}</span>
                </div>
                <p className="advice-reasoning">{orchestratorData.marketInsights.marketAdvice.reasoning}</p>
                
                {orchestratorData.marketInsights.marketAdvice.alternativeMarkets?.length > 0 && (
                  <div className="alternative-markets">
                    <strong>Alternative Markets:</strong>
                    <ul>
                      {orchestratorData.marketInsights.marketAdvice.alternativeMarkets.map((market, i) => (
                        <li key={i}>{market}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {orchestratorData.marketInsights.marketAdvice.govtSchemes?.length > 0 && (
                  <div className="govt-schemes">
                    <strong>Relevant Government Schemes:</strong>
                    <ul>
                      {orchestratorData.marketInsights.marketAdvice.govtSchemes.map((scheme, i) => (
                        <li key={i}>{scheme}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Total Potential Income */}
          <div className="total-income">
            <h4>💵 Total Potential Income</h4>
            <div className="income-value">
              {(() => {
                const mandiPrice = orchestratorData.marketInsights.mandiPrices?.currentPrice ?? 0
                const carbonEarnings = orchestratorData.marketInsights.carbonCredits?.estimatedEarnings ?? 0
                const farmSizeNum = parseFloat(formData.farmSize) || 5.2
                // Always calculate crop income from mandiPrice * farmSize * 25 quintals/ha
                const cropIncome = Math.round(mandiPrice * farmSizeNum * 25)
                const total = cropIncome + carbonEarnings
                return <>₹{total.toLocaleString('en-IN')}</>
              })()}
            </div>
            <div className="income-breakdown">
              <span>Crop sales: ₹{Math.round((orchestratorData.marketInsights.mandiPrices?.currentPrice ?? 0) * (parseFloat(formData.farmSize) || 5.2) * 25).toLocaleString('en-IN')}</span>
              <span>Carbon credits: ₹{(orchestratorData.marketInsights.carbonCredits?.estimatedEarnings ?? 0).toLocaleString('en-IN')}</span>
            </div>
            <p className="income-note">Based on {(parseFloat(formData.farmSize) || 5.2) * 25} quintals at ₹{orchestratorData.marketInsights.mandiPrices?.currentPrice ?? 0}/quintal + carbon credit earnings</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default RuralFarmerDashboard
