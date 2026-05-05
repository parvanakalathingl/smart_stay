const { User, PGListing } = require('../models');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function seedMorePGs() {
    console.log('--- Starting Additional PG Seeding ---');
    
    try {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        // Diverse set of high quality Unsplash images for different property types
        const imageBatches = [
            {
                name: 'Skyline Premium PG',
                urls: [
                    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80'
                ]
            },
            {
                name: 'The Heritage Stay',
                urls: [
                    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80'
                ]
            },
            {
                name: 'Urban Co-Living',
                urls: [
                    'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
                ]
            }
        ];

        // Get an existing owner
        let owner = await User.findOne({ where: { email: 'rahul@owners.com' } });
        if (!owner) {
            // Fallback to any owner if rahul doesn't exist
            owner = await User.findOne({ where: { role: 'owner' } });
        }

        if (!owner) {
            console.error('No owner found in database. Please run seed_owners.js first.');
            process.exit(1);
        }

        console.log(`Adding properties for owner: ${owner.name} (${owner.email})`);

        for (const batch of imageBatches) {
            console.log(`Processing ${batch.name}...`);
            const localImages = [];
            
            for (let i = 0; i < batch.urls.length; i++) {
                const filename = `${batch.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${i}.jpg`;
                const filepath = path.join(uploadDir, filename);
                
                try {
                    console.log(`  Downloading image ${i+1}/${batch.urls.length}...`);
                    execSync(`curl -L "${batch.urls[i]}" -o "${filepath}"`);
                    localImages.push(`/uploads/${filename}`);
                } catch (e) {
                    console.error(`  Failed to download image: ${e.message}`);
                }
            }

            // Create the listing
            const data = {
                owner_id: owner.id,
                name: batch.name,
                city: 'Mangalore',
                locality: batch.name === 'Skyline Premium PG' ? 'Kadri' : (batch.name === 'The Heritage Stay' ? 'Bejai' : 'Kottara'),
                address: `${batch.name} St, Near Main Circle`,
                price: batch.name === 'Skyline Premium PG' ? 15000 : (batch.name === 'The Heritage Stay' ? 9500 : 7500),
                room_type: batch.name === 'Skyline Premium PG' ? 'single' : 'double',
                total_rooms: 10,
                available_rooms: 4,
                gender_pref: 'any',
                description: `Welcome to ${batch.name}. We provide high-quality accommodation with all modern amenities including high-speed internet, regular housekeeping, and 24/7 security. Perfect for professionals and students seeking a comfortable lifestyle.`,
                amenities: ['WiFi', 'AC', 'Food Included', 'Laundry', 'Parking', 'CCTV'],
                images: localImages,
                is_verified: true
            };

            await PGListing.create(data);
            console.log(`Successfully added ${batch.name}`);
        }

        console.log('--- Seeding Completed Successfully ---');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seedMorePGs();
