const { PGListing, User } = require('../models');
const { Op } = require('sequelize');

async function test() {
    console.log('Testing price filter query...');
    
    // Simulating inputs
    const minPrice = "8000";
    const maxPrice = "12000";

    let query = {
        is_verified: true
    };

    if (minPrice !== undefined && minPrice !== '' || maxPrice !== undefined && maxPrice !== '') {
        query.price = {};
        if (minPrice !== undefined && minPrice !== '') {
            const parsedMin = parseInt(minPrice);
            if (!isNaN(parsedMin)) query.price[Op.gte] = parsedMin;
        }
        if (maxPrice !== undefined && maxPrice !== '') {
            const parsedMax = parseInt(maxPrice);
            if (!isNaN(parsedMax)) query.price[Op.lte] = parsedMax;
        }
        if (Object.keys(query.price).length === 0) delete query.price;
    }

    console.log('Final Query Object:', JSON.stringify(query, null, 2));
    
    try {
        const listings = await PGListing.findAll({
            where: query,
            attributes: ['id', 'name', 'price']
        });
        console.log('Rows found:', listings.length);
        listings.forEach(l => console.log(`- ${l.name}: Rs ${l.price}`));
        process.exit(0);
    } catch (err) {
        console.error('Query failed:', err);
        process.exit(1);
    }
}

test();
