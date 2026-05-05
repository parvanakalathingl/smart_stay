import React, { useState, useEffect } from 'react';
import { getUserBookings } from '../services/bookingService';
import { Clock, CheckCircle, XCircle, MapPin, Calendar, MessageSquare, Loader2, IndianRupee, Home } from 'lucide-react';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const data = await getUserBookings();
            setBookings(data);
        } catch (err) {
            console.error('Failed to fetch bookings', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>;

    return (
        <div className="min-h-screen bg-dark py-10">
            <div className="container mx-auto px-6">
                <header className="mb-10">
                    <div className="inline-flex items-center space-x-2 text-primary font-bold uppercase tracking-tighter mb-3">
                        <Calendar size={18} />
                        <span>Resident History</span>
                    </div>
                    <h1 className="text-3xl font-black text-white">My Stays</h1>
                    <p className="text-slate-500 mt-1.5 font-medium text-sm">Track your booking requests and stay history.</p>
                </header>

                {bookings.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600">
                            <Home size={32} />
                        </div>
                        <h2 className="text-xl font-black text-white mb-2 italic">No Active Stays Found</h2>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto text-sm">Start your journey today! Browse through our verified PG listings to find your match.</p>
                        <a href="/search" className="btn btn-primary px-8 py-3 shadow-2xl shadow-primary/20 text-sm">Explore PGs</a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map(booking => (
                            <div key={booking.id} className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 group hover:border-slate-700 transition-all duration-300 shadow-2xl">
                                <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] -translate-y-1/2 translate-x-1/2 ${
                                    booking.status === 'confirmed' ? 'bg-emerald-500/20' : 
                                    booking.status === 'pending' ? 'bg-amber-500/20' : 'bg-rose-500/20'
                                }`}></div>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
                                    <div className="lg:col-span-1">
                                        <div className="aspect-video lg:aspect-square rounded-2xl overflow-hidden mb-4 border border-slate-800">
                                            <img src={`http://localhost:5000${booking.PGListing.images[0]}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="PG" />
                                        </div>
                                        <div className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl border font-black uppercase text-[10px] tracking-widest ${
                                            booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                            booking.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                        }`}>
                                            {booking.status === 'confirmed' ? <CheckCircle size={14} /> : 
                                             booking.status === 'pending' ? <Clock size={14} /> : <XCircle size={14} />}
                                            <span>{booking.status}</span>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-2 space-y-4">
                                        <div>
                                            <h3 className="text-2xl font-black text-white group-hover:text-primary transition-colors">{booking.PGListing.name}</h3>
                                            <p className="flex items-center text-slate-500 text-base mt-1 font-medium">
                                                <MapPin className="text-slate-600 mr-2" size={16} /> {booking.PGListing.locality}, {booking.PGListing.city}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                                                <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Move-in Date</label>
                                                <div className="flex items-center text-white font-bold text-base">
                                                    <Calendar size={16} className="text-primary mr-2" /> {new Date(booking.move_in_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </div>
                                            <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                                                <label className="block text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Monthly Rent</label>
                                                <div className="flex items-center text-white font-bold text-base">
                                                    <IndianRupee size={16} className="text-primary mr-2" /> {booking.PGListing.price}
                                                </div>
                                            </div>
                                        </div>

                                        {booking.message && (
                                            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                                <div className="flex items-start text-slate-400 italic leading-relaxed text-xs">
                                                    <MessageSquare size={14} className="text-slate-600 mr-2 mt-0.5 shrink-0" />
                                                    "{booking.message}"
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="lg:col-span-1 flex flex-col justify-end lg:border-l lg:border-slate-800 lg:pl-8 pb-1">
                                        <div className="space-y-3">
                                            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest text-center lg:text-left">Need Assistance?</label>
                                            <button className="btn btn-outline w-full py-3 text-xs font-bold opacity-50 cursor-not-allowed">Contact Support</button>
                                            <p className="text-[9px] text-slate-600 text-center lg:text-left leading-relaxed">
                                                Reference ID: <span className="font-mono">#STAY{String(booking.id).padStart(5, '0')}</span><br />
                                                Requested: {new Date(booking.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
