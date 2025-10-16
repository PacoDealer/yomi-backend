const express = require('express');
const cors = require('cors');
const keiyoushiRoutes = require('./routes/keiyoushi');
const searchRoutes = require('./routes/search');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'online',
    message: 'YOMI Backend API',
    version: '1.0.0',
    endpoints: {
      extensions: '/api/keiyoushi/extensions',
      search: '/api/search/:extensionId',
      chapters: '/api/chapters/:mangaId'
    }
  });
});

// Routes
app.use('/api/keiyoushi', keiyoushiRoutes);
app.use('/api', searchRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 YOMI Backend running on port ${PORT}`);
});