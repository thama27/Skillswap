import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import profileRoutes from './routes/profileRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import careerRoutes from './routes/careerRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow local development ports and no-origin requests (e.g. mobile/curl)
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing
app.use(express.json());

// Request logger for debugging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SkillSwap AI Backend API',
    timestamp: new Date().toISOString(),
    supabaseConnected: Boolean(process.env.SUPABASE_URL),
  });
});

// API Routes
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/career-recommendations', careerRoutes);

// 404 handler for undefined routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error-handling middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

// Start listener
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 SkillSwap AI Backend running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Supabase Project URL: ${process.env.SUPABASE_URL || 'Not specified'}`);
  console.log(`===============================================`);
});

export default app;
