import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, UserCircle, Loader2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const Register = () => {
    const [searchParams] = useSearchParams();
    const initialRole = searchParams.get('role') || 'user';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: initialRole
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const user = await register(formData);
            if (user.role === 'admin') navigate('/admin-dashboard');
            else if (user.role === 'owner') navigate('/owner-dashboard');
            else navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 border border-primary/20"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2 border border-indigo-500/20"></div>

            <div className="w-full max-w-2xl relative z-10">
                <div className="bg-slate-900/60 backdrop-blur-3xl border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-5">
                        {/* Aside Info */}
                        <div className="lg:col-span-2 bg-primary p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-8 transform group-hover:rotate-12 transition-transform opacity-20">
                               <Sparkles size={120} />
                           </div>
                           <div className="relative z-10">
                               <h2 className="text-3xl font-black text-white leading-tight mb-6">Join the <br />Future of Staying.</h2>
                               <ul className="space-y-4">
                                   <li className="flex items-center text-sm font-bold text-white/80"><ShieldCheck size={16} className="mr-3" /> Verified listings only</li>
                                   <li className="flex items-center text-sm font-bold text-white/80"><ShieldCheck size={16} className="mr-3" /> AI property matching</li>
                                   <li className="flex items-center text-sm font-bold text-white/80"><ShieldCheck size={16} className="mr-3" /> Zero brokerage fees</li>
                               </ul>
                           </div>
                           <p className="text-[10px] uppercase font-black tracking-widest text-primary-dark/80 mt-12">SmartStay Platform v1.0</p>
                        </div>

                        {/* Form Body */}
                        <div className="lg:col-span-3 p-10 lg:p-14">
                            <div className="mb-10">
                                <h1 className="text-3xl font-black text-white">Create Account</h1>
                                <p className="text-slate-500 font-medium mt-1">Experience better student living.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-sm font-bold animate-shake">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">I am a...</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            type="button"
                                            onClick={() => setFormData({...formData, role: 'user'})}
                                            className={`py-3 rounded-xl text-xs font-black transition-all border ${formData.role === 'user' ? 'bg-white text-dark border-white shadow-lg' : 'bg-slate-800 text-slate-500 border-slate-700'}`}
                                        >
                                            Resident
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setFormData({...formData, role: 'owner'})}
                                            className={`py-3 rounded-xl text-xs font-black transition-all border ${formData.role === 'owner' ? 'bg-white text-dark border-white shadow-lg' : 'bg-slate-800 text-slate-500 border-slate-700'}`}
                                        >
                                            Property Owner
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2 group">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={18} />
                                            <input type="text" name="name" className="input-standard pl-12 text-sm" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={18} />
                                            <input type="tel" name="phone" className="input-standard pl-12 text-sm" value={formData.phone} onChange={handleChange} placeholder="9876543210" required />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={18} />
                                        <input type="email" name="email" className="input-standard pl-12 text-sm" value={formData.email} onChange={handleChange} placeholder="name@example.com" required />
                                    </div>
                                </div>

                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Secure Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors" size={18} />
                                        <input type="password" name="password" className="input-standard pl-12 text-sm" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary w-full py-5 text-sm font-black tracking-widest uppercase shadow-2xl shadow-primary/30 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center space-x-3" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="animate-spin" /> : <><span>Create Account</span> <ArrowRight size={18} /></>}
                                </button>
                            </form>

                            <div className="mt-10 text-center">
                                <p className="text-slate-500 text-sm font-medium">Already have an account? <Link to="/login" className="text-white font-black hover:text-primary transition-colors">Sign In</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
