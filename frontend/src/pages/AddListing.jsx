import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createListing } from '../services/listingService';
import { Home, IndianRupee, MapPin, Users, Info, Check, Upload, Loader2, ArrowLeft, Image as ImageIcon } from 'lucide-react';

const AMENITIES_LIST = [
    'WiFi', 'Food Included', 'AC', 'Laundry', 'Parking', 'CCTV', 'Security', 'Gym', 'Heater', 'Cleaning'
];

const AddListing = () => {
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        locality: '',
        address: '',
        price: '',
        room_type: 'single',
        total_rooms: '',
        available_rooms: '',
        gender_pref: 'any',
        description: '',
        amenities: []
    });
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAmenityChange = (amenity) => {
        const updated = formData.amenities.includes(amenity)
            ? formData.amenities.filter(a => a !== amenity)
            : [...formData.amenities, amenity];
        setFormData({ ...formData, amenities: updated });
    };

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const d = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'amenities') {
                d.append(key, JSON.stringify(formData[key]));
            } else {
                d.append(key, formData[key]);
            }
        });

        for (let i = 0; i < files.length; i++) {
            d.append('images', files[i]);
        }

        try {
            await createListing(d);
            navigate('/owner-dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create listing');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-white mb-8 transition-colors group">
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold">Back to Dashboard</span>
                </button>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="bg-primary p-8 lg:p-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full"></div>
                        <h1 className="text-3xl lg:text-4xl font-black text-white mb-3 relative z-10">List Your Property</h1>
                        <p className="text-indigo-100 text-base opacity-80 relative z-10">Reach thousands of residents with our AI-powered PG platform.</p>
                    </div>

                    <div className="p-8 lg:p-10">
                        {error && (
                            <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-sm font-bold flex items-center">
                                <Info size={18} className="mr-3" /> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-10">
                            {/* Basic Info */}
                            <section>
                                <div className="flex items-center space-x-3 mb-8">
                                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-primary">
                                        <Home size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Basic Information</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">PG Name</label>
                                        <input 
                                            type="text" 
                                            name="name" 
                                            className="input-standard"
                                            value={formData.name} 
                                            onChange={handleChange} 
                                            placeholder="e.g. Royal Heritage PG" 
                                            required 
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">City</label>
                                        <input 
                                            type="text" 
                                            name="city" 
                                            className="input-standard"
                                            value={formData.city} 
                                            onChange={handleChange} 
                                            placeholder="e.g. Mangalore" 
                                            required 
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Locality</label>
                                        <input 
                                            type="text" 
                                            name="locality" 
                                            className="input-standard"
                                            value={formData.locality} 
                                            onChange={handleChange} 
                                            placeholder="e.g. Kuntikan" 
                                            required 
                                        />
                                    </div>
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Detailed Address</label>
                                        <textarea 
                                            name="address" 
                                            className="input-standard min-h-[100px] pt-3"
                                            value={formData.address} 
                                            onChange={handleChange} 
                                            placeholder="Building name, landmark, etc." 
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                            </section>

                            <hr className="border-slate-800" />

                            {/* Pricing & Rooms */}
                            <section>
                                <div className="flex items-center space-x-3 mb-8">
                                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-primary">
                                        <IndianRupee size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Pricing & Rooms</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Rent per Month (₹)</label>
                                        <input type="number" name="price" className="input-standard" value={formData.price} onChange={handleChange} required />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Sharing Type</label>
                                        <select 
                                            name="room_type" 
                                            className="input-standard appearance-none"
                                            value={formData.room_type} 
                                            onChange={handleChange}
                                        >
                                            <option value="single">Single Sharing</option>
                                            <option value="double">Double Sharing</option>
                                            <option value="triple">Triple Sharing</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Gender Preference</label>
                                        <select 
                                            name="gender_pref" 
                                            className="input-standard appearance-none"
                                            value={formData.gender_pref} 
                                            onChange={handleChange}
                                        >
                                            <option value="any">Any</option>
                                            <option value="male">Male Only</option>
                                            <option value="female">Female Only</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Total Rooms</label>
                                        <input type="number" name="total_rooms" className="input-standard" value={formData.total_rooms} onChange={handleChange} required />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Initially Available</label>
                                        <input type="number" name="available_rooms" className="input-standard" value={formData.available_rooms} onChange={handleChange} required />
                                    </div>
                                </div>
                            </section>

                            <hr className="border-slate-800" />

                            {/* Amenities */}
                            <section>
                                <div className="flex items-center space-x-3 mb-8">
                                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-primary">
                                        <Check size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Amenities</h3>
                                </div>
                                <div className="flex flex-wrap gap-2.5">
                                    {AMENITIES_LIST.map(item => (
                                        <button 
                                            key={item} 
                                            type="button"
                                            onClick={() => handleAmenityChange(item)}
                                            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                                                formData.amenities.includes(item) 
                                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                            }`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <hr className="border-slate-800" />

                            {/* Images */}
                            <section>
                                <div className="flex items-center space-x-3 mb-8">
                                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-primary">
                                        <Upload size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Property Images</h3>
                                </div>
                                <div className="group relative border-2 border-dashed border-slate-800 rounded-3xl p-10 text-center hover:border-primary/50 transition-all cursor-pointer">
                                    <input 
                                        type="file" 
                                        multiple 
                                        onChange={handleFileChange} 
                                        accept="image/*" 
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <ImageIcon size={32} />
                                    </div>
                                    <p className="text-xl font-bold text-white mb-2">
                                        {files.length > 0 ? `${files.length} images selected` : 'Drop your images here'}
                                    </p>
                                    <p className="text-slate-500 font-medium text-sm">Upload up to 5 clear photos of the room, hall, and bathroom.</p>
                                </div>
                            </section>

                            <button 
                                type="submit" 
                                className="btn btn-primary w-full py-4 text-lg font-black tracking-widest uppercase shadow-2xl shadow-primary/40 active:scale-95 disabled:opacity-50 transition-all"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'Confirm & Submit Listing'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddListing;
