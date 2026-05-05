import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PGCard from '../components/PGCard';
import Recommendations from '../components/Recommendations';
import { useAuth } from '../context/AuthContext';
import { Search as SearchIcon, MapPin, Shield, Star, Rocket, ArrowRight, Zap } from 'lucide-react';

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [featuredListings, setFeaturedListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchFeatured();
    }, []);

    const fetchFeatured = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/listings');
            setFeaturedListings(res.data ? res.data.slice(0, 6) : []);
        } catch (err) {
            console.error('Failed to fetch featured listings', err);
            setFeaturedListings([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?city=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate('/search');
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full"></div>
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-widest mb-8 animate-pulse">
                            <Zap size={14} />
                            <span>Revolutionizing Student Living</span>
                        </div>
                        
                        <h1 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-6">
                            Find Your Perfect <br />
                            <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent italic">Smart Stay</span>
                        </h1>
                        
                        <p className="text-lg text-slate-400 mb-8 max-w-xl leading-relaxed">
                            AI-powered PG recommendations tailored to your lifestyle, budget, and location. Book verified stays with zero brokerage.
                        </p>
                        
                        <form onSubmit={handleSearch} className="group relative max-w-2xl bg-slate-900/50 backdrop-blur-3xl border border-slate-700/50 p-2 rounded-2xl flex flex-col sm:flex-row items-center gap-2 focus-within:border-primary transition-all shadow-2xl shadow-black/50">
                            <div className="flex-1 flex items-center px-6 w-full py-4 sm:py-0">
                                <MapPin className="text-primary mr-4 shrink-0" size={24} />
                                <input 
                                    type="text" 
                                    placeholder="Which city are you looking in?" 
                                    className="bg-transparent border-none outline-none text-white text-lg w-full placeholder:text-slate-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-base shadow-xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center space-x-2">
                                <SearchIcon size={18} />
                                <span>Find Rooms</span>
                            </button>
                        </form>

                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <span className="text-sm font-semibold text-slate-500">Popular:</span>
                            {['Mangalore', 'Bangalore', 'Kuntikan'].map(city => (
                                <button 
                                    key={city}
                                    onClick={() => navigate(`/search?city=${city}`)}
                                    className="px-4 py-1.5 bg-slate-800/50 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-full border border-slate-700/30 transition-colors"
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Recommendations Section */}
            {user && (
                <div className="container mx-auto px-6 mb-24">
                    <Recommendations />
                </div>
            )}

            {/* Features Section */}
            <section className="container mx-auto px-6 mb-32 grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="group p-6 bg-slate-900/40 border border-slate-800 rounded-3xl hover:border-primary/50 transition-all duration-500">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                        <Shield size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Verified Listings</h3>
                    <p className="text-slate-400 leading-relaxed">Every PG is manually verified by our team for safety, transparency, and hygiene.</p>
                </div>
                <div className="group p-8 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] hover:border-indigo-500/50 transition-all duration-500">
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-8 group-hover:scale-110 transition-transform">
                        <Rocket size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Smart Match</h3>
                    <p className="text-slate-400 leading-relaxed">Our content-based AI algorithm suggests the best rooms tailored to your preferences.</p>
                </div>
                <div className="group p-8 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] hover:border-emerald-500/50 transition-all duration-500">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-8 group-hover:scale-110 transition-transform">
                        <Star size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">No Brokerage</h3>
                    <p className="text-slate-400 leading-relaxed">Connect directly with owners and book your stay without any hidden broker fees.</p>
                </div>
            </section>

            {/* Featured Listings */}
            <section className="container mx-auto px-6 mb-32">
                <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-white mb-3 leading-tight">Latest Verified PGs</h2>
                        <p className="text-slate-500 text-base">Hand-picked accommodations recently added to our platform.</p>
                    </div>
                    <button 
                        className="group flex items-center space-x-2 text-primary font-bold hover:text-white transition-colors" 
                        onClick={() => navigate('/search')}
                    >
                        <span>View All Listings</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-96 w-full bg-slate-800/50 rounded-3xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredListings.map(listing => (
                            <PGCard key={listing.id} listing={listing} />
                        ))}
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-6 mb-24">
                <div className="relative overflow-hidden rounded-3xl bg-indigo-600 p-10 lg:p-14 shadow-2xl shadow-indigo-500/20">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[400px] h-[400px] bg-white/20 blur-[100px] rounded-full"></div>
                    
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
                        <div>
                            <h2 className="text-3xl lg:text-4xl font-black text-white mb-6 leading-[1.1]">Are you a <br />PG Owner?</h2>
                            <p className="text-lg text-indigo-100 mb-8 max-w-lg leading-relaxed">
                                List your property on Smart Stay and reach thousands of students and professionals. Zero commission, maximum reach.
                            </p>
                            <button 
                                className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20"
                                onClick={() => navigate('/register?role=owner')}
                            >
                                List Your Property Now
                            </button>
                        </div>
                        <div className="hidden lg:block relative h-full min-h-[400px]">
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full border border-white/20 flex items-center justify-center">
                                 <Zap className="text-white w-40 h-40 animate-bounce" />
                             </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
