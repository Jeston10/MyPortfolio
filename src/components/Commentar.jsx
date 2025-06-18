import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { getDocs, addDoc, collection, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase-comment';
import { MessageCircle, UserCircle2, Loader2, AlertCircle, Send, ImagePlus, X } from 'lucide-react';
import AOS from "aos";
import "aos/dist/aos.css";

const FILTER_START_DATE = new Date('2025-06-02T16:00:00'); // ISO string for 2nd June 2025 15:00 local time

const Comment = memo(({ comment, formatDate, index }) => (
    <div 
        className="px-4 pt-4 pb-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group hover:shadow-lg hover:-translate-y-0.5"
        tabIndex={0} // For accessibility, make comment focusable
        aria-label={`Comment by ${comment.userName}`}
    >
        <div className="flex items-start gap-3 ">
            {comment.profileImage ? (
                <img
                    src={comment.profileImage}
                    alt={`${comment.userName}'s profile`}
                    className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/30"
                    loading="lazy"
                />
            ) : (
                <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/30 transition-colors">
                    <UserCircle2 className="w-5 h-5" />
                </div>
            )}
            <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-4 mb-2">
                    <h4 className="font-medium text-white truncate">{comment.userName}</h4>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(comment.createdAt)}
                    </span>
                </div>
                <p className="text-gray-300 text-sm break-words leading-relaxed relative bottom-2">{comment.content}</p>
            </div>
        </div>
    </div>
));

const CommentForm = memo(({ onSubmit, isSubmitting, error }) => {
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imageError, setImageError] = useState('');
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    // Save userName to localStorage on change
    const handleUserNameChange = useCallback((e) => {
        setUserName(e.target.value);
        localStorage.setItem('userName', e.target.value);
    }, []);

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setImageError('Image size must be less than 5MB.');
                setImageFile(null);
                setImagePreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }
            setImageError('');
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    }, []);

    const handleTextareaChange = useCallback((e) => {
        setNewComment(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (!newComment.trim() || !userName.trim()) return;

        onSubmit({ newComment, userName, imageFile });
        setNewComment('');
        setImagePreview(null);
        setImageFile(null);
        setImageError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }, [newComment, userName, imageFile, onSubmit]);

    // Submit on Ctrl+Enter or Cmd+Enter
    const handleKeyDown = useCallback((e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (!isSubmitting) {
                handleSubmit(e);
            }
        }
    }, [handleSubmit, isSubmitting]);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1000">
                <label className="block text-sm font-medium text-white" htmlFor="userNameInput">
                    Name <span className="text-red-400">*</span>
                </label>
                <input
                    id="userNameInput"
                    type="text"
                    value={userName}
                    onChange={handleUserNameChange}
                    placeholder="Enter your name"
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    required
                    autoComplete="name"
                />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1200">
                <label className="block text-sm font-medium text-white" htmlFor="messageTextarea">
                    Message <span className="text-red-400">*</span>
                </label>
                <textarea
                    id="messageTextarea"
                    ref={textareaRef}
                    value={newComment}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Write your message here..."
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none min-h-[120px]"
                    required
                />
                <p className="text-xs text-gray-400 italic select-none">Press Ctrl+Enter (Cmd+Enter on Mac) to submit</p>
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1400">
                <label className="block text-sm font-medium text-white" htmlFor="profilePhotoInput">
                    Profile Photo <span className="text-gray-400">(optional)</span>
                </label>
                <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                    {imagePreview ? (
                        <div className="flex items-center gap-4">
                            <img
                                src={imagePreview}
                                alt="Profile preview"
                                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/50"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImagePreview(null);
                                    setImageFile(null);
                                    setImageError('');
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all group"
                                aria-label="Remove profile photo"
                            >
                                <X className="w-4 h-4" />
                                <span>Remove Photo</span>
                            </button>
                        </div>
                    ) : (
                        <div className="w-full" >
                            <input
                                id="profilePhotoInput"
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-all border border-dashed border-indigo-500/50 hover:border-indigo-500 group"
                            >
                                <ImagePlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span>Choose Profile Photo</span>
                            </button>
                            <p className="text-center text-gray-400 text-sm mt-2">
                                Max file size: 5MB
                            </p>
                            {imageError && <p className="text-red-400 text-xs mt-1">{imageError}</p>}
                        </div>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                data-aos="fade-up" data-aos-duration="1000"
                className="relative w-full h-12 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl font-medium text-white overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Posting...</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            <span>Post Comment</span>
                        </>
                    )}
                </div>
            </button>
        </form>
    );
});

const Komentar = () => {
    const [comments, setComments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const commentsEndRef = useRef(null);

    useEffect(() => {
        // Initialize AOS
        AOS.init({
            once: false,
            duration: 1000,
        });
    }, []);

    useEffect(() => {
        const commentsRef = collection(db, 'portfolio-comments');
        const q = query(commentsRef, orderBy('createdAt', 'desc'));
        
        return onSnapshot(q, (querySnapshot) => {
            const commentsData = querySnapshot.docs
                .map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                // Filter comments where createdAt exists and is >= FILTER_START_DATE
                .filter(comment => {
                    if (!comment.createdAt) return false; // ignore if no timestamp
                    const commentDate = comment.createdAt.toDate ? comment.createdAt.toDate() : new Date(comment.createdAt);
                    return commentDate >= FILTER_START_DATE;
                });

            setComments(commentsData);
        });
    }, []);

    // Scroll to bottom when comments change (new comment posted)
    useEffect(() => {
        if (commentsEndRef.current) {
            commentsEndRef.current.scrollTop = commentsEndRef.current.scrollHeight;
        }
    }, [comments]);

    // Format Firestore timestamp or date string nicely
    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const dateObj = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return dateObj.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Handle posting new comment
    const handlePostComment = async ({ newComment, userName, imageFile }) => {
        setIsSubmitting(true);
        setError('');
        try {
            let profileImageUrl = '';

            if (imageFile) {
                // Upload image to Firebase Storage
                const imageRef = ref(storage, `profile-photos/${Date.now()}_${imageFile.name}`);
                await uploadBytes(imageRef, imageFile);
                profileImageUrl = await getDownloadURL(imageRef);
            }

            await addDoc(collection(db, 'portfolio-comments'), {
                userName: userName.trim(),
                content: newComment.trim(),
                createdAt: serverTimestamp(),
                profileImage: profileImageUrl,
            });

        } catch (err) {
            setError('Failed to post comment. Please try again.');
            console.error('Error posting comment:', err);
        }
        setIsSubmitting(false);
    };

    return (
        <section
            id="comments"
            className="relative z-10 max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8"
            aria-label="User comments section"
        >
            <div className="mb-10 flex items-center gap-4 text-indigo-400">
                <MessageCircle className="w-6 h-6" />
                <h2 className="text-3xl font-bold tracking-tight text-white select-none">
                    Comments
                </h2>
            </div>

            <CommentForm onSubmit={handlePostComment} isSubmitting={isSubmitting} error={error} />

            {error && (
                <div className="mt-4 p-4 bg-red-800 text-red-400 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                </div>
            )}

            <div
                ref={commentsEndRef}
                className="mt-8 space-y-6 max-h-[450px] overflow-y-auto no-scrollbar"
                aria-live="polite"
                aria-relevant="additions"
            >
                {comments.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map((comment, index) => (
                        <Comment key={comment.id} comment={comment} formatDate={formatDate} index={index} />
                    ))
                )}
            </div>
        </section>
    );
};

export default Komentar;
