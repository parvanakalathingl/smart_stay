import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, IndianRupee, CheckCircle, Users, ArrowRight } from 'lucide-react';

const PGCard = ({ listing }) => {
    return (
        <div className="group relative bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
            {/* Image Section */}
            <div className="relative h-64 overflow-hidden">
                <img 
                    src={listing.images[0] ? `http://localhost:5000${listing.images[0]}` : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80'} 
                    alt={listing.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {listing.is_verified && (
                        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase rounded-full shadow-lg">
                            <CheckCircle size={12} />
                            <span>Verified</span>
                        </div>
                    )}
                    <div className="flex items-center space-x-1 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold rounded-full border border-white/10">
                        <Users size={12} />
                        <span>{listing.room_type} Sharing</span>
                    </div>
                </div>

                <div className="absolute top-4 right-4 px-4 py-2 bg-primary text-white text-sm font-bold rounded-2xl shadow-xl shadow-primary/20">
                    ₹{listing.price} <span className="text-[10px] font-medium opacity-80">/mo</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors truncate pr-2">{listing.name}</h3>
                    <span className="shrink-0 flex items-center text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-lg">
                        {listing.available_rooms} Left
                    </span>
                </div>
                
                <p className="flex items-center text-slate-400 text-sm mb-6">
                    <MapPin className="mr-1.5 text-slate-500" size={16} /> 
                    {listing.locality}, {listing.city}
                </p>

                {/* Amenities Preview */}
                <div className="flex flex-wrap gap-2 mb-8 h-8 overflow-hidden pointer-events-none">
                    {listing.amenities?.slice(0, 3).map((a, i) => (
                        <span key={i} className="text-[10px] font-medium bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700/50">
                            {a}
                        </span>
                    ))}
                    {listing.amenities?.length > 3 && (
                        <span className="text-[10px] font-medium text-slate-500 px-1 py-1 italic">
                            +{listing.amenities.length - 3} more
                        </span>
                    )}
                </div>

                <Link 
                    to={`/listings/${listing.id}`} 
                    className="flex items-center justify-center space-x-2 w-full py-3.5 bg-white/5 hover:bg-primary text-white font-bold rounded-2xl border border-white/10 hover:border-primary transition-all duration-300 group/btn"
                >
                    <span>View Details</span>
                    <ArrowRight size={18} className="translate-x-0 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
};

export default PGCard;
