const { UserPreference } = require('../models');

const trackPreferences = async (req, res, next) => {
    // Only track for logged-in 'user' role
    if (req.user && req.user.role === 'user') {
        const { city, minPrice, maxPrice, room_type, amenities } = req.query;

        // Skip if no relevant search criteria
        if (!city && !minPrice && !maxPrice && !room_type && !amenities) {
            return next();
        }

        try {
            let pref = await UserPreference.findOne({ where: { user_id: req.user.id } });

            const updateData = {};
            if (city) updateData.preferred_city = city;
            if (minPrice) updateData.min_price = parseInt(minPrice);
            if (maxPrice) updateData.max_price = parseInt(maxPrice);
            if (room_type && room_type !== 'all') updateData.room_type = room_type;
            
            if (amenities) {
                const amenArr = Array.isArray(amenities) ? amenities : [amenities];
                // Simple logic: merge new amenities with existing ones (unique)
                const existing = pref?.preferred_amenities || [];
                updateData.preferred_amenities = [...new Set([...existing, ...amenArr])].slice(0, 10);
            }

            if (pref) {
                await pref.update(updateData);
            } else {
                await UserPreference.create({
                    user_id: req.user.id,
                    ...updateData
                });
            }
        } catch (error) {
            console.error('Preference tracking failed:', error);
        }
    }
    next();
};

module.exports = trackPreferences;
