const express = require('express');
const { Review, User, Booking } = require('../models');
const { auth } = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/reviews
// @desc    Add a review (Only for users with confirmed/completed bookings)
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { listing_id, rating, comment } = req.body;

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Check if user has a confirmed or completed booking for this listing
        const hasStayed = await Booking.findOne({
            where: {
                user_id: req.user.id,
                listing_id: listing_id,
                status: ['confirmed', 'completed']
            }
        });

        if (!hasStayed) {
            return res.status(403).json({ 
                message: 'You can only review PGs where you have a confirmed or completed stay.' 
            });
        }

        const review = await Review.create({
            user_id: req.user.id,
            listing_id,
            rating,
            comment
        });

        res.status(201).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/reviews/listing/:id
// @desc    Get reviews for a listing
// @access  Public
router.get('/listing/:id', async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { listing_id: req.params.id },
            include: [{ model: User, attributes: ['name'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Check if user can review a specific listing
router.get('/can-review/:listingId', auth, async (req, res) => {
    try {
        const booking = await Booking.findOne({
            where: {
                user_id: req.user.id,
                listing_id: req.params.listingId,
                status: ['confirmed', 'completed']
            }
        });
        res.json({ canReview: !!booking });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
