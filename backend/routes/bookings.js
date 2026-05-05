const express = require('express');
const { Booking, PGListing, User } = require('../models');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/bookings
// @desc    Request a booking
// @access  Private (User)
router.post('/', auth, checkRole(['user']), async (req, res) => {
    try {
        const { listing_id, move_in_date, duration, message } = req.body;

        if (!listing_id || !move_in_date || !duration) {
            return res.status(400).json({ message: 'Listing ID, Move-in date and Duration are required' });
        }

        const listing = await PGListing.findByPk(listing_id);
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        if (listing.available_rooms <= 0) {
            return res.status(400).json({ message: 'No rooms available' });
        }

        const booking = await Booking.create({
            user_id: req.user.id,
            listing_id,
            move_in_date,
            duration,
            message,
            status: 'pending'
        });

        res.status(201).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/bookings/user
// @desc    Get current user's bookings
// @access  Private (User)
router.get('/user', auth, checkRole(['user']), async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { user_id: req.user.id },
            include: [{ model: PGListing, attributes: ['name', 'city', 'locality', 'price', 'images'] }]
        });
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/bookings/admin
// @desc    Get all bookings (Admin only)
// @access  Private (Admin)
router.get('/admin', auth, checkRole(['admin']), async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                { model: PGListing, attributes: ['name', 'city', 'locality'] },
                { model: User, attributes: ['name', 'email'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/bookings/owner
// @desc    Get booking requests for owner's listings
// @access  Private (Owner)
router.get('/owner', auth, checkRole(['owner']), async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                { 
                    model: PGListing, 
                    where: { owner_id: req.user.id },
                    attributes: ['name', 'locality', 'city', 'price', 'images']
                },
                {
                    model: User,
                    attributes: ['name', 'email', 'phone']
                }
            ]
        });
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PATCH /api/bookings/:id/status
// @desc    Update booking status
// @access  Private (Owner/User)
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByPk(req.params.id, {
            include: [PGListing]
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const isOwner = booking.PGListing.owner_id === req.user.id;
        const isUser = booking.user_id === req.user.id;

        if (!isOwner && !isUser) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Logic for room count update
        if (status === 'confirmed' && booking.status !== 'confirmed') {
            if (booking.PGListing.available_rooms > 0) {
                await booking.PGListing.decrement('available_rooms');
            } else {
                return res.status(400).json({ message: 'No rooms left to confirm' });
            }
        } else if (status === 'cancelled' && booking.status === 'confirmed') {
            await booking.PGListing.increment('available_rooms');
        }

        booking.status = status;
        await booking.save();

        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
