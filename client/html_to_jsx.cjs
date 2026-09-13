const fs = require('fs');
const path = require('path');

function convertHtmlToJsx(html) {
    let jsx = html;
    
    // Replace class= with className=
    jsx = jsx.replace(/class=/g, 'className=');
    
    // Replace for= with htmlFor=
    jsx = jsx.replace(/for=/g, 'htmlFor=');
    
    // Replace SVG attributes
    jsx = jsx.replace(/viewbox=/gi, 'viewBox=');
    jsx = jsx.replace(/stroke-width=/gi, 'strokeWidth=');
    jsx = jsx.replace(/stroke-linecap=/gi, 'strokeLinecap=');
    jsx = jsx.replace(/stroke-linejoin=/gi, 'strokeLinejoin=');
    jsx = jsx.replace(/clip-rule=/gi, 'clipRule=');
    jsx = jsx.replace(/fill-rule=/gi, 'fillRule=');
    jsx = jsx.replace(/preserveaspectratio=/gi, 'preserveAspectRatio=');
    jsx = jsx.replace(/patternunits=/gi, 'patternUnits=');
    jsx = jsx.replace(/patterncontentunits=/gi, 'patternContentUnits=');
    
    jsx = jsx.replace(/src="guest_favourite_laurel.png"/g, 'src="/guest_favourite_laurel.png"');
    jsx = jsx.replace(/src="guest_favourite_badge.png"/g, 'src="/guest_favourite_badge.png"');
    
    // Self-close tags: img, input, hr, br, path, circle
    jsx = jsx.replace(/<img([^>]*?)(?<!\/)>/g, '<img$1 />');
    jsx = jsx.replace(/<input([^>]*?)(?<!\/)>/g, '<input$1 />');
    jsx = jsx.replace(/<hr([^>]*?)(?<!\/)>/g, '<hr$1 />');
    jsx = jsx.replace(/<br([^>]*?)(?<!\/)>/g, '<br$1 />');
    
    // Close unclosed tags in SVG
    jsx = jsx.replace(/<path([^>]*?)(?<!\/)>/g, '<path$1 />');
    jsx = jsx.replace(/<circle([^>]*?)(?<!\/)>/g, '<circle$1 />');
    jsx = jsx.replace(/<\/path\s*>/g, '');
    jsx = jsx.replace(/<\/circle\s*>/g, '');
    
    // Remove inline event handlers
    jsx = jsx.replace(/onclick="[^"]*"/gi, '');
    
    // Fix boolean attributes
    jsx = jsx.replace(/readonly=""/g, 'readOnly');
    jsx = jsx.replace(/readonly /g, 'readOnly ');
    jsx = jsx.replace(/readonly>/g, 'readOnly>');
    
    // Fix inline styles
    jsx = jsx.replace(/style="font-variation-settings:\\s*'FILL'\\s*1;?"/g, `style={{ fontVariationSettings: "'FILL' 1" }}`);
    jsx = jsx.replace(/style="width:\s*100%;?"/g, `style={{ width: "100%" }}`);
    jsx = jsx.replace(/style="width:\s*98%;?"/g, `style={{ width: "98%" }}`);
    jsx = jsx.replace(/style="width:\s*99%;?"/g, `style={{ width: "99%" }}`);
    jsx = jsx.replace(/style="width:\s*97%;?"/g, `style={{ width: "97%" }}`);
    
    // Fix HTML comments
    jsx = jsx.replace(/<!--(.*?)-->/gs, '{/* $1 */}');
    
    return jsx;
}

// Convert Header and Footer
const homeHtml = fs.readFileSync(path.join(__dirname, '../home.html'), 'utf-8');

const headerMatch = homeHtml.match(/<header[^>]*>([\s\S]*?)<\/header>/);
if (headerMatch) {
    let headerContent = convertHtmlToJsx(headerMatch[0]);
    // Fix link to point to React Router
    headerContent = headerContent.replace(/href="#"/g, 'to="/"');
    headerContent = headerContent.replace(/<a([^>]*?)to="\/([^"]*)"([^>]*?)>([\s\S]*?)<\/a>/g, '<Link$1to="/$2"$3>$4</Link>');
    // Remaining href="#" just remove them or point to "#void"
    headerContent = headerContent.replace(/href="#"/g, 'href="#void"');

    const headerTemplate = `import { Link } from 'react-router-dom';\n\nexport default function Header() {\n    return (\n        ${headerContent}\n    );\n}`;
    fs.writeFileSync(path.join(__dirname, 'src/components/Header.tsx'), headerTemplate);
}

