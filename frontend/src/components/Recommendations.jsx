import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PGCard from './PGCard';
import { Sparkles, Loader2 } from 'lucide-react';

const Recommendations = ({ type = 'personalized', listingId = null }) => {
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchRecommendations();
    }, [type, listingId]);

    const fetchRecommendations = async () => {
        try {
            const url = type === 'similar' 
                ? `http://localhost:5000/api/recommendations/similar/${listingId}`
                : 'http://localhost:5000/api/recommendations';
            
            const res = await axios.get(url);
            setListings(res.data);
        } catch (err) {
            console.error('Failed to fetch recommendations', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-primary" size={32} />
        </div>
    );
    
    if (listings.length === 0) return null;

    return (
        <section className="py-12">
            <div className="flex items-center space-x-3 mb-10">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Sparkles size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white leading-tight">
                        {type === 'similar' ? 'Similar Stays for You' : 'Hand-picked for You'}
                    </h2>
                    <p className="text-slate-500 text-sm">Personalized based on your preferences</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {listings.map(listing => (
                    <PGCard key={listing.id} listing={listing} />
                ))}
            </div>
        </section>
    );
};

export default Recommendations;
