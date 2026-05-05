const express = require('express');
const { PGListing, UserPreference, User } = require('../models');
const { auth } = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

// Scoring Function
const scoreListing = (listing, prefs) => {
    let score = 0;

    // 1. City Match (+10)
    if (prefs.preferred_city && listing.city.toLowerCase() === prefs.preferred_city.toLowerCase()) {
        score += 10;
    }

    // 2. Room Type Match (+5)
    if (prefs.room_type && listing.room_type === prefs.room_type) {
        score += 5;
    }

    // 3. Price Fit (+5)
    if (prefs.max_price && listing.price <= prefs.max_price) {
        score += 5;
    } else if (prefs.max_price && listing.price <= prefs.max_price * 1.2) {
        score += 2; // Close enough
    }

    // 4. Amenity Overlap (+2 per amenity)
    if (prefs.preferred_amenities && Array.isArray(prefs.preferred_amenities)) {
        prefs.preferred_amenities.forEach(a => {
            if (listing.amenities && listing.amenities.includes(a)) {
                score += 2;
            }
        });
    }

    return score;
};

// @route   GET /api/recommendations
// @desc    Get personalized recommendations for user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const prefs = await UserPreference.findOne({ where: { user_id: req.user.id } });
        
        // If no preferences yet, return latest verified listings
        if (!prefs) {
            const latest = await PGListing.findAll({
                where: { is_verified: true },
                limit: 6,
                order: [['createdAt', 'DESC']]
            });
            return res.json(latest);
        }

        // Get all verified listings
        const allListings = await PGListing.findAll({
            where: { is_verified: true },
            include: [{ model: User, as: 'owner', attributes: ['name'] }]
        });

        // Score and sort
        const scored = allListings.map(listing => ({
            ...listing.toJSON(),
            score: scoreListing(listing, prefs)
        })).sort((a, b) => b.score - a.score);

        res.json(scored.slice(0, 6));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/recommendations/similar/:id
// @desc    Get similar PGs based on a listing
// @access  Public
router.get('/similar/:id', async (req, res) => {
    try {
        const source = await PGListing.findByPk(req.params.id);
        if (!source) return res.status(404).json({ message: 'Listing not found' });

        const similar = await PGListing.findAll({
            where: {
                id: { [Op.ne]: source.id },
                is_verified: true,
                [Op.or]: [
                    { city: source.city },
                    { room_type: source.room_type }
                ]
            },
            limit: 4
        });

        res.json(similar);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
