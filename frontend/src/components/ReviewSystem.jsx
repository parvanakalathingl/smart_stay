import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, MessageSquare, User, Loader2, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ReviewSystem = ({ listingId }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [canReview, setCanReview] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchReviews();
        if (user && user.role === 'user') {
            checkReviewPermission();
        }
    }, [listingId, user]);

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/reviews/listing/${listingId}`);
            setReviews(res.data);
        } catch (err) {
            console.error('Failed to fetch reviews', err);
        } finally {
            setIsLoading(false);
        }
    };

    const checkReviewPermission = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/reviews/can-review/${listingId}`, {
                headers: { 'x-auth-token': token }
            });
            setCanReview(res.data.canReview);
        } catch (err) {
            setCanReview(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await axios.post('http://localhost:5000/api/reviews', {
                listing_id: listingId,
                rating,
                comment
            });
            setReviews([{ ...res.data, User: { name: user.name } }, ...reviews]);
            setComment('');
            setRating(5);
        } catch (err) {
            alert('Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pt-12 border-t border-slate-800">
            <div className="flex items-center space-x-3 mb-10">
                <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                    <MessageSquare size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-white">Guest Reviews</h3>
                    <p className="text-slate-500 text-sm">Real experiences from verified residents</p>
                </div>
            </div>

            {/* Review Form */}
            {user && user.role === 'user' && canReview && (
                <div className="bg-slate-900/50 border border-slate-700/50 p-8 rounded-[2.5rem] mb-12 shadow-xl">
                    <h4 className="text-xl font-bold text-white mb-6">Share your overall experience</h4>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex items-center space-x-2 p-3 bg-slate-950/50 rounded-2xl border border-slate-800 w-fit">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button 
                                    key={star} 
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="p-1 transition-transform active:scale-90"
                                >
                                    <Star 
                                        size={32} 
                                        className={`${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} transition-colors`}
                                    />
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <textarea 
                                placeholder="What did you like or dislike about this stay?" 
                                className="input-standard min-h-[140px] pt-4 resize-none"
                                value={comment} 
                                onChange={(e) => setComment(e.target.value)}
                                required
                            ></textarea>
                            <div className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-600 uppercase">Min 10 characters</div>
                        </div>
                        <button type="submit" className="btn btn-primary px-10 py-4" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin" /> : <><Send size={18} className="mr-2" /> Post Public Review</>}
                        </button>
                    </form>
                </div>
            )}

            {user && user.role === 'user' && !canReview && (
                <div className="bg-slate-900/30 border border-dashed border-slate-800 p-8 rounded-[2.5rem] mb-12 text-center">
                    <p className="text-slate-500 font-medium">
                        Only verified residents with a <span className="text-emerald-500 font-bold">Confirmed Stay</span> can leave a review. 
                        <br />Book your stay today to share your experience!
                    </p>
                </div>
            )}

            {/* Review List */}
            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/10 border border-dashed border-slate-800 rounded-[2.5rem]">
                    <p className="text-slate-500 font-bold">No reviews yet. Be the first to share your thoughts!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map(review => (
                        <div key={review.id} className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] hover:border-slate-700 transition-all group">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-black text-white group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                    {review.User?.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <p className="font-black text-white">{review.User?.name}</p>
                                        <p className="text-[10px] font-bold text-slate-600 tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex space-x-1 mt-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star key={star} size={12} className={star <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-800'} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <blockquote className="text-slate-400 italic font-medium leading-relaxed">
                                "{review.comment}"
                            </blockquote>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewSystem;