const footerMatch = homeHtml.match(/<footer[^>]*>([\s\S]*?)<\/footer>/);
if (footerMatch) {
    let footerContent = convertHtmlToJsx(footerMatch[0]);
    footerContent = footerContent.replace(/href="#"/g, 'href="#void"');
    const footerTemplate = `export default function Footer() {\n    return (\n        ${footerContent}\n    );\n}`;
    fs.writeFileSync(path.join(__dirname, 'src/components/Footer.tsx'), footerTemplate);
}

// Convert Home
const mainMatch = homeHtml.match(/<main[^>]*>([\s\S]*?)<\/main>/);
if (mainMatch) {
    let homeContent = convertHtmlToJsx(mainMatch[0]);
    
    // Replace Show all photos button to link to /photo-tour
    homeContent = homeContent.replace(
        /<button([^>]*?bottom-5 right-5[^>]*?)>([\s\S]*?)<\/button>/,
        `<Link$1 to="/photo-tour">$2</Link>`
    );

    // Make photo mosaic items links to /photo-tour
    homeContent = homeContent.replace(
        /<img([^>]*?)className="photo-mosaic-item([^"]*?)"([^>]*?)\/>/g,
        `<Link to="/photo-tour" className="block w-full h-full"><img$1className="photo-mosaic-item$2"$3/></Link>`
    );

    // Replace Show all 50 amenities button to add onClick handler
    homeContent = homeContent.replace(
        /<button([^>]*?)>(\s*Show all 50 amenities\s*)<\/button>/g,
        `<button$1 onClick={() => setIsAmenitiesModalOpen(true)}>$2</button>`
    );

    const homeTemplate = `import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AmenitiesModal from '../components/AmenitiesModal';

export default function Home() {
    const [isAmenitiesModalOpen, setIsAmenitiesModalOpen] = useState(false);

    return (
        <div className="w-full bg-white text-charcoal antialiased min-h-screen">
            <Header />
            ${homeContent}
            <Footer />
            <AmenitiesModal isOpen={isAmenitiesModalOpen} onClose={() => setIsAmenitiesModalOpen(false)} />
        </div>
    );
}`;
    fs.writeFileSync(path.join(__dirname, 'src/pages/Home.tsx'), homeTemplate);
}

