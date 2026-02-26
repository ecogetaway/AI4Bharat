// Mock data for the prototype

export const farmerData = {
  farmerId: "F-2024-001",
  farmerName: "Rajesh Kumar",
  cooperativeId: "FPO-MH-001",
  cooperativeName: "Maharashtra Organic Farmers Cooperative",
  location: "Nashik District, Maharashtra",
  farmSize: 5.2, // hectares
  
  carbonFootprint: {
    totalEmissions: 12.4, // tonnes CO2e per year
    emissionsPerHectare: 2.38,
    breakdown: [
      { category: "Fertilizer Use", emissions: 5.2, percentage: 42 },
      { category: "Irrigation", emissions: 3.1, percentage: 25 },
      { category: "Pesticides", emissions: 1.8, percentage: 15 },
      { category: "Machinery", emissions: 1.5, percentage: 12 },
      { category: "Transportation", emissions: 0.8, percentage: 6 }
    ],
    trend: [
      { month: "Jan", emissions: 13.2 },
      { month: "Feb", emissions: 12.8 },
      { month: "Mar", emissions: 12.5 },
      { month: "Apr", emissions: 12.4 },
      { month: "May", emissions: 12.1 },
      { month: "Jun", emissions: 12.4 }
    ]
  },
  
  carbonSequestration: 3.2, // tonnes CO2e per year
  netEmissions: 9.2, // tonnes CO2e per year
  
  crops: [
    { name: "Organic Rice", area: 3.0, emissions: 7.2, yield: 4.5 },
    { name: "Pulses", area: 1.5, emissions: 3.1, yield: 1.8 },
    { name: "Vegetables", area: 0.7, emissions: 2.1, yield: 8.2 }
  ],
  
  sustainabilityPremium: {
    currentPrice: 2850, // INR per quintal
    conventionalPrice: 2400,
    premiumAmount: 450,
    premiumPercentage: 18.75,
    certifications: ["Organic", "Fair Trade"],
    potentialAnnualIncome: 67500 // INR
  },
  
  carbonCredits: {
    eligible: true,
    potentialCredits: 3.2, // tonnes CO2e
    estimatedValue: 9600, // INR (at ₹3000 per tonne)
    status: "Pending Verification",
    verificationDate: "2026-03-15"
  },
  
  recommendations: [
    {
      id: 1,
      title: "Switch to Bio-Fertilizers",
      impact: "Reduce emissions by 2.1 tonnes CO2e/year",
      cost: "₹8,500 initial investment",
      savings: "₹12,000/year + ₹6,300 carbon credits",
      priority: "high"
    },
    {
      id: 2,
      title: "Install Drip Irrigation",
      impact: "Reduce emissions by 1.5 tonnes CO2e/year",
      cost: "₹45,000 (50% govt subsidy available)",
      savings: "₹18,000/year water + ₹4,500 carbon credits",
      priority: "high"
    },
    {
      id: 3,
      title: "Adopt Cover Cropping",
      impact: "Increase sequestration by 1.8 tonnes CO2e/year",
      cost: "₹3,000/year",
      savings: "₹5,400/year carbon credits + soil health",
      priority: "medium"
    }
  ]
};

