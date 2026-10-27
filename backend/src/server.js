const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { autoSeedIfEmpty, seedDatabase } = require('./seeds/seedData');

// Load environment variables
dotenv.config();

// Connect to MongoDB and auto-seed if newly deployed / empty
connectDB().then(() => {
  autoSeedIfEmpty();
});

const app = express();

// Security HTTP headers
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// Gzip compression for high throughput and reduced latency
app.use(compression());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['*'];

app.use(cors({
  origin: allowedOrigins.includes('*') ? '*' : allowedOrigins,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown';
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Agri-Tech Smart Farming API',
    environment: process.env.NODE_ENV || 'development',
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbState,
      host: mongoose.connection.host || 'unknown',
    },
    version: '1.0.0',
  });
});

// Manual database seeding endpoint for production initialization
app.get('/api/seed', async (req, res) => {
  try {
    const result = await seedDatabase();
    res.json({ success: true, message: 'Cloud database seeded successfully with demo data!', data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database seeding failed', error: err.message });
  }
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/farms', require('./routes/farmRoutes'));
app.use('/api/crops', require('./routes/cropRoutes'));
app.use('/api/soil', require('./routes/soilRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));
app.use('/api/pests', require('./routes/pestRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/consultations', require('./routes/expertRoutes'));
app.use('/api/forum', require('./routes/forumRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const fs = require('fs');

// Serve Frontend in Production or when built assets exist
const distPath = path.resolve(__dirname, '../../frontend/dist');
if (process.env.NODE_ENV === 'production' || fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    const indexPath = path.resolve(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    next();
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`[Server] Agri-Tech running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Graceful Shutdown handling for Production / Docker
const gracefulShutdown = (signal) => {
  console.log(`[Server] Received ${signal}. Closing HTTP server and database connections...`);
  server.close(async () => {
    try {
      await mongoose.connection.close(false);
      console.log('[Server] MongoDB connection closed cleanly. Process terminating.');
      process.exit(0);
    } catch (err) {
      console.error('[Server Error] Error closing DB connection:', err);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection] ${err.message}`);
});

module.exports = app;