// Convert Photo Tour
const ptHtml = fs.readFileSync(path.join(__dirname, '../photo_tour.html'), 'utf-8');
const ptMainMatch = ptHtml.match(/<main[^>]*>([\s\S]*?)<\/main>/);
if (ptMainMatch) {
    let ptContent = convertHtmlToJsx(ptMainMatch[1]);
    
    let photoIndex = 0;
    ptContent = ptContent.replace(/<div className="photo-card([^"]*?)"([^>]*?)>/g, (match, p1, p2) => {
        const index = photoIndex++;
        return `<div className="photo-card${p1} cursor-pointer"${p2} onClick={() => openLightbox(${index})}>`;
    });

    const ptTemplate = `import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const photos = [
    { src: "/images/img_42_19508f585a.jpg", title: "Living room 1 - Sofa seating & TV lounge" },
    { src: "/images/img_36_15dcf70e31.jpg", title: "Living room 2 - Indoor dining & jacuzzi patio" },
    { src: "/images/img_10_f3db9050dd.jpg", title: "Living room 2 - Private Jacuzzi view" },
    { src: "/images/img_6_58aa2eed53.jpg", title: "Living room 2 - Seating & double-height space" },
    { src: "/images/img_38_1a83463c12.jpg", title: "Full kitchen - Modern cooking appliances & dining table" },
    { src: "/images/img_15_37e215a1d6.jpg", title: "Bedroom - Double bed with warm lighting" },
    { src: "/images/img_37_95f9340dc2.jpg", title: "Bedroom - Full length mirror & ensuite entry" },
    { src: "/images/img_9_20aa19ec38.jpg", title: "Bedroom - Air conditioned master bedroom" },
    { src: "/images/img_39_111b3ed765.jpg", title: "Pool - Shared swimming pool courtyard" },
    { src: "/images/img_14_69c43a4751.jpg", title: "Pool - Wooden sun deck area" },
    { src: "/images/img_41_0a33140d61.jpg", title: "Pool - Building perspective & surrounding balconies" },
    { src: "/images/img_32_048726073b.jpg", title: "Additional photos - Lounge and relaxation area" }
];

const categories = [
    { id: 'living-room-1', label: 'Living room 1' },
    { id: 'living-room-2', label: 'Living room 2' },
    { id: 'full-kitchen', label: 'Full kitchen' },
    { id: 'bedroom', label: 'Bedroom' },
    { id: 'pool', label: 'Pool' },
    { id: 'additional-photos', label: 'Additional photos' }
];

export default function PhotoTour() {
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);
    const [activeSection, setActiveSection] = useState('living-room-1');
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
    };

    const closeLightbox = () => {
        setLightboxIndex(null);
    };

    const nextPhoto = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (lightboxIndex !== null) {
            setLightboxIndex((lightboxIndex + 1) % photos.length);
        }
    };

    const prevPhoto = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (lightboxIndex !== null) {
            setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
        }
    };

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollPos = window.scrollY + 200;
            categories.forEach(cat => {
                const el = document.getElementById(cat.id);
                if (el) {
                    const top = el.offsetTop;
                    const height = el.offsetHeight;
                    if (scrollPos >= top && scrollPos < top + height) {
                        setActiveSection(cat.id);
                    }
                }
            });
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (lightboxIndex === null) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') setLightboxIndex(prev => prev !== null ? (prev + 1) % photos.length : null);
            if (e.key === 'ArrowLeft') setLightboxIndex(prev => prev !== null ? (prev - 1 + photos.length) % photos.length : null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxIndex]);

    return (
        <div className="bg-white text-[#222222] min-h-screen relative selection:bg-neutral-200">
            {/* Header Navigation */}
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
                    Photo tour - Romantic Jacuzzi 1BHK Candolim | Mirashya UG10
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        aria-label="Share listing"
                        className="w-9 h-9 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-colors text-neutral-800"
                        onClick={handleShare}
                        type="button"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                            <path d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M12 2.25v13.5m0-13.5l3.75 3.75M12 2.25L8.25 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button
                        aria-label="Save to wishlist"
                        className={\`w-9 h-9 rounded-full hover:bg-neutral-100 flex items-center justify-center transition-colors \${isSaved ? 'text-red-500' : 'text-neutral-800'}\`}
                        onClick={() => setIsSaved(!isSaved)}
                        type="button"
                    >
                        <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                            <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* Category Navigation Pills */}
            <nav className="sticky top-16 bg-white/95 backdrop-blur-sm z-30 border-b border-gray-100 px-6 sm:px-12 py-3 overflow-x-auto no-scrollbar flex items-center gap-2">
                {categories.map(cat => (
                    <a
                        key={cat.id}
                        href={\`#\${cat.id}\`}
                        className={\`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-colors whitespace-nowrap \${activeSection === cat.id ? 'bg-neutral-900 text-white border-neutral-900' : 'border-gray-200 text-neutral-700 hover:border-neutral-900'}\`}
                    >
                        {cat.label}
                    </a>
                ))}
            </nav>

            {/* Main Content */}
            <main className="max-w-[1280px] mx-auto px-6 sm:px-12 pt-8 pb-32 flex flex-col gap-16 md:gap-24">
                ${ptContent}
            </main>

            {/* Lightbox Modal */}
            {lightboxIndex !== null && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Image lightbox"
                    className="fixed inset-0 z-50 bg-black/95 text-white flex flex-col justify-between transition-opacity duration-300 select-none"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeLightbox();
                    }}
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
                            {lightboxIndex + 1} / {photos.length}
                        </div>

                        <div className="flex items-center gap-3">
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
                                alt="Photo tour active view"
                                className="max-w-full max-h-[78vh] object-contain rounded-lg shadow-2xl transition duration-200"
                                src={photos[lightboxIndex].src}
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
                        <p className="text-base font-normal text-white">{photos[lightboxIndex].title}</p>
                    </div>
                </div>
            )}
        </div>
    );
}`;
    fs.writeFileSync(path.join(__dirname, 'src/pages/PhotoTour.tsx'), ptTemplate);
}

