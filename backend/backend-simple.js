const express = require('express');
const app = express();

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'backend-simple' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'backend-simple', path: '/api/health' });
});

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple backend running on port ${PORT}`);
});
