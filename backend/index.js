const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./db');
const { syncDB } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api', (req, res) => {
    res.json({ 
        message: 'Welcome to the Smart Stay API!',
        status: 'Server is running',
        database: 'PostgreSQL'
    });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/stats', require('./routes/stats'));
app.use('/uploads', express.static('uploads'));

// Start Server
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await connectDB();
    await syncDB();
});