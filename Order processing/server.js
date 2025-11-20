// Add your functions for database connection and configuring middleware, defining API endpoints, and starting the server.

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Try to load the `config` module (npm package). If it's not installed or
// doesn't provide the expected keys, fall back to the local JSON file
// at ./config/picker.json so the service still runs in this stub repo.
let config;
try {
  // If the `config` package exists this will load it.
  // Note: require may throw if the package isn't installed.
  config = require('config');
} catch (err) {
  // Fallback to local picker.json inside this folder's config directory.
  // Use an absolute/relative path to avoid module resolution issues.
  try {
    config = require('./config/picker.json');
    console.log('Using fallback ./config/picker.json for configuration.');
  } catch (err2) {
    console.warn('Could not load config package or ./config/picker.json. Using defaults.');
    config = {};
  }
}

const app = express();

// Defensive defaults
const PORT = (config && config.port) ? config.port : 5001;
const MONGODB_URI_PICKER = (config && config.mongoDBuri) ? config.mongoDBuri : null;

app.use(cors());
app.use(express.json());

// Try to connect to MongoDB if a URI is provided. Log result but do not
// prevent the server from starting — this keeps the stub usable even when
// MongoDB isn't running during local testing.
if (MONGODB_URI_PICKER) {
  mongoose.connect(MONGODB_URI_PICKER, {
    // these options are safe for modern mongoose versions
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to picker MongoDB');
  }).catch(err => {
    console.error('Picker MongoDB connection error:', err.message || err);
  });
} else {
  console.warn('No MongoDB URI provided for picker service. Skipping DB connection.');
}

app.listen(PORT, () => {
  console.log(`Picker service listening on port ${PORT}`);
});