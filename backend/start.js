try {
  require('./src/server.js');
} catch (err) {
  console.error('Error starting server:', err);
  console.error(err.stack);
}