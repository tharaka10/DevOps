require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const companyRoutes = require('./routes/company.routes');
const deliveryRoutes = require('./routes/delivery.routes');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 4000;
const DB_URI = process.env.MONGO_URI;

if (!DB_URI) {
  throw new Error('MONGO_URI has not set in .env file');
}

app.use(express.json());

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/delivery', deliveryRoutes);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
