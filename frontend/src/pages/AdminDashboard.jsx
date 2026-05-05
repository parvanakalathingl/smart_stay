import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getPendingListings, verifyListing } from '../services/listingService';
import { getAllBookings } from '../services/bookingService';
import { getAdminStats } from '../services/statsService';
import { CheckCircle, XCircle, User, Mail, MapPin, IndianRupee, Loader2, Shield, Users, Building, CalendarCheck, Clock, ArrowRight } from 'lucide-react';

const AdminDashboard = () => {
    const [listings, setListings] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'bookings'

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [statsData, listingsData, bookingsData] = await Promise.all([
                getAdminStats(),
                activeTab === 'listings' ? getPendingListings() : Promise.resolve([]),
                activeTab === 'bookings' ? getAllBookings() : Promise.resolve([])
            ]);
            
            setStats(statsData);
            if (activeTab === 'listings') setListings(listingsData);
            if (activeTab === 'bookings') setBookings(bookingsData);
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (id, status) => {
        setProcessingId(id);
        try {
            await verifyListing(id, status);
            setListings(listings.filter(l => l.id !== id));
            // Refresh stats
            const statsData = await getAdminStats();
            setStats(statsData);
        } catch (err) {
            alert('Verification action failed');
        } finally {
            setProcessingId(null);
        }
    };

    if (isLoading && !stats) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>;

    return (
        <div className="min-h-screen bg-dark py-10">
            <div className="container mx-auto px-6">
                <header className="mb-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <div className="inline-flex items-center space-x-2 text-primary font-bold uppercase tracking-tighter mb-3">
                                <Shield size={18} />
                                <span>Command Center</span>
                            </div>
                            <h1 className="text-3xl font-black text-white px-0.5">System Overview</h1>
                            <p className="text-slate-500 mt-1.5 font-medium text-sm px-0.5">Global platform analytics and management portal.</p>
                        </div>
                        
                        {/* Tab Switcher */}
                        <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-800">
                            <button 
                                onClick={() => setActiveTab('listings')}
                                className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'listings' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Verification
                            </button>
                            <button 
                                onClick={() => setActiveTab('bookings')}
                                className={`px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'bookings' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Total Bookings
                            </button>
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                        <StatCard icon={<Users size={20} />} label="Total Students" value={stats.users} color="indigo" />
                        <StatCard icon={<Building size={20} />} label="Total Owners" value={stats.owners} color="primary" />
                        <StatCard icon={<CheckCircle size={20} />} label="Verified PGs" value={`${stats.verified}/${stats.listings}`} color="emerald" />
                        <StatCard icon={<CalendarCheck size={20} />} label="Total Bookings" value={stats.bookings} color="amber" />
                    </div>
                )}

                <section>
                    {activeTab === 'listings' ? (
                        <>
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="w-8 h-8 bg-rose-500/10 rounded-lg flex items-center justify-center text-rose-500">
                                    <Clock size={18} />
                                </div>
                                <h2 className="text-xl font-bold text-white">Verification Queue</h2>
                            </div>

                            {isLoading ? (
                                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-700" size={32} /></div>
                            ) : listings.length === 0 ? (
                                <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl py-16 text-center">
                                    <p className="text-slate-500 font-bold text-base">Queue Clear! No pending listing requests.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {listings.map(listing => (
                                        <div key={listing.id} className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all shadow-xl">
                                            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                                                <div className="xl:col-span-1">
                                                    <div className="aspect-video rounded-xl overflow-hidden mb-3 border border-slate-800">
                                                        <img src={`http://localhost:5000${listing.images[0]}`} className="w-full h-full object-cover" />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{listing.name}</h3>
                                                    <div className="flex items-center text-slate-500 text-xs mt-1 font-medium">
                                                        <MapPin size={14} className="mr-1.5" /> {listing.locality}, {listing.city}
                                                    </div>
                                                </div>

                                                <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/50 p-5 rounded-xl border border-slate-800">
                                                    <div className="space-y-3">
                                                        <h4 className="text-[9px] uppercase font-black tracking-widest text-slate-600">Property Details</h4>
                                                        <div className="flex items-center text-slate-300 text-sm font-medium">
                                                            <IndianRupee size={14} className="mr-2 text-primary" /> {listing.price} / month
                                                        </div>
                                                        <div className="flex items-center text-slate-300 text-sm font-medium">
                                                            <Users size={14} className="mr-2 text-primary" /> {listing.room_type} Sharing
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3 md:border-l md:border-slate-800 md:pl-5">
                                                        <h4 className="text-[9px] uppercase font-black tracking-widest text-slate-600">Owner Contact</h4>
                                                        <div className="flex items-center text-slate-300 text-sm font-medium truncate">
                                                            <User size={14} className="mr-2 text-indigo-400" /> {listing.owner?.name}
                                                        </div>
                                                        <div className="flex items-center text-slate-300 text-sm font-medium truncate">
                                                            <Mail size={14} className="mr-2 text-indigo-400" /> {listing.owner?.email}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col justify-center gap-2">
                                                    <button 
                                                        onClick={() => handleVerify(listing.id, true)}
                                                        disabled={processingId === listing.id}
                                                        className="btn btn-primary py-3 text-xs tracking-widest font-black uppercase"
                                                    >
                                                        {processingId === listing.id ? <Loader2 className="animate-spin" size={16} /> : <><CheckCircle size={16} className="mr-2" /> Verify</>}
                                                    </button>
                                                    <button 
                                                        onClick={() => handleVerify(listing.id, false)}
                                                        disabled={processingId === listing.id}
                                                        className="btn btn-outline py-3 text-xs tracking-widest font-black uppercase text-rose-500 hover:bg-rose-500 pointer-events-auto"
                                                    >
                                                        <XCircle size={16} className="mr-2" /> Reject
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500">
                                    <CalendarCheck size={18} />
                                </div>
                                <h2 className="text-xl font-bold text-white">Full Booking Ledger</h2>
                            </div>

                            {isLoading ? (
                                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-700" size={32} /></div>
                            ) : bookings.length === 0 ? (
                                <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl py-16 text-center">
                                    <p className="text-slate-500 font-bold text-base">No bookings found in the system.</p>
                                </div>
                            ) : (
                                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-950 border-b border-slate-800">
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Ref ID</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Property</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Tenant</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Move-in</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/50">
                                            {bookings.map(booking => (
                                                <tr key={booking.id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="px-6 py-4 font-mono text-[10px] text-slate-400">#STAY{String(booking.id).padStart(5, '0')}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-bold text-white mb-0.5">{booking.PGListing?.name}</div>
                                                        <div className="text-[10px] text-slate-500 flex items-center"><MapPin size={10} className="mr-1" /> {booking.PGListing?.city}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-bold text-indigo-300 mb-0.5">{booking.User?.name}</div>
                                                        <div className="text-[10px] text-slate-500">{booking.User?.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs font-medium text-slate-400">
                                                        {new Date(booking.move_in_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                            booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                                            booking.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                                        }`}>
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => {
    const colors = {
        indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
        primary: 'text-primary bg-primary/10 border-primary/20',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    };
    
    return (
        <div className={`p-5 rounded-2xl border ${colors[color]} group transition-all duration-300 active:scale-95`}>
            <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    {icon}
                </div>
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 opacity-60">{label}</p>
            <h3 className="text-2xl font-black text-white">{value}</h3>
        </div>
    );
};

export default AdminDashboard;
