const { sequelize } = require('../db');
const User = require('./User');
const PGListing = require('./PGListing');
const Booking = require('./Booking');
const Review = require('./Review');
const UserPreference = require('./UserPreference');

// Define Associations here to avoid circular dependencies if any
// (Already defined in files, but let's centralize them for clarity)

const syncDB = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully.');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
};

module.exports = {
    User,
    PGListing,
    Booking,
    Review,
    UserPreference,
    syncDB
};
