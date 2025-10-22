require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDatabase = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');
// integrationRoutes handled inline to use query strings

const app = express();

// Trust proxy - required when behind nginx/load balancer
app.set('trust proxy', 1);

// Connect to database
connectDatabase();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://alphatechx.fly.dev',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or same-origin requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now since we're behind nginx
    }
  },
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static('uploads'));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'backend' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);

// Inline integration routes - using query strings to avoid path-to-regexp issues
const UserIntegration = require('./models/UserIntegration');

// GET /api/integrations/boturl?userId=xxx
app.get('/api/integrations/boturl', async (req, res) => {
  try {
    const integration = await UserIntegration.findOne({ userId: req.query.userId });
    res.json({ botServiceUrl: integration?.microsoftBotServiceUrl || '' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bot service URL' });
  }
});

// GET /api/integrations/get?userId=xxx
app.get('/api/integrations/get', async (req, res) => {
  try {
    const integration = await UserIntegration.findOne({ userId: req.query.userId });
    res.json({ integration });
  } catch (error) {
    res.status(404).json({ message: 'Integration not found' });
  }
});

// POST /api/integrations/save
app.post('/api/integrations/save', async (req, res) => {
  try {
    const { userId, ...integrationData } = req.body;
    const integration = await UserIntegration.findOneAndUpdate(
      { userId },
      { ...integrationData, userId },
      { upsert: true, new: true }
    );
    res.json({ success: true, integration });
  } catch (error) {
    res.status(500).json({ message: 'Error updating integration' });
  }
});

// DELETE /api/integrations/delete?userId=xxx
app.delete('/api/integrations/delete', async (req, res) => {
  try {
    await UserIntegration.findOneAndDelete({ userId: req.query.userId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting integration' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Alfa TechX API is running!',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

// 404 handler - using a function instead of '*' to avoid path-to-regexp errors
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Alfa TechX Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
}); 