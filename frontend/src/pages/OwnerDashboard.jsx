import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOwnerListings, deleteListing } from '../services/listingService';
import { getOwnerStats } from '../services/statsService';
import { Plus, Trash2, Edit, CheckCircle, Clock, MapPin, IndianRupee, Loader2, LayoutDashboard, Wallet, TrendingUp, Users } from 'lucide-react';

const OwnerDashboard = () => {
    const [listings, setListings] = useState([]);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [listingsRes, statsData] = await Promise.all([
                getOwnerListings(),
                getOwnerStats()
            ]);
            setListings(listingsRes);
            setStats(statsData);
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this listing?')) {
            try {
                await deleteListing(id);
                setListings(listings.filter(l => l.id !== id));
            } catch (err) {
                alert('Failed to delete listing');
            }
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>;

    return (
        <div className="min-h-screen bg-dark py-12">
            <div className="container mx-auto px-6">
                <header className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-12">
                    <div>
                        <div className="inline-flex items-center space-x-2 text-primary font-bold uppercase tracking-tighter mb-4">
                            <LayoutDashboard size={20} />
                            <span>Owner Central</span>
                        </div>
                        <h1 className="text-3xl font-black text-white">Your Properties</h1>
                        <p className="text-slate-500 mt-1.5 font-medium text-sm">Manage your PG accommodations and track performance.</p>
                    </div>
                    <Link to="/add-listing" className="btn btn-primary px-8 py-4 text-base font-black shadow-2xl shadow-primary/30 active:scale-95 transition-all">
                        <Plus size={20} className="mr-2" /> List New PG
                    </Link>
                </header>

                {/* Dashboard Stats */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                        <DashboardStat icon={<LayoutDashboard size={20} />} label="Active Listings" value={stats.listingCount} color="indigo" />
                        <DashboardStat icon={<Clock size={20} />} label="Pending Requests" value={stats.pendingRequests} color="rose" />
                        <DashboardStat icon={<Users size={20} />} label="Total Tenants" value={stats.confirmedBookings} color="emerald" />
                        <DashboardStat icon={<TrendingUp size={20} />} label="Est. Revenue" value={`₹${stats.totalRevenue}`} color="primary" />
                    </div>
                )}

                <section>
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                            <MapPin size={18} />
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Manage Listings</h2>
                    </div>

                    {listings.length === 0 ? (
                        <div className="bg-slate-900/30 border border-dashed border-slate-800 rounded-[2.5rem] py-24 text-center">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500">
                                <Plus size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No listings found</h3>
                            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Build your portfolio! Add your first PG listing to start accepting bookings.</p>
                            <Link to="/add-listing" className="btn btn-outline px-8 py-3">Add Your First PG</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            {listings.map(listing => (
                                <div key={listing.id} className="group bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row gap-6 hover:border-slate-700 transition-all shadow-xl">
                                    <div className="w-full sm:w-40 h-40 rounded-xl overflow-hidden shrink-0 border border-slate-800 shadow-inner">
                                        <img src={`http://localhost:5000${listing.images[0]}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={listing.name} />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-black text-white group-hover:text-primary transition-colors">{listing.name}</h3>
                                                <p className="text-slate-500 text-xs flex items-center mt-1"><MapPin size={12} className="mr-1" /> {listing.locality}, {listing.city}</p>
                                            </div>
                                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${listing.is_verified ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                                                {listing.is_verified ? 'Verified' : 'Pending'}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 py-4 border-y border-slate-800/50">
                                            <div className="text-white font-bold flex items-center"><IndianRupee size={16} className="text-slate-600 mr-1.5" /> {listing.price}</div>
                                            <div className="text-white font-bold flex items-center border-l border-slate-800 pl-6"><Users size={16} className="text-slate-600 mr-1.5" /> {listing.room_type} Sharing</div>
                                        </div>

                                        <div className="flex items-center gap-3 pt-2">
                                            <Link to={`/listings/${listing.id}`} className="flex-1 btn btn-outline text-xs py-3 rounded-xl border-slate-800">
                                                View Live
                                            </Link>
                                            <button onClick={() => handleDelete(listing.id)} className="p-3 rounded-xl bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-all shadow-sm">
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

const DashboardStat = ({ icon, label, value, color }) => {
    const colors = {
        indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 shadow-indigo-500/5',
        rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-rose-500/5',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5',
        primary: 'text-primary bg-primary/10 border-primary/20 shadow-primary/5'
    };
    
    return (
        <div className={`p-6 rounded-3xl border ${colors[color]} shadow-2xl transition-all duration-300 hover:-translate-y-1`}>
            <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    {icon}
                </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-0.5 opacity-60">{label}</p>
            <h3 className="text-2xl font-black text-white">{value}</h3>
        </div>
    );
};

export default OwnerDashboard;