// Convert Lightbox Viewer
const lbHtml = fs.readFileSync(path.join(__dirname, '../lightBox_viewer.html'), 'utf-8');
const lbMainMatch = lbHtml.match(/<main[^>]*>([\s\S]*?)<\/main>/);
if (lbMainMatch) {
    const lbTemplate = `import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';

const galleryPhotos = [
    { id: 1, name: "Living room 1", src: "/images/img_42_19508f585a.jpg" },
    { id: 2, name: "Living room 2 - Indoor dining & jacuzzi patio", src: "/living_room_2_photo.jpg" },
    { id: 3, name: "Living room 2 - Private Jacuzzi view", src: "/images/img_10_f3db9050dd.jpg" },
    { id: 4, name: "Living room 2", src: "/living_room_2_photo.jpg" },
    { id: 5, name: "Full kitchen", src: "/images/img_38_1a83463c12.jpg" },
    { id: 6, name: "Bedroom", src: "/images/img_15_37e215a1d6.jpg" },
    { id: 7, name: "Pool", src: "/images/img_39_111b3ed765.jpg" },
    { id: 8, name: "Additional photos", src: "/images/img_32_048726073b.jpg" }
];

const totalPhotos = 43;

export default function LightboxViewer() {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(3); // 3 -> '4 of 43'

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % totalPhotos);
    }, []);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + totalPhotos) % totalPhotos);
    }, []);

    const handleClose = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev, handleClose]);

    const activePhoto = galleryPhotos[currentIndex % galleryPhotos.length];

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
                                <circle cx="5" cy="5" r="2" />
                                <circle cx="12" cy="5" r="2" />
                                <circle cx="19" cy="5" r="2" />
                                <circle cx="5" cy="12" r="2" />
                                <circle cx="12" cy="12" r="2" />
                                <circle cx="19" cy="12" r="2" />
                                <circle cx="5" cy="19" r="2" />
                                <circle cx="12" cy="19" r="2" />
                                <circle cx="19" cy="19" r="2" />
                            </svg>
                        </Link>
                    </div>
                    <div className="text-center px-4">
                        <h1 className="text-sm sm:text-base font-medium tracking-tight text-neutral-900 truncate max-w-md">
                            {activePhoto ? activePhoto.name : \`Photo \${currentIndex + 1}\`}
                        </h1>
                    </div>
                    <div className="flex items-center space-x-3 sm:space-x-5">
                        <span className="text-xs sm:text-sm font-normal text-neutral-800 tracking-wide">
                            {currentIndex + 1} of {totalPhotos}
                        </span>
                        <button
                            onClick={handleClose}
                            aria-label="Close photo viewer"
                            className="p-2.5 rounded-full hover:bg-neutral-100 transition text-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 cursor-pointer"
                            title="Close (Esc)"
                            type="button"
                        >
                            <svg aria-hidden="true" className="w-5 h-5 stroke-current" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                                <line x1="18" x2="6" y1="6" y2="18" />
                                <line x1="6" x2="18" y1="6" y2="18" />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* StageContent */}
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
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={currentIndex}
                                initial={{ opacity: 0, scale: 0.99 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.99 }}
                                transition={{ duration: 0.2 }}
                                alt={\`\${activePhoto ? activePhoto.name : 'Photo'} - Romantic Jacuzzi 1BHK Candolim\`}
                                className="max-h-full max-w-full object-contain rounded select-none shadow-sm"
                                src={activePhoto ? activePhoto.src : ''}
                            />
                        </AnimatePresence>
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
}`;
    fs.writeFileSync(path.join(__dirname, 'src/pages/LightboxViewer.tsx'), lbTemplate);
}
