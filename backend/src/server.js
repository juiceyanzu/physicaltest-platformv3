require('dotenv').config();
const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const batchRoutes = require('./routes/batchRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const projectRoutes = require('./routes/projectRoutes');
const { initDatabase } = require('./migrations/init');
const { seedData } = require('./migrations/run');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

app.use('/api/users', userRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/projects', projectRoutes);

initDatabase()
  .then(() => seedData())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
