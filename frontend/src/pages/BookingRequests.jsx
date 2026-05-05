import React, { useState, useEffect } from 'react';
import { getOwnerBookings, updateBookingStatus } from '../services/bookingService';
import { Clock, CheckCircle, XCircle, User, Calendar, MessageSquare, Loader2, IndianRupee, MapPin } from 'lucide-react';

const BookingRequests = () => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await getOwnerBookings();
            setRequests(data);
        } catch (err) {
            console.error('Failed to fetch requests', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (id, status) => {
        setProcessingId(id);
        try {
            await updateBookingStatus(id, status);
            setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
        } catch (err) {
            alert('Action failed');
        } finally {
            setProcessingId(null);
        }
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={48} /></div>;

    return (
        <div className="min-h-screen bg-dark py-12">
            <div className="container mx-auto px-6">
                <header className="mb-12">
                    <div className="inline-flex items-center space-x-2 text-primary font-bold uppercase tracking-tighter mb-4">
                        <MessageSquare size={20} />
                        <span>Applicant Inbox</span>
                    </div>
                    <h1 className="text-3xl font-black text-white">Booking Requests</h1>
                    <p className="text-slate-500 mt-1.5 font-medium text-sm">Review and manage move-in requests for your properties.</p>
                </header>

                {requests.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-3xl">
                        <p className="text-slate-500 font-bold text-base">No incoming booking requests at the moment.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map(request => (
                            <div key={request.id} className="group bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 hover:border-slate-700 transition-all shadow-2xl overflow-hidden relative">
                                <div className={`absolute top-0 right-0 w-40 h-40 blur-[100px] -translate-y-1/2 translate-x-1/2 ${
                                    request.status === 'confirmed' ? 'bg-emerald-500/10' : 
                                    request.status === 'pending' ? 'bg-amber-500/10' : 'bg-rose-500/10'
                                }`}></div>

                                <div className="grid grid-cols-1 xl:grid-cols-4 gap-12 relative z-10">
                                    {/* PG Info */}
                                    <div className="xl:col-span-1">
                                        <div className="aspect-video xl:aspect-square rounded-2xl overflow-hidden mb-4 border border-slate-800">
                                            <img src={`http://localhost:5000${request.PGListing.images[0]}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="PG" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{request.PGListing.name}</h3>
                                        <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-widest">{request.PGListing.locality}</p>
                                    </div>

                                    {/* Requester Info */}
                                    <div className="xl:col-span-2 space-y-8">
                                        <div className="flex flex-col sm:flex-row gap-6">
                                            <div className="flex-1 bg-slate-950/50 p-5 rounded-2xl border border-slate-800">
                                                <div className="flex items-center space-x-3 mb-3">
                                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                                                        {request.User.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Applicant Name</p>
                                                        <p className="text-base font-bold text-white">{request.User.name}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5 text-xs text-slate-400 font-medium">
                                                    <p className="flex items-center"><User size={12} className="mr-2 text-slate-600" /> {request.User.email}</p>
                                                    <p className="flex items-center"><Calendar size={12} className="mr-2 text-slate-600" /> Move-in: {new Date(request.move_in_date).toLocaleDateString()}</p>
                                                </div>
                                            </div>

                                            <div className="sm:w-48 bg-slate-950/50 p-6 rounded-3xl border border-slate-800 flex flex-col justify-center text-center">
                                                <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Request Status</label>
                                                <div className={`text-sm font-black uppercase tracking-widest flex items-center justify-center ${
                                                    request.status === 'confirmed' ? 'text-emerald-500' : 
                                                    request.status === 'pending' ? 'text-amber-500' : 'text-rose-500'
                                                }`}>
                                                    {request.status === 'pending' ? <Clock size={16} className="mr-2" /> : 
                                                     request.status === 'confirmed' ? <CheckCircle size={16} className="mr-2" /> : <XCircle size={16} className="mr-2" />}
                                                    {request.status}
                                                </div>
                                            </div>
                                        </div>

                                        {request.message && (
                                            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-inner">
                                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 italic">Message from applicant:</p>
                                                <p className="text-slate-300 text-sm italic font-medium leading-relaxed">"{request.message}"</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col justify-center gap-4">
                                        {request.status === 'pending' ? (
                                            <>
                                                <button 
                                                    onClick={() => handleAction(request.id, 'confirmed')}
                                                    disabled={processingId === request.id}
                                                    className="btn btn-primary py-4 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                                                >
                                                    {processingId === request.id ? <Loader2 className="animate-spin" /> : 'Accept Request'}
                                                </button>
                                                <button 
                                                    onClick={() => handleAction(request.id, 'rejected')}
                                                    disabled={processingId === request.id}
                                                    className="btn btn-outline py-4 text-sm font-black uppercase tracking-widest border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        ) : (
                                            <div className="text-center p-6 bg-slate-950 rounded-3xl border border-slate-800">
                                                <p className="text-xs font-black text-slate-600 uppercase tracking-widest">Action taken on</p>
                                                <p className="text-lg font-bold text-slate-400 mt-1">{new Date().toLocaleDateString()}</p>
                                            </div>
                                        )}
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

export default BookingRequests;
