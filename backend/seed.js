const { User, PGListing, db } = require('./models');
const bcrypt = require('bcryptjs');

const seed = async () => {
    try {
        console.log('--- Starting Seeding ---');
        
        // Clear existing data (optional, but safer for a clean demo)
        // await db.sync({ force: true }); 
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // 1. Create Users
        const admin = await User.create({
            name: 'Platform Admin',
            email: 'admin@smartstay.com',
            password: hashedPassword,
            role: 'admin',
            phone: '9876543210'
        });

        const customer = await User.create({
            name: 'John Doe',
            email: 'customer@gmail.com',
            password: hashedPassword,
            role: 'user',
            phone: '9988776655'
        });

        const owner1 = await User.create({ name: 'Rajesh Kumar', email: 'owner1@gmail.com', password: hashedPassword, role: 'owner', phone: '9000000001' });
        const owner2 = await User.create({ name: 'Sneha Rao', email: 'owner2@gmail.com', password: hashedPassword, role: 'owner', phone: '9000000002' });
        const owner3 = await User.create({ name: 'Kevin Dsouza', email: 'owner3@gmail.com', password: hashedPassword, role: 'owner', phone: '9000000003' });

        console.log('Users Created.');

        // 2. Create PG Listings
        const pgs = [
            {
                owner_id: owner1.id,
                name: 'Royal Palace PG',
                city: 'Mangalore',
                locality: 'Kuntikan',
                address: 'Near AJ Hospital, Kuntikan, Mangalore',
                price: 8500,
                room_type: 'double',
                total_rooms: 20,
                available_rooms: 5,
                gender_pref: 'male',
                description: 'Premium PG for students with 3 times food and high-speed WiFi.',
                amenities: ['WiFi', 'Food Included', 'Laundry', 'CCTV'],
                images: ['/uploads/seed-image-1776788407545-0.jpg', '/uploads/seed-image-1776788408532-1.jpg'],
                is_verified: true
            },
            {
                owner_id: owner1.id,
                name: 'Heritage Greens PG',
                city: 'Mangalore',
                locality: 'Bejai',
                address: 'Bejai Main Road, Mangalore',
                price: 7000,
                room_type: 'triple',
                total_rooms: 15,
                available_rooms: 2,
                gender_pref: 'any',
                description: 'Affordable stay with great connectivity and clean environment.',
                amenities: ['WiFi', 'Parking', 'Cleaning'],
                images: ['/uploads/grand-residency-1776788632470-0.jpg', '/uploads/grand-residency-1776788633177-1.jpg'],
                is_verified: true
            },
            {
                owner_id: owner2.id,
                name: 'Elite Womens Stay',
                city: 'Bangalore',
                locality: 'HSR Layout',
                address: 'Sector 2, HSR Layout, Bangalore',
                price: 12000,
                room_type: 'single',
                total_rooms: 10,
                available_rooms: 3,
                gender_pref: 'female',
                description: 'Luxury accommodation exclusively for working women. High security.',
                amenities: ['WiFi', 'AC', 'Gym', 'Security', 'Food Included'],
                images: ['/uploads/seed-image-1776788408953-2.jpg', '/uploads/seed-image-1776788409367-3.jpg'],
                is_verified: true
            },
            {
                owner_id: owner3.id,
                name: 'Cozy Corner PG',
                city: 'Mangalore',
                locality: 'Kuntikan',
                address: 'Derebail Konchady, Mangalore',
                price: 6500,
                room_type: 'double',
                total_rooms: 12,
                available_rooms: 8,
                gender_pref: 'male',
                description: 'Peaceful environment for serious students and professionals.',
                amenities: ['WiFi', 'Study Table', 'Laundry'],
                images: ['/uploads/grand-residency-1776788633960-2.jpg'],
                is_verified: true
            }
        ];

        for (const pg of pgs) {
            await PGListing.create(pg);
        }

        console.log('PG Listings Created.');
        console.log('--- Seeding Completed Successfully ---');
        process.exit();
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seed();
