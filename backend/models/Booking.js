const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./User');
const PGListing = require('./PGListing');

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    move_in_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER, // in months
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
        defaultValue: 'pending'
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true
});

Booking.belongsTo(User, { foreignKey: 'user_id' });
Booking.belongsTo(PGListing, { foreignKey: 'listing_id' });

User.hasMany(Booking, { foreignKey: 'user_id' });
PGListing.hasMany(Booking, { foreignKey: 'listing_id' });

module.exports = Booking;
