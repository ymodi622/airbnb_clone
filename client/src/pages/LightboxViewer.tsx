import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useListing } from '../hooks/useListing';

export default function LightboxViewer() {
    const navigate = useNavigate();
    const { photos, loading } = useListing(1);

    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, [photos.length]);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }, [photos.length]);

    const handleClose = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft')  handlePrev();
            if (e.key === 'Escape')     handleClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev, handleClose]);

    const activePhoto = photos[currentIndex];

    return (
        <div className="bg-white text-neutral-900 font-sans antialiased overflow-hidden select-none m-0 p-0 h-screen w-screen">
            <main className="relative w-full h-full flex flex-col justify-between bg-white" data-purpose="photo-lightbox" id="lightbox-modal">

                {/* TopBar */}
                <header className="w-full h-16 sm:h-20 px-4 sm:px-8 flex items-center justify-between z-20 shrink-0" data-purpose="lightbox-navigation-bar">
                    <div className="flex items-center">
                        <Link
                            to="/photo-tour"
                            aria-label="View all photos grid"
                            className="p-2.5 rounded-full hover:bg-neutral-100 transition text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400"
                            title="View all photos"
                        >
                            <svg aria-hidden="true" className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <circle cx="5"  cy="5"  r="2" />
                                <circle cx="12" cy="5"  r="2" />
                                <circle cx="19" cy="5"  r="2" />
                                <circle cx="5"  cy="12" r="2" />
                                <circle cx="12" cy="12" r="2" />
                                <circle cx="19" cy="12" r="2" />
                                <circle cx="5"  cy="19" r="2" />
                                <circle cx="12" cy="19" r="2" />
                                <circle cx="19" cy="19" r="2" />
                            </svg>
                        </Link>
                    </div>

                    <div className="text-center px-4">
                        <h1 className="text-sm sm:text-base font-medium tracking-tight text-neutral-900 truncate max-w-md">
                            {loading
                                ? 'Loading…'
                                : activePhoto
                                ? `${activePhoto.caption} · ${activePhoto.room_label}`
                                : `Photo ${currentIndex + 1}`}
                        </h1>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-5">
                        <span className="text-xs sm:text-sm font-normal text-neutral-800 tracking-wide">
                            {loading ? '…' : `${currentIndex + 1} of ${photos.length}`}
                        </span>
                        <button
                            onClick={handleClose}
                            aria-label="Close photo viewer"
                            className="p-2.5 rounded-full hover:bg-neutral-100 transition text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 cursor-pointer"
                            title="Close (Esc)"
                            type="button"
                        >
                            <svg aria-hidden="true" className="w-5 h-5 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                                <line x1="18" x2="6"  y1="6"  y2="18" />
                                <line x1="6"  x2="18" y1="6"  y2="18" />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* Stage */}
                <section className="relative flex-1 w-full flex items-center justify-center overflow-hidden px-4 sm:px-14 lg:px-20 py-2 sm:py-4" data-purpose="photo-stage-area">
                    <div className="absolute left-4 sm:left-8 z-10">
                        <button
                            onClick={handlePrev}
                            aria-label="Previous photo"
                            className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border border-neutral-300 shadow-sm text-neutral-800 hover:bg-neutral-50 hover:border-neutral-400 transition transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-neutral-400 cursor-pointer"
                            type="button"
                        >
                            <svg className="w-4 h-4 stroke-current ml-[-1px]" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>
                    </div>

                    <div className="relative w-full h-full flex items-center justify-center max-w-7xl">
                        {loading ? (
                            <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
                        ) : (
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentIndex}
                                    initial={{ opacity: 0, scale: 0.99 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.99 }}
                                    transition={{ duration: 0.2 }}
                                    alt={activePhoto?.caption ?? 'Photo'}
                                    className="max-h-full max-w-full object-contain rounded select-none shadow-sm"
                                    src={activePhoto?.url ?? ''}
                                />
                            </AnimatePresence>
                        )}
                    </div>

                    <div className="absolute right-4 sm:right-8 z-10">
                        <button
                            onClick={handleNext}
                            aria-label="Next photo"
                            className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border border-neutral-300 shadow-sm text-neutral-800 hover:bg-neutral-50 hover:border-neutral-400 transition transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-neutral-400 cursor-pointer"
                            type="button"
                        >
                            <svg className="w-4 h-4 stroke-current mr-[-1px]" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    </div>
                </section>

                <footer aria-hidden="true" className="h-6 sm:h-10 w-full" />
            </main>
        </div>
    );
}