export const supplyChainData = {
  productName: "Organic Cotton T-Shirt",
  productId: "SKU-TEX-001",
  totalEmissions: 8.45, // kg CO2e per unit
  
  bomAnalysis: [
    {
      componentId: "C001",
      componentName: "Organic Cotton Fabric",
      supplierId: "SUP-IND-045",
      supplierName: "Gujarat Organic Textiles",
      location: "Ahmedabad, Gujarat",
      emissions: 4.2,
      percentage: 49.7,
      carbonIntensity: 2.8, // kg CO2e per kg
      quantity: 1.5, // kg
      tier: 1,
      severity: "medium",
      alternatives: 2
    },
    {
      componentId: "C002",
      componentName: "Synthetic Dye",
      supplierId: "SUP-CHN-112",
      supplierName: "ChemColor Industries",
      location: "Guangzhou, China",
      emissions: 2.8,
      percentage: 33.1,
      carbonIntensity: 14.0, // kg CO2e per kg
      quantity: 0.2, // kg
      tier: 2,
      severity: "critical",
      alternatives: 3
    },
    {
      componentId: "C003",
      componentName: "Polyester Thread",
      supplierId: "SUP-IND-078",
      supplierName: "Mumbai Thread Co.",
      location: "Mumbai, Maharashtra",
      emissions: 0.85,
      percentage: 10.1,
      carbonIntensity: 8.5, // kg CO2e per kg
      quantity: 0.1, // kg
      tier: 1,
      severity: "high",
      alternatives: 1
    },
    {
      componentId: "C004",
      componentName: "Buttons (Plastic)",
      supplierId: "SUP-BGD-023",
      supplierName: "Dhaka Accessories",
      location: "Dhaka, Bangladesh",
      emissions: 0.35,
      percentage: 4.1,
      carbonIntensity: 7.0, // kg CO2e per kg
      quantity: 0.05, // kg
      tier: 2,
      severity: "medium",
      alternatives: 2
    },
    {
      componentId: "C005",
      componentName: "Packaging",
      supplierId: "SUP-IND-091",
      supplierName: "EcoPack Solutions",
      location: "Pune, Maharashtra",
      emissions: 0.25,
      percentage: 3.0,
      carbonIntensity: 1.25, // kg CO2e per kg
      quantity: 0.2, // kg
      tier: 1,
      severity: "low",
      alternatives: 1
    }
  ],
  
  hotspots: [
    {
      id: 1,
      component: "Synthetic Dye",
      supplier: "ChemColor Industries",
      emissions: 2.8,
      severity: "critical",
      reason: "High carbon intensity (14.0 kg CO2e/kg) and long-distance shipping",
      recommendation: "Switch to natural dyes from local suppliers",
      potentialReduction: 2.1,
      costImpact: "+8% material cost, -25% shipping cost"
    },
    {
      id: 2,
      component: "Polyester Thread",
      supplier: "Mumbai Thread Co.",
      emissions: 0.85,
      severity: "high",
      reason: "Fossil fuel-based material with high processing emissions",
      recommendation: "Use recycled polyester or organic cotton thread",
      potentialReduction: 0.6,
      costImpact: "+5% material cost"
    }
  ],
  
  scope3Breakdown: {
    scope31: 7.2, // Purchased Goods and Services
    scope34: 1.25, // Upstream Transportation
    total: 8.45
  },
  
  transportationAnalysis: [
    {
      route: "Guangzhou → Mumbai (Sea Freight)",
      distance: 4200, // km
      mode: "Container Ship",
      emissions: 0.84,
      alternatives: [
        { mode: "Air Freight", emissions: 4.2, time: "3 days", cost: "+250%" },
        { mode: "Rail + Sea", emissions: 0.72, time: "28 days", cost: "+5%" }
      ]
    },
    {
      route: "Ahmedabad → Mumbai (Road)",
      distance: 530, // km
      mode: "Truck",
      emissions: 0.41,
      alternatives: [
        { mode: "Rail", emissions: 0.18, time: "+1 day", cost: "-15%" }
      ]
    }
  ],
  
  optimizationOpportunities: [
    {
      id: 1,
      title: "Local Natural Dye Sourcing",
      type: "Material Substitution",
      emissionReduction: 2.1,
      reductionPercentage: 24.9,
      costImpact: -12, // negative means savings
      implementation: "Medium complexity",
      timeline: "3-6 months",
      noRegret: true
    },
    {
      id: 2,
      title: "Rail Transportation for Domestic Routes",
      type: "Logistics Optimization",
      emissionReduction: 0.23,
      reductionPercentage: 2.7,
      costImpact: -15,
      implementation: "Low complexity",
      timeline: "1-2 months",
      noRegret: true
    },
    {
      id: 3,
      title: "Recycled Polyester Thread",
      type: "Material Substitution",
      emissionReduction: 0.6,
      reductionPercentage: 7.1,
      costImpact: +5,
      implementation: "Low complexity",
      timeline: "1 month",
      noRegret: false
    }
  ]
};

