const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./User');
const PGListing = require('./PGListing');

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true
});

Review.belongsTo(User, { foreignKey: 'user_id' });
Review.belongsTo(PGListing, { foreignKey: 'listing_id' });

User.hasMany(Review, { foreignKey: 'user_id' });
PGListing.hasMany(Review, { foreignKey: 'listing_id' });

module.exports = Review;
