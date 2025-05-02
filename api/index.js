const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const leadRoutes = require('./routes/leadRoutes');

const app = express();
const PORT = 5000;

mongoose.connect('mongodb://localhost:27017/leadDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB database connected');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.use(cors());
app.use(express.json());
app.use('/api/leads', leadRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
