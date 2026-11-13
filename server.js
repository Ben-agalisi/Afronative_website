/**
 * ==============================================================================
 * AFRONATIVE ENTERTAINMENT - LOCAL DEVELOPMENT SERVER
 * ==============================================================================
 * TEACHING NOTE:
 * This Express server acts as our local web server to serve the frontend files
 * located in the `public/` directory (HTML, CSS, JS, images).
 *
 * Later, when we build the Python Admin, this frontend can easily connect to
 * Python API endpoints (FastAPI / Flask) or be served directly by Python.
 * ==============================================================================
 */

const express = require('express');
const path = require('path');
const compression = require('compression');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable HTTP request logging in terminal
app.use(morgan('dev'));

// Enable gzip/deflate compression for high-speed image and CSS delivery
app.use(compression());

// Parse JSON request bodies
app.use(express.json());

// Serve static assets from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Optional Mock API route (demonstrating how frontend talks to backend APIs)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'AfroNative Entertainment',
    version: '1.0.0 (Brand Identity 2026)',
    timestamp: new Date().toISOString()
  });
});

// Reservation / Ticket API placeholder
app.post('/api/reservations', (req, res) => {
  const { event, name, email, tier } = req.body;
  console.log(`[RESERVATION RECEIVED] ${name} (${email}) for ${event} - Tier: ${tier}`);
  res.status(201).json({
    success: true,
    message: 'Reservation recorded successfully. Official ticket will be dispatched.',
    bookingReference: 'AFRO-' + Math.floor(100000 + Math.random() * 900000)
  });
});

// Fallback to index.html for any unmatched route
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n==================================================`);
  console.log(`🔥 AFRONATIVE ENTERTAINMENT WEB SERVER RUNNING`);
  console.log(`📍 URL: http://localhost:${PORT} or http://127.0.0.1:${PORT}`);
  console.log(`==================================================\n`);
});
