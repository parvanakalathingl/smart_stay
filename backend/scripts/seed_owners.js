const { User, PGListing } = require('../models');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function seed() {
    console.log('Starting seed process...');
    
    try {
        // 1. Download images
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        const imageUrls = [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80'
        ];

        const localImages = [];
        imageUrls.forEach((url, i) => {
            const filename = `seed-image-${Date.now()}-${i}.jpg`;
            const filepath = path.join(uploadDir, filename);
            console.log(`Downloading image ${i+1}/${imageUrls.length}...`);
            try {
                // Using curl to download images as it is available on most systems
                execSync(`curl -L "${url}" -o "${filepath}"`);
                localImages.push(`/uploads/${filename}`);
            } catch (e) {
                console.error(`Failed to download image ${i}: ${e.message}`);
                // Fallback to a placeholder if curl fails
                localImages.push('/uploads/placeholder.jpg');
            }
        });

        // 2. Create Owners
        console.log('Creating owner accounts...');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);

        const owner1 = await User.create({
            name: 'Rahul Sharma',
            email: 'rahul@owners.com',
            password: passwordHash,
            role: 'owner',
            phone: '9876543210'
        });

        const owner2 = await User.create({
            name: 'Priya Hegde',
            email: 'priya@owners.com',
            password: passwordHash,
            role: 'owner',
            phone: '9123456789'
        });

        // 3. Create Listings
        console.log('Creating PG listings...');
        await PGListing.bulkCreate([
            {
                name: 'Royal Elite PG',
                owner_id: owner1.id,
                city: 'Mangalore',
                locality: 'Bejai',
                address: 'Main Road, Near KSRTC, Bejai',
                price: 8500,
                room_type: 'single',
                total_rooms: 15,
                available_rooms: 4,
                gender_pref: 'male',
                description: 'Premium single rooms with high-speed WiFi and laundry service. Located centrally with easy access to transport.',
                amenities: ['WiFi', 'Laundry', 'Parking', 'CCTV'],
                images: [localImages[0] || localImages[0]],
                is_verified: true
            },
            {
                name: 'Serene Living PG',
                owner_id: owner1.id,
                city: 'Mangalore',
                locality: 'Kuntikan',
                address: 'Anil Towers, Kuntikan Junction',
                price: 6000,
                room_type: 'double',
                total_rooms: 20,
                available_rooms: 12,
                gender_pref: 'any',
                description: 'Affordable double sharing rooms for students and working professionals. Quiet atmosphere and clean environment.',
                amenities: ['WiFi', 'Food Included', 'Security'],
                images: [localImages[1] || localImages[0]],
                is_verified: true
            },
            {
                name: 'Modern Stay PG',
                owner_id: owner2.id,
                city: 'Bangalore',
                locality: 'Koramangala',
                address: '7th Block, Koramangala',
                price: 12000,
                room_type: 'single',
                total_rooms: 10,
                available_rooms: 2,
                gender_pref: 'female',
                description: 'Luxury stay in the heart of the city with gym and cleaning service. Top-notch security for students.',
                amenities: ['WiFi', 'Gym', 'Cleaning', 'AC'],
                images: [localImages[2] || localImages[0]],
                is_verified: true
            },
            {
                name: 'Economy Stay',
                owner_id: owner2.id,
                city: 'Mangalore',
                locality: 'Hampankatta',
                address: 'City Center Backside, Hampankatta',
                price: 4500,
                room_type: 'triple',
                total_rooms: 30,
                available_rooms: 15,
                gender_pref: 'male',
                description: 'Budget friendly rooms with basic amenities. Excellent location for college students.',
                amenities: ['WiFi', 'Water Purifier'],
                images: [localImages[3] || localImages[0]],
                is_verified: false // One pending for admin verification
            },
            {
                name: 'The Orchid PG',
                owner_id: owner2.id,
                city: 'Mangalore',
                locality: 'Derebail',
                address: 'Green Avenue, Derebail',
                price: 7500,
                room_type: 'double',
                total_rooms: 12,
                available_rooms: 5,
                gender_pref: 'female',
                description: 'Cozy female-only PG with homemade food and 24/7 security.',
                amenities: ['WiFi', 'Food Included', 'Security', 'Laundry'],
                images: [localImages[1] || localImages[0]],
                is_verified: true
            }
        ]);

        console.log('Seed successful! Added 2 Owners and 5 PG Listings.');
        process.exit(0);
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
}

seed();
