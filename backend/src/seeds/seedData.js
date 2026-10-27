const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const SoilReport = require('../models/SoilReport');
const WeatherData = require('../models/WeatherData');
const PestAlert = require('../models/PestAlert');
const Resource = require('../models/Resource');
const Order = require('../models/Order');
const Consultation = require('../models/Consultation');
const ForumPost = require('../models/ForumPost');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agritech');
    console.log('[Seeder] Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany(),
      Farm.deleteMany(),
      Crop.deleteMany(),
      SoilReport.deleteMany(),
      WeatherData.deleteMany(),
      PestAlert.deleteMany(),
      Resource.deleteMany(),
      Order.deleteMany(),
      Consultation.deleteMany(),
      ForumPost.deleteMany(),
    ]);
    console.log('[Seeder] Cleared previous records.');

    // 1. Create Users
    const farmer = await User.create({
      name: 'Rameshwar Patil',
      email: 'farmer@agritech.com',
      password: 'farmer123',
      role: 'farmer',
      phone: '+91 98231 45678',
      preferredLanguage: 'en',
      region: 'Vidarbha Agrarian Region',
    });

    const admin = await User.create({
      name: 'Dr. Anita Deshmukh (Admin)',
      email: 'admin@agritech.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 99887 76655',
      preferredLanguage: 'en',
      region: 'Central Agritech Directorate',
    });

    console.log('[Seeder] Users created (farmer@agritech.com / farmer123, admin@agritech.com / admin123)');

    // 2. Create Farm
    const farm1 = await Farm.create({
      farmer: farmer._id,
      name: 'Surya Greenfields Agro',
      location: {
        address: 'Plot 44, Taluka Katol',
        state: 'Maharashtra',
        country: 'India',
        latitude: 21.2721,
        longitude: 78.5866,
      },
      totalArea: 25,
      soilType: 'Black Cotton',
      irrigationSource: 'Drip Irrigation',
      primaryCropCategory: 'Grains & Pulses',
      notes: 'Solar pump installed; soil tested in Q3. Dedicated organic zone on Sector C.',
    });

    const farm2 = await Farm.create({
      farmer: farmer._id,
      name: 'Ganga Valley Orchard',
      location: {
        address: 'Survey 108, Wardha River Basin',
        state: 'Maharashtra',
        country: 'India',
        latitude: 20.7453,
        longitude: 78.6022,
      },
      totalArea: 14,
      soilType: 'Red Loam',
      irrigationSource: 'Canal / River',
      primaryCropCategory: 'Horticulture & Fruits',
      notes: 'Orange and pomegranate plantation with mulched drip beds.',
    });

    // 3. Create Crops
    const crop1 = await Crop.create({
      farm: farm1._id,
      farmer: farmer._id,
      name: 'Soybean (JS-335)',
      variety: 'JS-335 High Yield',
      areaPlanted: 15,
      sowingDate: new Date('2026-06-20'),
      expectedHarvestDate: new Date('2026-11-10'),
      stage: 'Flowering',
      healthStatus: 'Optimal',
      targetYield: 180, // quintals
      actualYield: 0,
      notes: 'Vigorous pod formation; companion crop marigold planted along border.',
      activities: [
        { date: new Date('2026-06-20'), activityType: 'Sowing', details: 'Direct seed drill sowing with bio-fertilizer treatment', cost: 12000 },
        { date: new Date('2026-07-15'), activityType: 'Weeding', details: 'Manual interculture weeding across rows', cost: 4500 },
        { date: new Date('2026-08-05'), activityType: 'Fertilization', details: 'Foliar spray of 19:19:19 water soluble nutrients', cost: 3800 },
      ],
    });

    const crop2 = await Crop.create({
      farm: farm1._id,
      farmer: farmer._id,
      name: 'Bt Cotton (Rasi 659)',
      variety: 'Rasi 659 BG II',
      areaPlanted: 10,
      sowingDate: new Date('2026-07-02'),
      expectedHarvestDate: new Date('2026-12-15'),
      stage: 'Vegetative',
      healthStatus: 'Mild Stress',
      targetYield: 120,
      actualYield: 0,
      notes: 'Minor sucking pest pressure observed on lower leaves; yellow sticky traps deployed.',
      activities: [
        { date: new Date('2026-07-02'), activityType: 'Sowing', details: 'Bed preparation and precision seed planting', cost: 9500 },
        { date: new Date('2026-08-10'), activityType: 'Pesticide Application', details: 'Organic Neem oil 10,000 ppm spray preventive measure', cost: 2200 },
      ],
    });

    // 4. Create Soil Report
    await SoilReport.create({
      farm: farm1._id,
      farmer: farmer._id,
      labOrDevice: 'District Soil Test Lab #8 (Govt Certified)',
      ph: 6.8,
      nitrogen: 340,
      phosphorus: 38,
      potassium: 245,
      organicCarbon: 0.75,
      moisturePercentage: 23.5,
      electricalConductivity: 0.38,
      overallHealthScore: 89,
      recommendations: [
        'Soil fertility index is in high grade (Grade A).',
        'Maintain soil organic carbon by incorporating crop residues and compost.',
        'Balanced NPK enables higher phosphorus availability during flower initiation.',
      ],
      suitableCrops: ['Soybean', 'Wheat', 'Chickpeas (Gram)', 'Cotton', 'Maize'],
    });

    // 5. Create Weather Data
    await WeatherData.create({
      locationName: 'Nagpur / Vidarbha Agro-Zone',
      state: 'Maharashtra',
      coordinates: { latitude: 21.1458, longitude: 79.0882 },
      current: {
        temperature: 30.5,
        feelsLike: 32.1,
        humidity: 54,
        windSpeed: 12,
        precipitationChance: 10,
        condition: 'Clear & Sunny',
        uvIndex: 7,
        airQualityIndex: 45,
        updatedAt: new Date(),
      },
      forecast: [
        { day: 'Mon', date: 'Oct 28', condition: 'Sunny', tempMax: 32, tempMin: 21, humidity: 52, rainProbability: 10 },
        { day: 'Tue', date: 'Oct 29', condition: 'Partly Cloudy', tempMax: 31, tempMin: 22, humidity: 60, rainProbability: 20 },
        { day: 'Wed', date: 'Oct 30', condition: 'Scattered Showers', tempMax: 29, tempMin: 20, humidity: 75, rainProbability: 60 },
        { day: 'Thu', date: 'Oct 31', condition: 'Overcast', tempMax: 29, tempMin: 19, humidity: 68, rainProbability: 35 },
        { day: 'Fri', date: 'Nov 01', condition: 'Clear', tempMax: 30, tempMin: 18, humidity: 48, rainProbability: 5 },
      ],
      agriculturalAdvisories: [
        'Weather outlook favorable for harvesting mature kharif crops over the next 48 hours.',
        'High humidity midweek: inspect soybean fields for root rot or fungal symptoms.',
        'Schedule drip irrigation early morning (6 AM - 8:30 AM) to maximize water absorption.',
      ],
    });

    // 6. Create Pest Alerts
    await PestAlert.create([
      {
        pestName: 'Fall Armyworm (Spodoptera frugiperda)',
        scientificName: 'Spodoptera frugiperda',
        targetCrops: ['Maize', 'Sorghum', 'Sweet Corn'],
        severity: 'High',
        affectedRegions: ['Vidarbha', 'Marathwada', 'Northern Plains'],
        symptoms: ['Window-paning damage on whorl leaves', 'Large holes in leaf blades', 'Moist sawdust-like frass inside the whorl'],
        preventiveMeasures: ['Deep summer ploughing to expose pupae', 'Intercropping with pulses or cowpea', 'Install pheromone traps @ 5 per acre'],
        recommendedTreatments: ['Foliar spray with Bacillus thuringiensis (Bt) @ 2g/L', 'Spinetoram 11.7 SC @ 0.5 ml/L of water during evening hours'],
        imageUrl: 'https://images.unsplash.com/photo-1599582107412-2e4a42b10292?auto=format&fit=crop&w=600&q=80',
        active: true,
      },
      {
        pestName: 'Pink Bollworm (Pectinophora gossypiella)',
        scientificName: 'Pectinophora gossypiella',
        targetCrops: ['Cotton'],
        severity: 'Critical',
        affectedRegions: ['Maharashtra', 'Gujarat', 'Telangana'],
        symptoms: ['Rosetted flowers that fail to open', 'Premature boll opening and lint staining', 'Entry holes sealed with larval excreta'],
        preventiveMeasures: ['Use pheromone traps @ 8 per acre for monitoring', 'Timely destruction of crop residues after harvest', 'Avoid extending crop season beyond 160 days'],
        recommendedTreatments: ['Trichogramma bactrae egg parasitoid releases @ 60,000/acre', 'Spray Profenophos 50 EC @ 2ml/L if trap catches exceed threshold'],
        imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
        active: true,
      },
      {
        pestName: 'Yellow Mosaic Virus (Whitefly Transmitted)',
        scientificName: 'Mungbean Yellow Mosaic India Virus',
        targetCrops: ['Soybean', 'Blackgram', 'Greengram'],
        severity: 'Moderate',
        affectedRegions: ['Central India', 'Punjab'],
        symptoms: ['Bright yellow mosaic patches on green leaves', 'Stunted plant growth and reduced pod setting'],
        preventiveMeasures: ['Sow resistant crop varieties', 'Install yellow sticky traps @ 10-12 per acre', 'Maintain clean field borders'],
        recommendedTreatments: ['Spray systemic insecticide Acetamiprid 20 SP @ 0.2g/L to check whitefly vector population'],
        imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=600&q=80',
        active: true,
      },
    ]);

    // 7. Create Agricultural Resources
    const resources = await Resource.create([
      {
        name: 'Hybrid Golden Wheat Seeds (HD-3086)',
        category: 'Seeds & Hybrids',
        brand: 'AgriPrime Certified',
        description: 'High-yielding, rust-resistant wheat seed variety certified by IARI. Exceptional baking quality and robust drought resistance.',
        price: 950,
        unit: '40 kg Bag',
        stockQuantity: 120,
        inStock: true,
        rating: 4.9,
        imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Organic Bio-Potash (100% Water Soluble)',
        category: 'Bio-Fertilizers & Nutrients',
        brand: 'BioKisan Nutrients',
        description: 'Eco-certified microbial potash fertilizer derived from molasses. Promotes chlorophyll synthesis, grain weight, and drought resistance.',
        price: 680,
        unit: '25 kg Bag',
        stockQuantity: 85,
        inStock: true,
        rating: 4.8,
        imageUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Pure Neem Seed Oil Bio-Pesticide (10,000 PPM)',
        category: 'Organic Pesticides',
        brand: 'GreenShield Organics',
        description: 'Cold-pressed azadirachtin formulation effective against 200+ sucking pests, caterpillars, and fungal pathogens. Zero toxic residues.',
        price: 490,
        unit: '1 Liter Bottle',
        stockQuantity: 240,
        inStock: true,
        rating: 4.7,
        imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Precision Drip Lateral Tube 16mm (500m Roll)',
        category: 'Irrigation Tools',
        brand: 'AquaFlow MicroDrip',
        description: 'UV-stabilized virgin HDPE drip lateral with pressure compensating inline drippers at 40cm spacing. Conserves 60% irrigation water.',
        price: 2450,
        unit: '500 Meter Bundle',
        stockQuantity: 40,
        inStock: true,
        rating: 4.9,
        imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Kisan Power 16L Dual-Battery Knapsack Sprayer',
        category: 'Farm Machinery & Implements',
        brand: 'AgriTech Tools Pro',
        description: 'Heavy-duty 12V 12Ah lithium rechargeable battery sprayer with 4 brass nozzles, pressure regulator, and telescopic stainless steel lance.',
        price: 3200,
        unit: 'Unit Machine',
        stockQuantity: 30,
        inStock: true,
        rating: 4.8,
        imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Trichoderma Viride Bio-Fungicide (1% W.P.)',
        category: 'Organic Pesticides',
        brand: 'BioSafe Crop Care',
        description: 'Antagonistic fungal culture for seed treatment and soil application to control root rot, damping-off, and collar rot in all crops.',
        price: 340,
        unit: '1 kg Pack',
        stockQuantity: 150,
        inStock: true,
        rating: 4.7,
        imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=600&q=80',
      },
    ]);

    // 8. Create Order
    await Order.create({
      farmer: farmer._id,
      orderNumber: 'AGR-748291-301',
      items: [
        {
          resource: resources[0]._id,
          name: resources[0].name,
          price: resources[0].price,
          quantity: 2,
          unit: resources[0].unit,
          subtotal: 1900,
        },
        {
          resource: resources[2]._id,
          name: resources[2].name,
          price: resources[2].price,
          quantity: 1,
          unit: resources[2].unit,
          subtotal: 490,
        },
      ],
      totalAmount: 2390,
      shippingAddress: {
        street: 'Plot 44, Surya Farm House',
        villageDistrict: 'Katol, Nagpur',
        state: 'Maharashtra',
        postalCode: '441302',
        contactPhone: '+91 98231 45678',
      },
      paymentMethod: 'Cash on Delivery (Kisan Pay)',
      status: 'Dispatched',
      trackingUpdates: [
        { status: 'Placed', location: 'Central Agro Hub, Nagpur Warehouse', timestamp: new Date(Date.now() - 86400000 * 2), notes: 'Order placed by farmer and payment method verified.' },
        { status: 'Processing', location: 'Nagpur Packing Unit', timestamp: new Date(Date.now() - 86400000), notes: 'Quality inspected and packaged with weather-proof seal.' },
        { status: 'Dispatched', location: 'Katol Agro Express Logistics Van #4', timestamp: new Date(), notes: 'Out for transit towards farmer delivery hub.' },
      ],
    });

    // 9. Create Expert Consultation
    await Consultation.create({
      farmer: farmer._id,
      subject: 'Early curling and discoloration on cotton bolls',
      cropType: 'Bt Cotton (Rasi 659)',
      category: 'Crop Disease & Pathology',
      description: 'Noticed leaf margin curling and tiny green insects under the surface after recent light drizzle. Need advice on whether systemic spray is needed.',
      urgency: 'High',
      status: 'Resolved',
      expertName: 'Dr. Ramesh Patil (Senior Agronomist)',
      expertResponse: 'These are classic early symptoms of jassid/aphid sucking pest pressure following high humidity. Recommend immediate spray of Neem Oil (10,000 ppm) at 3 ml/L along with sticky traps. If infestation exceeds 2 nymphs per leaf, use Flonicamid 50 WG at 0.3g per liter.',
      answeredAt: new Date(),
    });

    // 10. Create Forum Posts
    const post1 = await ForumPost.create({
      author: farmer._id,
      authorName: 'Rameshwar Patil',
      title: 'Success with Drip Fertigation on Soybean & Cotton Beds',
      category: 'Crop Care & Protection',
      content: 'Switched from flood irrigation to 16mm inline drip this kharif season. Water usage dropped by nearly 50%, and nutrient application via venturi injector gave noticeably uniform green canopies without weed proliferation. Highly recommended for black cotton soil!',
      likes: [farmer._id, admin._id],
      comments: [
        {
          author: admin._id,
          authorName: 'Dr. Anita Deshmukh (Admin)',
          content: 'Excellent observation Rameshwar ji! Drip fertigation on heavy clay soils prevents root asphyxiation during heavy monsoon spells as well.',
          createdAt: new Date(),
        },
      ],
      isPinned: true,
    });

    await ForumPost.create({
      author: farmer._id,
      authorName: 'Kisan Balwant Singh',
      title: 'Current Mandi MSP trends for Soybean and Mustard rabi planning',
      category: 'Market Rates & MSP',
      content: 'Local APMC mandis are reporting steady rates for good oil-content soybean varieties. For those planning Rabi sowing, mustard or gram (chickpea) looks lucrative due to favorable minimum support price projections.',
      likes: [farmer._id],
      comments: [],
    });

    console.log('[Seeder] Database seeding completed successfully!');
    return { success: true, message: 'Database seeded successfully' };
  } catch (error) {
    console.error('[Seeder Error]', error);
    throw error;
  }
};

const autoSeedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Auto-Seed] No users found in database. Initializing cloud database with demo data...');
      await seedDatabase();
      console.log('[Auto-Seed] Initial data population completed!');
    } else {
      console.log(`[Auto-Seed] Database already has ${userCount} users. Skipping auto-seed.`);
    }
  } catch (err) {
    console.error('[Auto-Seed Warning] Could not check or auto-seed database:', err.message);
  }
};

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { seedDatabase, autoSeedIfEmpty };
