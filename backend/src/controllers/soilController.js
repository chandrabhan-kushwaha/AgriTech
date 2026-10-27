const SoilReport = require('../models/SoilReport');
const Farm = require('../models/Farm');

// Helper to analyze soil and generate recommendations
const generateSoilInsights = (ph, n, p, k, oc, moisture) => {
  const recommendations = [];
  const suitableCrops = [];
  let score = 70;

  // pH evaluation
  if (ph < 6.0) {
    recommendations.push('Soil is acidic. Apply agricultural lime (calcium carbonate) or dolomite at 200-300 kg/acre to neutralize acidity.');
    score -= 10;
  } else if (ph > 7.8) {
    recommendations.push('Soil is slightly alkaline. Apply gypsum or organic sulfur to lower pH and improve micronutrient availability.');
    score -= 8;
  } else {
    recommendations.push('Optimal pH balance maintained for balanced nutrient assimilation.');
    score += 8;
  }

  // Nitrogen (N) (ideal 250 - 450 kg/ha)
  if (n < 250) {
    recommendations.push('Nitrogen is deficient. Incorporate legume cover crops or apply Neem-coated Urea / composted cow manure.');
    score -= 8;
  } else if (n > 500) {
    recommendations.push('Nitrogen is excessive. Restrict nitrogenous fertilizers to avoid vegetative overgrowth and pest attraction.');
  } else {
    recommendations.push('Nitrogen reserves are well-balanced.');
    score += 7;
  }

  // Phosphorus (P) (ideal 20 - 50 kg/ha)
  if (p < 20) {
    recommendations.push('Phosphorus is low. Apply Single Super Phosphate (SSP) or rock phosphate to encourage strong root architecture.');
    score -= 6;
  } else {
    recommendations.push('Phosphorus level supports healthy flowering and root systems.');
    score += 5;
  }

  // Potassium (K) (ideal 150 - 300 kg/ha)
  if (k < 150) {
    recommendations.push('Potassium is low. Apply Muriate of Potash (MOP) or wood ash to enhance drought tolerance and disease defense.');
    score -= 6;
  } else {
    recommendations.push('Potassium level supports high grain/fruit quality and disease resistance.');
    score += 5;
  }

  // Moisture & Organic Carbon
  if (oc < 0.5) {
    recommendations.push('Organic carbon is depleted. Apply vermicompost and mulching to revive microbial biodiversity.');
    score -= 6;
  } else {
    score += 5;
  }

  // Crop suitability
  if (ph >= 6.0 && ph <= 7.5) {
    suitableCrops.push('Wheat', 'Soybean', 'Maize (Corn)', 'Cotton', 'Tomatoes', 'Groundnut');
  } else if (ph < 6.0) {
    suitableCrops.push('Paddy (Rice)', 'Tea', 'Potato', 'Ginger', 'Pineapple');
  } else {
    suitableCrops.push('Barley', 'Mustard', 'Pomegranate', 'Guava', 'Spinach');
  }

  const overallHealthScore = Math.min(Math.max(score, 30), 98);
  return { recommendations, suitableCrops, overallHealthScore };
};

// @desc    Get all soil reports for current user's farms
// @route   GET /api/soil
// @access  Private
const getSoilReports = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { farmer: req.user._id };
    const reports = await SoilReport.find(query)
      .populate('farm', 'name location totalArea soilType')
      .populate('farmer', 'name email')
      .sort({ testedAt: -1 });

    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single soil report
// @route   GET /api/soil/:id
// @access  Private
const getSoilReportById = async (req, res, next) => {
  try {
    const report = await SoilReport.findById(req.params.id)
      .populate('farm', 'name location totalArea soilType')
      .populate('farmer', 'name email');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Soil report not found' });
    }

    if (req.user.role !== 'admin' && report.farmer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new soil test report
// @route   POST /api/soil
// @access  Private
const createSoilReport = async (req, res, next) => {
  try {
    const { farm, labOrDevice, ph, nitrogen, phosphorus, potassium, organicCarbon, moisturePercentage, electricalConductivity } = req.body;

    const farmDoc = await Farm.findById(farm);
    if (!farmDoc) {
      return res.status(404).json({ success: false, message: 'Farm not found' });
    }

    const { recommendations, suitableCrops, overallHealthScore } = generateSoilInsights(
      Number(ph),
      Number(nitrogen),
      Number(phosphorus),
      Number(potassium),
      Number(organicCarbon || 0.6),
      Number(moisturePercentage || 22)
    );

    const report = await SoilReport.create({
      farm,
      farmer: req.user._id,
      labOrDevice: labOrDevice || 'Soil Testing Sensor Kit',
      ph: Number(ph),
      nitrogen: Number(nitrogen),
      phosphorus: Number(phosphorus),
      potassium: Number(potassium),
      organicCarbon: Number(organicCarbon) || 0.65,
      moisturePercentage: Number(moisturePercentage) || 24,
      electricalConductivity: Number(electricalConductivity) || 0.45,
      overallHealthScore,
      recommendations,
      suitableCrops,
    });

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete soil report
// @route   DELETE /api/soil/:id
// @access  Private
const deleteSoilReport = async (req, res, next) => {
  try {
    const report = await SoilReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    if (req.user.role !== 'admin' && report.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await report.deleteOne();
    res.json({ success: true, message: 'Soil report deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSoilReports, getSoilReportById, createSoilReport, deleteSoilReport };
