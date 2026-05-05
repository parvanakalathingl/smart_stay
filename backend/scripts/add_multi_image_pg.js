const { User, PGListing } = require('../models');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function addMultiImagePG() {
    console.log('Adding multi-image property...');
    
    try {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        // High quality interior/exterior images
        const imageUrls = [
            'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80', // Living room
            'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80', // Bedroom
            'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80' // Bathroom/Modern
        ];

        const localImages = [];
        imageUrls.forEach((url, i) => {
            const filename = `grand-residency-${Date.now()}-${i}.jpg`;
            const filepath = path.join(uploadDir, filename);
            console.log(`Downloading image ${i+1}/3...`);
            try {
                execSync(`curl -L "${url}" -o "${filepath}"`);
                localImages.push(`/uploads/${filename}`);
            } catch (e) {
                console.error(`Failed to download image ${i}`);
            }
        });

        // Get Owner 1 (Rahul Sharma)
        const owner = await User.findOne({ where: { email: 'rahul@owners.com' } });
        if (!owner) {
            console.error('Owner Rahul not found. Run seed_owners.js first.');
            process.exit(1);
        }

        await PGListing.create({
            name: 'The Grand Residency',
            owner_id: owner.id,
            city: 'Mangalore',
            locality: 'Kuntikan',
            address: 'Opposite A.J. Hospital, Kuntikan',
            price: 11000,
            room_type: 'single',
            total_rooms: 8,
            available_rooms: 3,
            gender_pref: 'any',
            description: 'Experience luxury at The Grand Residency. We offer spacious single occupancy rooms with modern furniture, split AC, and premium bedding. Our facility is equipped with 24/7 security, high-speed fiber internet, and delicious homemade meals.',
            amenities: ['WiFi', 'AC', 'Food Included', 'Gym', 'Laundry', 'Parking'],
            images: localImages,
            is_verified: true
        });

        console.log('Successfully added The Grand Residency with 3 images!');
        process.exit(0);
    } catch (error) {
        console.error('Failed to add property:', error);
        process.exit(1);
    }
}

addMultiImagePG();
