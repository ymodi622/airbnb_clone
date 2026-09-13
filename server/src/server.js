'use strict';
const app = require('./app');
const config = require('./config/env');

const server = app.listen(config.port, () => {
  console.log(`[server] Running on http://localhost:${config.port} (${config.nodeEnv})`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[server] SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('[server] HTTP server closed.');
    process.exit(0);
  });
});