export const cooperativeData = {
  cooperativeId: "FPO-MH-001",
  cooperativeName: "Maharashtra Organic Farmers Cooperative",
  location: "Nashik District, Maharashtra",
  establishedYear: 2018,
  memberCount: 247,
  totalFarmArea: 1284, // hectares
  
  aggregatedEmissions: {
    totalEmissions: 3068, // tonnes CO2e per year
    emissionsPerHectare: 2.39,
    totalSequestration: 790, // tonnes CO2e per year
    netEmissions: 2278, // tonnes CO2e per year
    
    breakdown: [
      { category: "Fertilizer Use", emissions: 1289, percentage: 42 },
      { category: "Irrigation", emissions: 767, percentage: 25 },
      { category: "Pesticides", emissions: 552, percentage: 18 },
      { category: "Machinery", emissions: 368, percentage: 12 },
      { category: "Transportation", emissions: 92, percentage: 3 }
    ],
    
    trend: [
      { year: "2022", emissions: 3450, sequestration: 620 },
      { year: "2023", emissions: 3280, sequestration: 695 },
      { year: "2024", emissions: 3150, sequestration: 735 },
      { year: "2025", emissions: 3068, sequestration: 790 }
    ]
  },
  
  topPerformers: [
    { farmerId: "F-2024-001", name: "Rajesh Kumar", emissions: 2.38, reduction: 12 },
    { farmerId: "F-2024-045", name: "Priya Sharma", emissions: 2.41, reduction: 10 },
    { farmerId: "F-2024-089", name: "Amit Patel", emissions: 2.45, reduction: 9 },
    { farmerId: "F-2024-112", name: "Sunita Desai", emissions: 2.48, reduction: 8 },
    { farmerId: "F-2024-156", name: "Vikram Singh", emissions: 2.52, reduction: 7 }
  ],
  
  improvementOpportunities: [
    {
      category: "High Emitters",
      count: 34,
      avgEmissions: 3.2,
      potentialReduction: 27,
      targetEmissions: 2.4
    },
    {
      category: "Medium Emitters",
      count: 128,
      avgEmissions: 2.5,
      potentialReduction: 15,
      targetEmissions: 2.1
    },
    {
      category: "Low Emitters",
      count: 85,
      avgEmissions: 1.8,
      potentialReduction: 5,
      targetEmissions: 1.7
    }
  ],
  
  carbonCredits: {
    totalEligibleCredits: 790, // tonnes CO2e
    verifiedCredits: 620,
    pendingVerification: 170,
    totalValue: 2370000, // INR (at ₹3000 per tonne)
    distributionPerFarmer: 9595, // INR average
    status: "Active Trading",
    
    buyers: [
      { name: "TechCorp India", credits: 250, value: 750000 },
      { name: "Green Energy Ltd", credits: 200, value: 600000 },
      { name: "Sustainable Foods", credits: 170, value: 510000 }
    ]
  },
  
  sustainabilityPremium: {
    totalPremiumEarned: 16687500, // INR per year
    averagePerFarmer: 67550,
    premiumPercentage: 18.5,
    certifications: ["Organic", "Fair Trade", "Rainforest Alliance"],
    marketAccess: ["Export", "Premium Retail", "Direct-to-Consumer"]
  },
  
  collectiveImpact: {
    emissionReduction: 382, // tonnes CO2e vs 2022 baseline
    reductionPercentage: 11.1,
    treesEquivalent: 17364, // trees planted equivalent
    carsOffRoad: 83, // cars off road for 1 year equivalent
    
    achievements: [
      "11% emission reduction since 2022",
      "₹2.37 Cr earned from carbon credits",
      "₹1.67 Cr sustainability premium income",
      "247 farmers trained in regenerative practices",
      "1,284 hectares under sustainable management"
    ]
  },
  
  memberDistribution: [
    { category: "Small (< 2 ha)", count: 98, percentage: 39.7 },
    { category: "Medium (2-5 ha)", count: 112, percentage: 45.3 },
    { category: "Large (> 5 ha)", count: 37, percentage: 15.0 }
  ],
  
  cropDistribution: [
    { crop: "Rice", area: 512, percentage: 39.9 },
    { crop: "Pulses", area: 385, percentage: 30.0 },
    { crop: "Vegetables", area: 257, percentage: 20.0 },
    { crop: "Fruits", area: 130, percentage: 10.1 }
  ],
  
  recommendations: [
    {
      id: 1,
      title: "Cooperative Biogas Plant",
      impact: "Reduce 145 tonnes CO2e/year across all farms",
      cost: "₹25 lakhs (70% govt subsidy available)",
      savings: "₹8.5 lakhs/year energy + ₹4.35 lakhs carbon credits",
      beneficiaries: 247,
      priority: "high"
    },
    {
      id: 2,
      title: "Shared Solar Irrigation System",
      impact: "Reduce 98 tonnes CO2e/year",
      cost: "₹45 lakhs (60% subsidy + low-interest loan)",
      savings: "₹12 lakhs/year electricity + ₹2.94 lakhs carbon credits",
      beneficiaries: 156,
      priority: "high"
    },
    {
      id: 3,
      title: "Cooperative Composting Facility",
      impact: "Reduce 67 tonnes CO2e/year + improve soil health",
      cost: "₹8 lakhs",
      savings: "₹5.5 lakhs/year fertilizer + ₹2.01 lakhs carbon credits",
      beneficiaries: 247,
      priority: "medium"
    }
  ]
};
