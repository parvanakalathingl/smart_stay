const express = require('express');
const { PGListing, User } = require('../models');
const { auth, checkRole, optionalAuth } = require('../middleware/auth');
const trackPreferences = require('../middleware/trackPreferences');
const upload = require('../middleware/upload');
const { Op } = require('sequelize');
const router = express.Router();

// @route   POST /api/listings
// @desc    Create a new PG listing
// @access  Private (Owner/Admin)
router.post('/', auth, checkRole(['owner', 'admin']), upload.array('images', 5), async (req, res) => {
    try {
        const { name, city, locality, address, price, room_type, total_rooms, available_rooms, gender_pref, description, amenities } = req.body;
        
        const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
        const parsedAmenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;

        const listing = await PGListing.create({
            owner_id: req.user.id,
            name,
            city,
            locality,
            address,
            price,
            room_type,
            total_rooms,
            available_rooms,
            gender_pref,
            description,
            amenities: parsedAmenities || [],
            images,
            is_verified: false // Admin must verify
        });

        res.status(201).json(listing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /api/listings
// @desc    Get all verified listings with filters
// @access  Public (Optional Auth for preference tracking)
router.get('/', optionalAuth, trackPreferences, async (req, res) => {
    try {
        const { city, minPrice, maxPrice, room_type, gender_pref, amenities, sort } = req.query;
        
        let query = {
            is_verified: true
        };

        if (city) {
            query.city = { [Op.iLike]: `%${city.trim()}%` };
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice && !isNaN(Number(minPrice))) {
                query.price[Op.gte] = Number(minPrice);
            }
            if (maxPrice && !isNaN(Number(maxPrice))) {
                query.price[Op.lte] = Number(maxPrice);
            }
            // If No valid numbers were provided, remove the price key
            if (Object.getOwnPropertySymbols(query.price).length === 0) {
                delete query.price;
            }
        }

        if (room_type && room_type !== 'all') {
            query.room_type = room_type;
        }

        if (gender_pref && gender_pref !== 'any') {
            query.gender_pref = gender_pref;
        }

        if (amenities) {
            const amenArr = Array.isArray(amenities) ? amenities : [amenities];
            query.amenities = { [Op.contains]: amenArr };
        }

        let order = [['createdAt', 'DESC']];
        if (sort === 'priceLow') order = [['price', 'ASC']];
        if (sort === 'priceHigh') order = [['price', 'DESC']];

        const listings = await PGListing.findAll({
            where: query,
            order: order,
            include: [{ model: User, as: 'owner', attributes: ['name', 'phone'] }]
        });
        res.json(listings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/listings/owner
// @desc    Get all listings for current owner
// @access  Private (Owner)
router.get('/owner', auth, checkRole(['owner']), async (req, res) => {
    try {
        const listings = await PGListing.findAll({
            where: { owner_id: req.user.id }
        });
        res.json(listings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/listings/admin/pending
// @desc    Get all pending listings for verification
// @access  Private (Admin)
router.get('/admin/pending', auth, checkRole(['admin']), async (req, res) => {
    try {
        const listings = await PGListing.findAll({
            where: { is_verified: false },
            include: [{ model: User, as: 'owner', attributes: ['name', 'email'] }]
        });
        res.json(listings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PATCH /api/listings/:id/verify
// @desc    Verify or reject a listing
// @access  Private (Admin)
router.patch('/:id/verify', auth, checkRole(['admin']), async (req, res) => {
    try {
        const { status } = req.body; // status: true or false
        const listing = await PGListing.findByPk(req.params.id);
        
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        listing.is_verified = status;
        await listing.save();

        res.json({ message: `Listing ${status ? 'verified' : 'unverified'} successfully`, listing });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/listings/:id
// @desc    Get single listing details
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const listing = await PGListing.findByPk(req.params.id, {
            include: [{ model: User, as: 'owner', attributes: ['name', 'phone', 'email'] }]
        });

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        res.json(listing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/listings/:id
// @desc    Delete a listing
// @access  Private (Owner/Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const listing = await PGListing.findByPk(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Check ownership or admin role
        if (listing.owner_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await listing.destroy();
        res.json({ message: 'Listing removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
