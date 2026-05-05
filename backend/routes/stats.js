const express = require('express');
const { User, PGListing, Booking, Sequelize } = require('../models');
const { auth, checkRole } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/stats/admin
// @desc    Get platform-wide statistics
// @access  Private (Admin)
router.get('/admin', auth, checkRole(['admin']), async (req, res) => {
    try {
        const totalUsers = await User.count({ where: { role: 'user' } });
        const totalOwners = await User.count({ where: { role: 'owner' } });
        const totalListings = await PGListing.count();
        const verifiedListings = await PGListing.count({ where: { is_verified: true } });
        const totalBookings = await Booking.count();

        res.json({
            users: totalUsers,
            owners: totalOwners,
            listings: totalListings,
            verified: verifiedListings,
            bookings: totalBookings
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/stats/owner
// @desc    Get owner-specific analytics
// @access  Private (Owner)
router.get('/owner', auth, checkRole(['owner']), async (req, res) => {
    try {
        const myListings = await PGListing.findAll({
            where: { owner_id: req.user.id },
            attributes: ['id', 'price']
        });

        const listingIds = myListings.map(l => l.id);
        
        const confirmedBookings = await Booking.count({
            where: {
                listing_id: listingIds,
                status: 'confirmed'
            }
        });

        const pendingRequests = await Booking.count({
            where: {
                listing_id: listingIds,
                status: 'pending'
            }
        });

        // Calculate estimated revenue
        // Simple logic: Each confirmed booking adds that listing's price to revenue
        let totalRevenue = 0;
        const bookings = await Booking.findAll({
            where: { listing_id: listingIds, status: 'confirmed' },
            include: [{ model: PGListing, attributes: ['price'] }]
        });
        
        bookings.forEach(b => {
            totalRevenue += b.PGListing.price;
        });

        res.json({
            listingCount: myListings.length,
            confirmedBookings,
            pendingRequests,
            totalRevenue
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
