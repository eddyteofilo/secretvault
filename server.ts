import { startServer } from './src/app';

const PORT = 3000;

startServer().then(app => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('FATAL: Failed to start server:', err);
  process.exit(1);
});
