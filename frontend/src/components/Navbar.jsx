import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Search, BookOpen, User, LogOut, Menu, X, Shield, PlusCircle, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { name: 'Home', path: '/', icon: <Home size={18} /> },
        { name: 'Search', path: '/search', icon: <Search size={18} /> },
    ];

    if (user?.role === 'user') {
        navLinks.push({ name: 'My Bookings', path: '/bookings', icon: <BookOpen size={18} /> });
    }

    if (user?.role === 'owner') {
        navLinks.push({ name: 'Dashboard', path: '/owner-dashboard', icon: <LayoutDashboard size={18} /> });
        navLinks.push({ name: 'Add PG', path: '/add-listing', icon: <PlusCircle size={18} /> });
        navLinks.push({ name: 'Requests', path: '/booking-requests', icon: <BookOpen size={18} /> });
    }

    if (user?.role === 'admin') {
        navLinks.push({ name: 'Admin Panel', path: '/admin-dashboard', icon: <Shield size={18} /> });
    }

    return (
        <nav className="sticky top-0 z-50 bg-dark/80 backdrop-blur-xl border-b border-slate-800">
            <div className="container mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:rotate-12">
                            <Home className="text-white" size={24} />
                        </div>
                        <span className="text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            SmartStay
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                to={link.path} 
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
                            >
                                {link.icon}
                                <span>{link.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Auth Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4 pl-4 border-l border-slate-800">
                                <div className="flex items-center space-x-2 text-slate-200">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold border border-slate-700">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="text-sm font-medium hidden lg:block">{user.name}</span>
                                </div>
                                <button onClick={handleLogout} className="btn btn-outline py-1.5 px-4 text-xs">
                                    <LogOut size={16} className="mr-2" /> Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Login</Link>
                                <Link to="/register" className="btn btn-primary py-2 px-6 text-sm">Join Now</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={toggleMenu} className="p-2 text-slate-400 hover:text-white">
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <div className={`md:hidden fixed inset-0 z-40 bg-dark transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
                <div className="flex flex-col h-full bg-dark">
                    <div className="flex items-center justify-between p-6 border-b border-slate-800">
                        <Link to="/" className="text-xl font-bold" onClick={toggleMenu}>SmartStay</Link>
                        <button onClick={toggleMenu} className="p-2 stroke-slate-400"><X size={28} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto py-8 px-6 space-y-2">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                to={link.path} 
                                onClick={toggleMenu}
                                className="flex items-center space-x-4 p-4 rounded-xl text-slate-400 active:bg-primary/10 active:text-primary transition-colors text-lg font-semibold"
                            >
                                {link.icon}
                                <span>{link.name}</span>
                            </Link>
                        ))}
                    </div>
                    <div className="p-6 border-t border-slate-800 space-y-4">
                        {user ? (
                            <>
                                <div className="flex items-center space-x-3 p-2">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="text-lg font-medium">{user.name}</span>
                                </div>
                                <button onClick={handleLogout} className="btn btn-danger w-full py-4 text-lg">Logout</button>
                            </>
                        ) : (
                            <div className="flex flex-col space-y-4">
                                <Link to="/login" onClick={toggleMenu} className="btn btn-outline py-4 text-lg">Login</Link>
                                <Link to="/register" onClick={toggleMenu} className="btn btn-primary py-4 text-lg shadow-primary/40 shadow-xl">Join Now</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
