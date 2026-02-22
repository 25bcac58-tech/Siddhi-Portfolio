const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ⚠️ SIDDHI'S DATABASE CONNECTION
const dbURI = "mongodb+srv://anirudh:anirudh_password123@cluster0.fn5vpjx.mongodb.net/siddhi-logs?retryWrites=true&w=majority";

mongoose.connect(dbURI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.log('Database Connection Error:', err));

// Schema and Model
const logSchema = new mongoose.Schema({
  codename: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

const Log = mongoose.model('Log', logSchema);

// API Routes
app.post('/api/logs', async (req, res) => {
  try {
    const newLog = new Log(req.body);
    await newLog.save();
    res.status(201).json(newLog);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save transmission' });
  }
});

app.get('/api/logs', async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }).limit(10);
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve logs' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});