import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListingById } from '../services/listingService';
import { createBooking } from '../services/bookingService';
import Recommendations from '../components/Recommendations';
import ReviewSystem from '../components/ReviewSystem';
import { useAuth } from '../context/AuthContext';
import { MapPin, IndianRupee, Users, CheckCircle, Calendar, MessageSquare, Loader2, ArrowLeft, ShieldCheck, Shield, Phone, Mail, User } from 'lucide-react';

const PGDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [listing, setListing] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [moveInDate, setMoveInDate] = useState('');
    const [duration, setDuration] = useState(1);
    const [message, setMessage] = useState('');
    const [isBooking, setIsBooking] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        fetchListing();
        window.scrollTo(0, 0);
    }, [id]);

    const fetchListing = async () => {
        try {
            const data = await getListingById(id);
            setListing(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!user) return navigate('/login');
        if (user.role !== 'user') return alert('Only students/working professionals can book.');

        setIsBooking(true);
        try {
            await createBooking({ 
                listing_id: id, 
                move_in_date: moveInDate, 
                duration: parseInt(duration),
                message 
            });
            alert('Booking request sent successfully!');
            navigate('/bookings');
        } catch (err) {
            alert(err.response?.data?.message || 'Booking failed');
        } finally {
            setIsBooking(false);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={48} />
        </div>
    );
    
    if (!listing) return <div className="min-h-screen flex items-center justify-center text-white text-2xl font-bold">Listing not found</div>;

    return (
        <div className="min-h-screen bg-dark pb-20">
            {/* Top Navigation Bar */}
            <div className="bg-slate-900/50 border-b border-slate-800 py-3 mb-6">
                <div className="container mx-auto px-6">
                    <button onClick={() => navigate(-1)} className="flex items-center text-slate-400 hover:text-white transition-colors group">
                        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
                        <span className="font-bold">Back to Search</span>
                    </button>
                </div>
            </div>

            <main className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Gallery & Content */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Gallery Section */}
                        <section>
                            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-800 shadow-2xl mb-4 group ring-1 ring-white/5">
                                <img 
                                    src={listing.images[activeImage] ? `http://localhost:5000${listing.images[activeImage]}` : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80'} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    alt="Property Main"
                                />
                                <div className="absolute top-6 left-6 flex space-x-2">
                                    {listing.is_verified && (
                                        <div className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-500 text-white text-xs font-black uppercase rounded-full shadow-lg">
                                            <ShieldCheck size={16} />
                                            <span>Smart Verified</span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {listing.images.map((img, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                                            activeImage === idx ? 'border-primary ring-2 ring-primary/20 scale-95' : 'border-slate-800/50 hover:border-slate-600 hover:scale-105'
                                        }`}
                                    >
                                        <div className={`absolute inset-0 bg-primary/20 transition-opacity duration-300 ${activeImage === idx ? 'opacity-0' : 'opacity-0'}`}></div>
                                        <img src={`http://localhost:5000${img}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Title & Stats */}
                        <section className="bg-slate-900/30 p-6 rounded-2xl border border-slate-800">
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8">
                                <div>
                                    <h1 className="text-3xl lg:text-4xl font-black text-white mb-2">{listing.name}</h1>
                                    <p className="flex items-center text-slate-400 text-lg">
                                        <MapPin className="text-primary mr-2" size={20} />
                                        {listing.locality}, {listing.city}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                                        <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-0.5">Monthly Rent</div>
                                        <div className="text-xl font-black text-white flex items-center">
                                            <IndianRupee size={18} /> {listing.price}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-800 pt-6">
                                <div className="p-3.5 bg-slate-800/20 rounded-xl">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Room Type</label>
                                    <div className="flex items-center text-white font-bold"><Users size={16} className="mr-2 text-primary" /> {listing.room_type} Sharing</div>
                                </div>
                                <div className="p-3.5 bg-slate-800/20 rounded-xl">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Availability</label>
                                    <div className="flex items-center text-white font-bold text-sm"><CheckCircle size={15} className="mr-2 text-emerald-400" /> {listing.available_rooms} Rooms Left</div>
                                </div>
                                <div className="p-3.5 bg-slate-800/20 rounded-xl">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Prefer For</label>
                                    <div className="flex items-center text-white font-bold text-sm capitalize"><User size={15} className="mr-2 text-indigo-400" /> {listing.gender_pref} Only</div>
                                </div>
                            </div>
                        </section>

                        {/* Description & Amenities */}
                        <section className="space-y-10">
                            <div className="prose prose-invert max-w-none">
                                <h3 className="text-xl font-black text-white flex items-center mb-4">
                                    <MessageSquare size={20} className="mr-3 text-primary" /> About this Property
                                </h3>
                                <p className="text-slate-400 text-base leading-relaxed">{listing.description}</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-black text-white flex items-center mb-5">
                                    <Shield size={20} className="mr-3 text-emerald-400" /> Amenities Provided
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {listing.amenities && Array.isArray(listing.amenities) ? (
                                        listing.amenities.map((a, i) => (
                                            <div key={i} className="flex items-center p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 font-semibold group hover:bg-slate-800 transition-colors">
                                                <CheckCircle size={16} className="text-emerald-500 mr-2.5 group-hover:scale-110 transition-transform" />
                                                <span className="text-xs">{a}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full text-slate-500 font-bold italic">No amenities listed.</div>
                                    )}
                                </div>
                            </div>
                        </section>

                        <ReviewSystem listingId={id} />
                        
                        <Recommendations type="similar" listingId={id} />
                    </div>

                    {/* Right Column: Booking Sidebar */}
                    <div className="space-y-6">
                        <section className="sticky top-24">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-primary/10 blur-3xl rounded-full"></div>
                                
                                <h3 className="text-xl font-black text-white mb-1.5">Reserve Your Spot</h3>
                                <p className="text-slate-500 text-xs mb-6">Send a request to the owner. Response usually within 24 hours.</p>

                                <form onSubmit={handleBooking} className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Preferred Move-in Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={20} />
                                            <input 
                                                type="date" 
                                                required
                                                className="input-standard pl-12"
                                                value={moveInDate}
                                                onChange={(e) => setMoveInDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Duration (Months)</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={20} />
                                            <input 
                                                type="number" 
                                                min="1"
                                                required
                                                className="input-standard pl-12"
                                                value={duration}
                                                onChange={(e) => setDuration(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Optional Message</label>
                                        <textarea 
                                            placeholder="Introduce yourself to the owner..." 
                                            className="input-standard min-h-[120px] pt-3 resize-none"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                        ></textarea>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={isBooking}
                                        className="btn btn-primary w-full py-5 text-lg font-black tracking-wide shadow-2xl shadow-primary/30 active:scale-95 disabled:opacity-50 transition-all"
                                    >
                                        {isBooking ? <Loader2 className="animate-spin" /> : 'Request to Book'}
                                    </button>
                                </form>

                                <div className="mt-8 pt-8 border-t border-slate-800">
                                    <div className="flex items-center space-x-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-black text-white">
                                            {listing.owner?.name ? listing.owner.name.charAt(0) : '?'}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Property Owner</p>
                                            <p className="font-bold text-white">{listing.owner?.name || 'Unknown Owner'}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center text-slate-400 text-sm py-1">
                                            <Phone size={16} className="mr-3 text-slate-600" /> {listing.owner?.phone}
                                        </div>
                                        <div className="flex items-center text-slate-400 text-sm py-1">
                                            <Mail size={16} className="mr-3 text-slate-600" /> {listing.owner?.email}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 text-center">
                                <p className="text-[10px] font-bold text-emerald-400 leading-relaxed uppercase tracking-tighter">
                                    No Hidden Brokerage Fees. <br /> Pay Direct to Owner.
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PGDetail;
