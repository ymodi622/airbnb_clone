import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListing } from '../hooks/useListing';
import type { Photo } from '../services/api';
import { useToast } from '../context/ToastContext';

// Room label → section ID slug
const labelToId = (label: string) => label.toLowerCase().replace(/\s+/g, '-');

// Room label → amenity description
const ROOM_DESC: Record<string, string> = {
  'Living room': 'Sofa · Air conditioning · Ceiling fan · TV · Dining area',
  'Kitchen':     'Freezer · Fridge · Blender · Cooker · Microwave · Toaster · Kettle · Coffee · Crockery & cutlery',
  'Bedroom':     'Double bed · Air conditioning · Bed linen · Ceiling fan · Clothes storage · Hangers · Iron · WiFi',
  'Bathroom':    'En-suite · Rainfall shower · Hair dryer · Body soap · Shampoo & conditioner',
  'Pool':        'Shared swimming pool · Sun deck · Plunge pool · Jacuzzi',
  'Gym':         'Treadmill · Elliptical · Cycle · Free weights · Bench press',
  'Exterior':    'Aerial view · Building façade · Gardens',
};

// ── Photo grid renderer ─────────────────────────────────────────────────────
function PhotoGrid({
    photos,
    startIndex,
    onOpen,
}: {
    photos: Photo[];
    startIndex: number;
    onOpen: (i: number) => void;
}) {
    if (photos.length === 0) return null;

    const rows: Photo[][] = [];
    let i = 0;
    // First photo spans full width
    rows.push([photos[i++]]);
    // Remaining in pairs
    while (i < photos.length) {
        rows.push(photos.slice(i, i + 2));
        i += 2;
    }

    let globalIdx = startIndex;
    return (
        <div className="md:col-span-8 space-y-4">
            {rows.map((row, ri) => {
                if (row.length === 1) {
                    const idx = globalIdx++;
                    return (
                        <div
                            key={ri}
                            className="photo-card overflow-hidden rounded-2xl aspect-[16/10] bg-neutral-100 shadow-sm cursor-pointer"
                            onClick={() => onOpen(idx)}
                        >
                            <img
                                alt={row[0].caption}
                                className="w-full h-full object-cover object-center transform hover:scale-[1.01] transition-transform duration-300"
                                src={row[0].url}
                            />
                        </div>
                    );
                }
                return (
                    <div key={ri} className="grid grid-cols-2 gap-4">
                        {row.map((p) => {
                            const idx = globalIdx++;
                            return (
                                <div
                                    key={p.id}
                                    className="photo-card overflow-hidden rounded-2xl aspect-[4/3] bg-neutral-100 shadow-sm cursor-pointer"
                                    onClick={() => onOpen(idx)}
                                >
                                    <img
                                        alt={p.caption}
                                        className="w-full h-full object-cover object-center transform hover:scale-[1.02] transition-transform duration-300"
                                        src={p.url}
                                    />
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function PhotoTour() {
    const navigate = useNavigate();
    const { listing, photosByRoom, loading, error } = useListing(1);
    const { showToast } = useToast();

    const [isSaved, setIsSaved]           = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const roomLabels = Object.keys(photosByRoom);

    // Build a flat ordered array for lightbox navigation
    const flatPhotos = roomLabels.flatMap((label) => photosByRoom[label]);

    const openLightbox  = (i: number) => setLightboxIndex(i);
    const closeLightbox = () => setLightboxIndex(null);

    const nextPhoto = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (lightboxIndex !== null)
            setLightboxIndex((lightboxIndex + 1) % flatPhotos.length);
    };
    const prevPhoto = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (lightboxIndex !== null)
            setLightboxIndex((lightboxIndex - 1 + flatPhotos.length) % flatPhotos.length);
    };
    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    // Scroll-spy
    useEffect(() => {
        if (roomLabels.length === 0) return;
        const handleScroll = () => {
            const scrollPos = window.scrollY + 200;
            for (const label of roomLabels) {
                const el = document.getElementById(labelToId(label));
                if (el) {
                    const { offsetTop, offsetHeight } = el;
                    if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
                        setActiveSection(labelToId(label));
                        break;
                    }
                }
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [roomLabels]);

    // Keyboard nav for lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (lightboxIndex === null) return;
            if (e.key === 'Escape')      closeLightbox();
            if (e.key === 'ArrowRight')  setLightboxIndex(prev => prev !== null ? (prev + 1) % flatPhotos.length : null);
            if (e.key === 'ArrowLeft')   setLightboxIndex(prev => prev !== null ? (prev - 1 + flatPhotos.length) % flatPhotos.length : null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxIndex, flatPhotos.length]);

    return (
        <div className="bg-white text-[#222222] min-h-screen relative selection:bg-neutral-200">

            {/* ── Header ── */}
            <header className="fixed top-0 inset-x-0 bg-white z-40 border-b border-gray-100 px-6 sm:px-12 h-16 flex items-center justify-between">
                <div className="flex items-center">
                    <button
                        aria-label="Back to listing"
                        className="w-9 h-9 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-colors text-neutral-800"
                        onClick={() => navigate(-1)}
                        type="button"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M15.75 19.5L8.25 12l7.5-7.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
                <div className="text-[16px] font-semibold tracking-tight text-neutral-900 truncate max-w-md">
                    {listing?.title ?? 'Photo tour'}
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        aria-label="Share listing"
                        className="w-9 h-9 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-colors text-neutral-800"
                        onClick={() => showToast()}
                        type="button"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                            <path d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M12 2.25v13.5m0-13.5l3.75 3.75M12 2.25L8.25 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button
                        aria-label="Save to wishlist"
                        className={`w-9 h-9 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-colors ${isSaved ? 'text-red-500' : 'text-neutral-800'}`}
                        onClick={() => { setIsSaved(!isSaved); showToast(); }}
                        type="button"
                    >
                        <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                            <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* ── Category Nav Pills ── */}
            <nav className="sticky top-16 bg-white/95 backdrop-blur-sm z-30 border-b border-gray-100 px-6 sm:px-12 py-3 overflow-x-auto no-scrollbar flex items-center gap-2">
                {roomLabels.map(label => {
                    const id = labelToId(label);
                    return (
                        <a
                            key={id}
                            href={`#${id}`}
                            className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-colors whitespace-nowrap ${
                                activeSection === id
                                    ? 'bg-neutral-900 text-white border-neutral-900'
                                    : 'border-gray-200 text-neutral-700 hover:border-neutral-900'
                            }`}
                        >
                            {label === 'Other' ? 'Additional photos' : label}
                        </a>
                    );
                })}
            </nav>

            {/* ── Main Content ── */}
            <main className="max-w-[1280px] mx-auto px-6 sm:px-12 pt-8 pb-32 flex flex-col gap-16 md:gap-24">

                {/* Loading state */}
                {loading && (
                    <div className="flex justify-center items-center py-32">
                        <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div className="text-center py-32 text-neutral-500">
                        <p className="text-lg font-medium text-red-500 mb-2">Failed to load photos</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {/* ── Dynamic Sections ── */}
                {!loading && !error && (() => {
                    let globalPhotoIndex = 0;
                    return roomLabels.map((label, roomIdx) => {
                        const roomPhotos = photosByRoom[label];
                        const startIndex = globalPhotoIndex;
                        globalPhotoIndex += roomPhotos.length;
                        const id = labelToId(label);
                        const displayLabel = label === 'Other' ? 'Additional photos' : label;

                        return (
                            <section
                                key={label}
                                id={id}
                                className={`grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start ${
                                    roomIdx === 0 ? 'pt-4' : 'pt-6 border-t border-gray-100'
                                }`}
                                data-purpose="room-section"
                            >
                                {/* Left info column */}
                                <div className="md:col-span-4 md:sticky md:top-36 space-y-3">
                                    <h2 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-neutral-900">
                                        {displayLabel}
                                    </h2>
                                    {ROOM_DESC[label] && (
                                        <p className="text-[15px] leading-relaxed text-neutral-600 font-normal">
                                            {ROOM_DESC[label]}
                                        </p>
                                    )}
                                    <p className="text-xs text-neutral-400">{roomPhotos.length} photo{roomPhotos.length !== 1 ? 's' : ''}</p>
                                </div>

                                {/* Right photo grid */}
                                <PhotoGrid
                                    photos={roomPhotos}
                                    startIndex={startIndex}
                                    onOpen={openLightbox}
                                />
                            </section>
                        );
                    });
                })()}
            </main>

            {/* ── Lightbox ── */}
            {lightboxIndex !== null && flatPhotos[lightboxIndex] && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Image lightbox"
                    className="fixed inset-0 z-50 bg-black/95 text-white flex flex-col justify-between transition-opacity duration-300 select-none"
                    onClick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}
                >
                    <div className="p-6 flex items-center justify-between z-10">
                        <button
                            aria-label="Close photo viewer"
                            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/10 text-white transition text-sm font-medium"
                            onClick={closeLightbox}
                            type="button"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Close</span>
                        </button>

                        <div className="text-sm font-medium tracking-wide text-neutral-300">
                            {lightboxIndex + 1} / {flatPhotos.length}
                        </div>

                        <button
                            aria-label="Share this image"
                            className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center transition"
                            onClick={handleShare}
                            type="button"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M12 2.25v13.5m0-13.5l3.75 3.75M12 2.25L8.25 6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <div className="relative flex-1 flex items-center justify-center px-4 sm:px-16 overflow-hidden">
                        <button
                            aria-label="Previous photo"
                            className="absolute left-4 sm:left-8 w-12 h-12 rounded-full border border-white/20 bg-black/40 hover:bg-black/80 flex items-center justify-center transition z-20 text-white"
                            onClick={prevPhoto}
                            type="button"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path d="M15.75 19.5L8.25 12l7.5-7.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <div className="max-w-6xl max-h-[78vh] flex items-center justify-center">
                            <img
                                alt={flatPhotos[lightboxIndex].caption}
                                className="max-w-full max-h-[78vh] object-contain rounded-lg shadow-2xl transition duration-200"
                                src={flatPhotos[lightboxIndex].url}
                            />
                        </div>

                        <button
                            aria-label="Next photo"
                            className="absolute right-4 sm:right-8 w-12 h-12 rounded-full border border-white/20 bg-black/40 hover:bg-black/80 flex items-center justify-center transition z-20 text-white"
                            onClick={nextPhoto}
                            type="button"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path d="M8.25 4.5l7.5 7.5-7.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <div className="p-6 text-center text-sm font-light text-neutral-300 min-h-[4rem]">
                        <p className="text-base font-normal text-white">{flatPhotos[lightboxIndex].caption}</p>
                        <p className="text-xs text-neutral-400 mt-1">{flatPhotos[lightboxIndex].room_label}</p>
                    </div>
                </div>
            )}
        </div>
    );
}