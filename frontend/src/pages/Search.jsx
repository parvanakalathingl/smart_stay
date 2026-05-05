import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import PGCard from '../components/PGCard';
import { MapPin, Filter, X, Search as SearchIcon, IndianRupee, Users, Sparkles, SlidersHorizontal, Loader2 } from 'lucide-react';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter states
    const [city, setCity] = useState(searchParams.get('city') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
    const [roomType, setRoomType] = useState(searchParams.get('room_type') || 'all');
    const [gender, setGender] = useState(searchParams.get('gender_pref') || 'any');
    const [amenities, setAmenities] = useState(searchParams.getAll('amenities') || []);
    const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

    useEffect(() => {
        // Sync state with URL (handles Reset, Back button, and Home search)
        setCity(searchParams.get('city') || '');
        setMinPrice(searchParams.get('minPrice') || '');
        setMaxPrice(searchParams.get('maxPrice') || '');
        setRoomType(searchParams.get('room_type') || 'all');
        setGender(searchParams.get('gender_pref') || 'any');
        setAmenities(searchParams.getAll('amenities') || []);
        setSort(searchParams.get('sort') || 'newest');

        fetchListings();
    }, [searchParams]);

    const fetchListings = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams(searchParams);
            const res = await axios.get(`http://localhost:5000/api/listings?${params.toString()}`);
            setListings(res.data);
        } catch (err) {
            console.error('Failed to fetch listings', err);
        } finally {
            setIsLoading(false);
        }
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (city.trim()) params.set('city', city.trim());
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (roomType !== 'all') params.set('room_type', roomType);
        if (gender !== 'any') params.set('gender_pref', gender);
        amenities.forEach(a => params.append('amenities', a));
        if (sort) params.set('sort', sort);
        
        setSearchParams(params);
        setIsFilterOpen(false);
    };

    const handleSortChange = (newSort) => {
        const params = new URLSearchParams(searchParams);
        params.set('sort', newSort);
        setSearchParams(params);
    };

    const handleAmenityChange = (amenity) => {
        if (amenities.includes(amenity)) {
            setAmenities(amenities.filter(a => a !== amenity));
        } else {
            setAmenities([...amenities, amenity]);
        }
    };

    const resetFilters = () => {
        setCity('');
        setMinPrice('');
        setMaxPrice('');
        setRoomType('all');
        setGender('any');
        setAmenities([]);
        setSort('newest');
        setSearchParams({});
    };

    return (
        <div className="min-h-screen bg-dark">
            {/* Header / Search Summary */}
            <div className="bg-slate-900/50 border-b border-slate-800 py-6">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-2xl font-black text-white mb-1.5">
                                {city ? `PGs in ${city}` : 'Available PGs'}
                            </h1>
                            <p className="text-slate-500 font-medium text-sm">
                                Showing <span className="text-primary font-bold">{listings.length}</span> verified properties
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <select 
                                    className="appearance-none bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:border-primary transition-all cursor-pointer"
                                    value={sort}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="priceLow">Price: Low to High</option>
                                    <option value="priceHigh">Price: High to Low</option>
                                </select>
                                <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                            </div>
                            <button 
                                onClick={() => setIsFilterOpen(true)}
                                className="md:hidden flex items-center space-x-2 btn btn-primary px-6 h-[46px]"
                            >
                                <Filter size={18} />
                                <span>Filter</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-6 py-12">
                <div className="flex gap-12">
                    
                    {/* Desktop Sidebar Sidebar */}
                    <aside className="hidden md:block w-72 shrink-0 space-y-8">
                        <FilterSection 
                            city={city} setCity={setCity}
                            minPrice={minPrice} setMinPrice={setMinPrice}
                            maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                            roomType={roomType} setRoomType={setRoomType}
                            gender={gender} setGender={setGender}
                            amenities={amenities} handleAmenityChange={handleAmenityChange}
                            applyFilters={applyFilters}
                            resetFilters={resetFilters}
                        />
                    </aside>

                    {/* Listings Grid */}
                    <div className="flex-1">
                        {isLoading ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {[1, 2, 4].map(i => <div key={i} className="h-96 bg-slate-800/50 rounded-3xl animate-pulse"></div>)}
                            </div>
                        ) : listings.length === 0 ? (
                            <div className="text-center py-16 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl">
                                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                                    <SearchIcon size={32} />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-1.5">No matching stays found</h2>
                                <p className="text-slate-500 text-sm mb-6">Try adjusting your filters or searching in a different city.</p>
                                <button onClick={resetFilters} className="btn btn-outline px-6 text-sm">Reset All Filters</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
                                {listings.map(listing => (
                                    <PGCard key={listing.id} listing={listing} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Mobile Filter Drawer */}
            <div className={`fixed inset-0 z-[60] md:hidden transition-transform duration-500 ${isFilterOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)}></div>
                <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] bg-dark border-t border-slate-800 rounded-t-3xl overflow-y-auto px-6 py-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black text-white">Filters</h2>
                        <button onClick={() => setIsFilterOpen(false)} className="p-2.5 bg-slate-800 rounded-full text-slate-400">
                            <X size={20} />
                        </button>
                    </div>
                    <FilterSection 
                        city={city} setCity={setCity}
                        minPrice={minPrice} setMinPrice={setMinPrice}
                        maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                        roomType={roomType} setRoomType={setRoomType}
                        gender={gender} setGender={setGender}
                        amenities={amenities} handleAmenityChange={handleAmenityChange}
                        applyFilters={applyFilters}
                        resetFilters={resetFilters}
                        isMobile={true}
                    />
                </div>
            </div>
        </div>
    );
};

// Reusable Filter Section
const FilterSection = ({ 
    city, setCity, 
    minPrice, setMinPrice, 
    maxPrice, setMaxPrice, 
    roomType, setRoomType, 
    gender, setGender, 
    amenities, handleAmenityChange,
    applyFilters, resetFilters,
    isMobile = false
}) => (
    <div className="space-y-8 pb-10">
        <div className="space-y-4">
            <label className="flex items-center text-sm font-bold text-slate-400 uppercase tracking-widest">
                <MapPin size={16} className="mr-2" /> City
            </label>
            <input 
                type="text" 
                placeholder="Search city..." 
                className="input-standard"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />
        </div>

        <div className="space-y-4">
            <label className="flex items-center text-sm font-bold text-slate-400 uppercase tracking-widest">
                <IndianRupee size={16} className="mr-2" /> Price Range
            </label>
            <div className="grid grid-cols-2 gap-3">
                <input 
                    type="number" 
                    placeholder="Min" 
                    className="input-standard text-sm"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                />
                <input 
                    type="number" 
                    placeholder="Max" 
                    className="input-standard text-sm"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
            </div>
        </div>

        <div className="space-y-4">
            <label className="flex items-center text-sm font-bold text-slate-400 uppercase tracking-widest">
                <Users size={16} className="mr-2" /> Room Type
            </label>
            <div className="flex flex-wrap gap-2">
                {['all', 'single', 'double', 'triple'].map(t => (
                    <button 
                        key={t}
                        onClick={() => setRoomType(t)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                            roomType === t ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                    >
                        {t}
                    </button>
                ))}
            </div>
        </div>

        <div className="space-y-4">
            <label className="flex items-center text-sm font-bold text-slate-400 uppercase tracking-widest">
                <SlidersHorizontal size={16} className="mr-2" /> Preferred For
            </label>
            <select 
                className="input-standard appearance-none"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
            >
                <option value="any">Any Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
        </div>

        <div className="space-y-4">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-widest block">Amenities</label>
            <div className="space-y-3">
                {['WiFi', 'Food Included', 'Laundry', 'AC', 'Security', 'Gym', 'Parking'].map(a => (
                    <label key={a} className="flex items-center group cursor-pointer">
                        <div className="relative flex items-center">
                            <input 
                                type="checkbox" 
                                className="peer appearance-none w-5 h-5 border border-slate-700 rounded-md checked:bg-primary checked:border-primary transition-all"
                                checked={amenities.includes(a)}
                                onChange={() => handleAmenityChange(a)}
                            />
                            <Sparkles className="absolute text-white scale-0 peer-checked:scale-100 transition-transform left-1" size={12} />
                        </div>
                        <span className="ml-3 text-sm text-slate-400 group-hover:text-white transition-colors">{a}</span>
                    </label>
                ))}
            </div>
        </div>

        <div className="pt-6 flex flex-col gap-3">
            <button onClick={applyFilters} className="btn btn-primary w-full py-4 text-sm tracking-wide">
                Apply Filters
            </button>
            <button onClick={resetFilters} className="text-slate-500 text-sm font-bold hover:text-white transition-colors py-2">
                Clear All
            </button>
        </div>
    </div>
);

export default Search;
