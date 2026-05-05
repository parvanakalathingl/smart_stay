const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const User = require('./User');

const PGListing = sequelize.define('PGListing', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    locality: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    room_type: {
        type: DataTypes.ENUM('single', 'double', 'triple'),
        allowNull: false
    },
    total_rooms: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    available_rooms: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    gender_pref: {
        type: DataTypes.ENUM('male', 'female', 'any'),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    images: {
        type: DataTypes.JSONB, // Array of image URLs
        defaultValue: []
    },
    amenities: {
        type: DataTypes.JSONB, // Array of amenity strings
        defaultValue: []
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

PGListing.belongsTo(User, { as: 'owner', foreignKey: 'owner_id' });
User.hasMany(PGListing, { foreignKey: 'owner_id' });

module.exports = PGListing;
