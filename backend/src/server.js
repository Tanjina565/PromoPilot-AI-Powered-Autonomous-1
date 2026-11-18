import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';

const startServer = async () => {
  // Bind to 0.0.0.0 to support both local and network interfaces simultaneously
  const server = app.listen(config.port, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`  PromoPilot Backend API Server`);
    console.log(`  Environment: ${config.nodeEnv}`);
    console.log(`  Local:       http://localhost:${config.port}`);
    console.log(`  Network:     http://0.0.0.0:${config.port}`);
    console.log(`  Health:      http://localhost:${config.port}/api/v1/health`);
    console.log(`=======================================================`);
  });

  // Attempt database connection asynchronously
  connectDB().catch((err) => {
    console.warn(`[Database] Initial connection attempt: ${err.message}`);
  });

  process.on('SIGTERM', () => {
    server.close(() => {
      console.log('HTTP server closed');
    });
  });
};

startServer();
