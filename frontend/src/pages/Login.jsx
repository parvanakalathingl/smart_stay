import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const user = await login(email, password);
            if (user.role === 'admin') navigate('/admin-dashboard');
            else if (user.role === 'owner') navigate('/owner-dashboard');
            else navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark flex flex-col md:flex-row overflow-hidden">
            {/* Left Section: Cinematic Visual */}
            <div className="hidden md:flex md:w-1/2 lg:w-[55%] relative items-center justify-center overflow-hidden bg-slate-950">
                {/* <img 
                    src="/login_split_image_1776790679103.png" 
                    alt="Luxury Interior" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 hover:scale-110 transition-transform duration-[10s] ease-linear"
                /> */}
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-dark via-dark/40 to-transparent"></div>

                {/* Content Overlay */}
                <div className="relative z-10 pt-32 pb-16 px-16 max-w-2xl">
                    <div className="w-16 h-16 bg-primary/20 backdrop-blur-xl border border-primary/30 rounded-2xl flex items-center justify-center mb-10 rotate-3 shadow-2xl shadow-primary/20">
                        <Zap className="text-primary fill-primary" size={32} />
                    </div>
                    <h2 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
                        Stay Smart.<br />
                        <span className="text-primary">Live Premium.</span>
                    </h2>
                    <p className="text-slate-400 text-lg lg:text-xl font-medium leading-relaxed max-w-lg mb-10">
                        Experience the next generation of property stays with a platform designed for comfort, security, and elegance.
                    </p>

                    <div className="flex items-center space-x-6">
                        <div className="flex -space-x-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-12 h-12 rounded-full border-2 border-dark bg-slate-800"></div>
                            ))}
                        </div>
                        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                            <span className="text-white">5k+</span> Verified Stays
                        </div>
                    </div>
                </div>

                {/* Subtle Grain Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            </div>

            {/* Right Section: Core Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-dark relative">
                {/* Mobile Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] md:hidden"></div>

                <div className="w-full max-w-md relative z-10">
                    <div className="mb-12">
                        <div className="md:hidden w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-6 shadow-xl shadow-primary/30">
                            <Zap className="text-white fill-white" size={24} />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-black text-white mb-2 leading-tight">Welcome Back</h1>
                        <p className="text-slate-500 font-medium">Continue your Smart Stay journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-sm font-bold flex items-center">
                                <ShieldCheck size={18} className="mr-3 shrink-0" /> {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="email"
                                    className="input-standard pl-12 h-14"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="password"
                                    className="input-standard pl-12 h-14"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-full py-5 text-sm font-black tracking-widest uppercase shadow-2xl shadow-primary/30 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center space-x-3 overflow-hidden group" disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>
                                    <span>Login Now</span>
                                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-10 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-slate-500 text-sm font-medium">
                            New around here?
                        </p>
                        <Link to="/register" className="text-primary text-sm font-black border-b-2 border-primary/10 hover:border-primary transition-all pb-1">
                            Join the Community
                        </Link>
                    </div>

                    <p className="mt-16 text-slate-700 text-[10px] font-bold tracking-[0.3em] uppercase hidden md:block">
                        © 2026 SmartStay • Secure Login
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
