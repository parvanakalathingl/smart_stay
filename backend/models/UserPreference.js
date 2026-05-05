const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./User');

const UserPreference = sequelize.define('UserPreference', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    preferred_city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    min_price: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    max_price: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    preferred_amenities: {
        type: DataTypes.JSON, // Array of preferred amenity strings
        defaultValue: []
    },
    room_type: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

UserPreference.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(UserPreference, { foreignKey: 'user_id' });

module.exports = UserPreference;
