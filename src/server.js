require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const scheduleDailyDigest = require('./jobs/dailyDigest');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const authMiddleware = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger documentation
const swaggerDoc = YAML.load('./swagger.yaml');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
app.set('supabase', supabase);

// Public routes
app.use('/api/auth', require('./routes/auth'));

// Protected routes
app.use('/api/tasks', authMiddleware, require('./routes/tasks'));
app.use('/api/categories', authMiddleware, require('./routes/categories'));
app.use('/api/analytics', authMiddleware, require('./routes/analytics'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = err.message || 'Something went wrong!';
  res.status(status).json({ error: message });
});

// Initialize scheduled jobs
scheduleDailyDigest(app);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Running on port ${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/docs`);
});