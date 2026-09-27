import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AmenitiesModal from '../components/AmenitiesModal';
import { useListing } from '../hooks/useListing';
import { useToast } from '../context/ToastContext';

export default function Home() {
    const [isAmenitiesModalOpen, setIsAmenitiesModalOpen] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const { photos } = useListing(1);
    const { showToast } = useToast();

    // Hero mosaic picks: hero, top-right, bottom-right, top-left, bottom-left
    // We pick one from each dominant category for variety
    const hero   = photos.find(p => p.room_label === 'Living room') ?? photos[0];
    const pick2  = photos.find(p => p.room_label === 'Bedroom')     ?? photos[1];
    const pick3  = photos.find(p => p.room_label === 'Kitchen')     ?? photos[2];
    const pick4  = photos.find(p => p.room_label === 'Pool')        ?? photos[3];
    const pick5  = photos.find(p => p.room_label === 'Exterior')    ?? photos[4];

    return (
        <div className="w-full bg-white text-charcoal antialiased min-h-screen">
            <Header />
            <main className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-6 pb-16" id="photos-section">
        {/*  BEGIN: TitleBar  */}
        <section className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            data-purpose="listing-title">
            <div>
                <h1 className="text-2xl sm:text-[26px] font-bold text-neutral-900 tracking-tight">Romantic Jacuzzi 1BHK
                    Candolim | Mirashya UG10</h1>
            </div>
            {/*  Action Buttons: Share / Save  */}
            <div className="flex items-center gap-4 text-sm font-semibold text-neutral-800">
                <button
                    className="flex items-center gap-2 hover:bg-neutral-100 px-3 py-1.5 rounded-md transition"
                    onClick={() => showToast()}
                    type="button"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="underline">Share</span>
                </button>
                <button
                    className={`flex items-center gap-2 hover:bg-neutral-100 px-3 py-1.5 rounded-md transition ${isSaved ? 'text-red-500' : 'text-neutral-800'}`}
                    onClick={() => { setIsSaved(!isSaved); showToast(); }}
                    type="button"
                >
                    <svg className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="underline">Save</span>
                </button>
            </div>
        </section>
        {/*  END: TitleBar  */}
        {/*  BEGIN: PhotoGalleryGrid  */}
        <section className="relative rounded-2xl overflow-hidden mb-8" data-purpose="hero-photo-mosaic">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[320px] sm:h-[420px] md:h-[480px]">
                {/*  Large Left Hero Photo  */}
                <div className="md:col-span-2 h-full overflow-hidden">
                    <Link to="/photo-tour" className="block w-full h-full">
                        <img alt={hero?.caption ?? 'Living room'}
                            className="photo-mosaic-item w-full h-full object-cover object-left cursor-pointer"
                            src={hero?.url ?? '/images/lr1.jpeg'} />
                    </Link>
                </div>
                {/*  Middle Column Photos  */}
                <div className="hidden md:flex flex-col gap-2 h-full">
                    <div className="h-1/2 overflow-hidden">
                        <Link to="/photo-tour" className="block w-full h-full">
                            <img alt={pick2?.caption ?? 'Bedroom'}
                                className="photo-mosaic-item w-full h-full object-cover object-top cursor-pointer"
                                src={pick2?.url ?? '/images/b1.jpeg'} />
                        </Link>
                    </div>
                    <div className="h-1/2 overflow-hidden">
                        <Link to="/photo-tour" className="block w-full h-full">
                            <img alt={pick3?.caption ?? 'Kitchen'}
                                className="photo-mosaic-item w-full h-full object-cover object-left cursor-pointer"
                                src={pick3?.url ?? '/images/k1.jpeg'} />
                        </Link>
                    </div>
                </div>
                {/*  Right Column Photos  */}
                <div className="hidden md:flex flex-col gap-2 h-full">
                    <div className="h-1/2 overflow-hidden">
                        <Link to="/photo-tour" className="block w-full h-full">
                            <img alt={pick4?.caption ?? 'Pool'}
                                className="photo-mosaic-item w-full h-full object-cover object-right-top cursor-pointer"
                                src={pick4?.url ?? '/images/p1.jpeg'} />
                        </Link>
                    </div>
                    <div className="h-1/2 overflow-hidden">
                        <Link to="/photo-tour" className="block w-full h-full">
                            <img alt={pick5?.caption ?? 'Exterior'}
                                className="photo-mosaic-item w-full h-full object-cover object-right-bottom cursor-pointer"
                                src={pick5?.url ?? '/images/e1.jpeg'} />
                        </Link>
                    </div>
                </div>
            </div>
            {/*  "Show all photos" Button  */}
            <Link
                className="absolute bottom-5 right-5 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-900 px-3.5 py-1.5 rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 transition"
                 to="/photo-tour">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <circle cx="2" cy="2" r="1.5" />
                    <circle cx="8" cy="2" r="1.5" />
                    <circle cx="14" cy="2" r="1.5" />
                    <circle cx="2" cy="8" r="1.5" />
                    <circle cx="8" cy="8" r="1.5" />
                    <circle cx="14" cy="8" r="1.5" />
                    <circle cx="2" cy="14" r="1.5" />
                    <circle cx="8" cy="14" r="1.5" />
                    <circle cx="14" cy="14" r="1.5" />
                </svg>
                Show all photos
            </Link>
        </section>
        {/*  END: PhotoGalleryGrid  */}
        {/*  BEGIN: ListingContentTwoColumns  */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
            {/*  Left Column: Details  */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-7">
                {/*  Listing Subtitle  */}
                <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900">Entire serviced apartment in
                        Candolim, India</h2>
                    <p className="text-neutral-700 text-sm mt-1">3 guests · 1 bedroom · 1 bed · 1 bathroom</p>
                </div>
                {/*  Guest Favourite Card Badge  */}
                <div className="border border-neutral-300 rounded-2xl p-5 sm:p-6 flex items-center justify-between shadow-xs bg-white"
                    data-purpose="guest-favourite-banner">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center justify-center shrink-0 w-16">
                            <img src="/logos/guest_favourite_badge.png" alt="Guest favourite" className="h-10 sm:h-12 object-contain" />
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-600 max-w-[210px] sm:max-w-xs leading-snug">
                            One of the most loved homes on Airbnb, according to guests
                        </p>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6 border-l border-neutral-200 pl-4 sm:pl-6 text-right shrink-0">
                        <div className="text-center">
                            <div className="text-lg font-bold text-neutral-900 leading-tight">4.95</div>
                            <div className="text-[10px] text-neutral-900 tracking-tighter mt-0.5">★★★★★</div>
                        </div>
                        <div className="border-l border-neutral-200 pl-4 sm:pl-6 text-center">
                            <div className="text-lg font-bold text-neutral-900 leading-tight">19</div>
                            <div className="text-xs text-neutral-600 underline">Reviews</div>
                        </div>
                    </div>
                </div>
                {/*  Host Avatar & Info  */}
                <div className="flex items-center gap-4 py-3 border-y border-neutral-200">
                    <div
                        className="w-13 h-13 w-12 h-12 rounded-full bg-[#183a37] text-white flex items-center justify-center font-bold text-xs tracking-wider text-center p-1 border border-neutral-200">
                        <span className="scale-75 uppercase">Mirashya</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-neutral-900">Hosted by Mirashya Homes</h3>
                        <p className="text-neutral-500 text-sm">2 years hosting</p>
                    </div>
                </div>
                {/*  Highlight Features  */}
                <div className="space-y-5 pb-6 border-b border-neutral-200 text-sm" data-purpose="highlights-list">
                    <div className="flex items-start gap-4">
                        <svg className="w-6 h-6 text-neutral-800 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor"
                            strokeWidth="1.5" viewBox="0 0 24 24">
                            <path
                                d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
                                strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div>
                            <p className="font-semibold text-neutral-900">Outdoor entertainment</p>
                            <p className="text-neutral-500 text-xs sm:text-sm">The pool and alfresco dining are great for
                                summer trips.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <svg className="w-6 h-6 text-neutral-800 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor"
                            strokeWidth="1.5" viewBox="0 0 24 24">
                            <path
                                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                                strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div>
                            <p className="font-semibold text-neutral-900">Designed for staying cool</p>
                            <p className="text-neutral-500 text-xs sm:text-sm">Beat the heat with the A/C and ceiling fan.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <svg className="w-6 h-6 text-neutral-800 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor"
                            strokeWidth="1.5" viewBox="0 0 24 24">
                            <path d="M8 4h8a2 2 0 012 2v14H6V6a2 2 0 012-2z M15 12h.01" strokeLinecap="round"
                                strokeLinejoin="round" />
                        </svg>
                        <div>
                            <p className="font-semibold text-neutral-900">Self check-in</p>
                            <p className="text-neutral-500 text-xs sm:text-sm">You can check in with the building staff.</p>
                        </div>
                    </div>
                </div>
                {/*  Translation Notice  */}
                <div
                    className="bg-neutral-100/70 p-4 rounded-xl text-xs sm:text-sm text-neutral-700 flex items-center justify-between">
                    <span>Some info has been automatically translated. <button
                            className="font-semibold underline ml-1 hover:text-neutral-900">Show original</button></span>
                </div>
                {/*  Property Description  */}
                <div className="space-y-4 pb-8 border-b border-neutral-200">
                    <p className="text-sm leading-relaxed text-neutral-800">
                        🌴 Plan Your Relaxing Holiday at Amor De Goa by Mirashya Homes! ✨ Stay in this cozy 1BHK in the
                        heart of Candolim, featuring a private jacuzzi 🛁 for the perfect unwind. Enjoy high-speed WiFi
                        💻, Smart TV 📺, pet-friendly comfort 🐾, and stylish interiors. Just minutes from Candolim
                        Beach 🏖️, popular cafés, restaurants, and nightlife 🍹, it's ideal for couples or small
                        families...
                    </p>
                    <button
                        className="font-semibold underline flex items-center gap-1 text-sm text-neutral-900 hover:text-black">
                        Show more
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
                {/*  Where you'll sleep  */}
                <div className="py-6 border-b border-neutral-200" id="sleep-section">
                    <h3 className="text-xl font-bold text-neutral-900 mb-5">Where you'll sleep</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/*  Card 1: Bedroom  */}
                        <div
                            className="border border-neutral-200 rounded-xl overflow-hidden p-3.5 hover:shadow-sm transition">
                            <div className="rounded-lg overflow-hidden h-44 mb-3">
                                <img alt="Bedroom with double bed" className="w-full h-full object-cover object-left"
                                    src="/images/lr2.jpeg" />
                            </div>
                            <h4 className="font-semibold text-neutral-900 text-sm">Bedroom</h4>
                            <p className="text-neutral-500 text-xs mt-0.5">1 double bed</p>
                        </div>
                        {/*  Card 2: Living Room  */}
                        <div
                            className="border border-neutral-200 rounded-xl overflow-hidden p-3.5 hover:shadow-sm transition">
                            <div className="rounded-lg overflow-hidden h-44 mb-3">
                                <img alt="Living room with comfortable sofa"
                                    className="w-full h-full object-cover object-right"
                                    src="/images/a1.jpeg" />
                            </div>
                            <h4 className="font-semibold text-neutral-900 text-sm">Living room</h4>
                            <p className="text-neutral-500 text-xs mt-0.5">1 sofa</p>
                        </div>
                    </div>
                </div>
                {/*  Amenities Section  */}
                <div className="py-6 border-b border-neutral-200" id="amenities-section">
                    <h3 className="text-xl font-bold text-neutral-900 mb-6">What this place offers</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                        <div className="flex items-center gap-4">
                            <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="1.5"
                                viewBox="0 0 24 24">
                                <path
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Kitchen</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="1.5"
                                viewBox="0 0 24 24">
                                <path
                                    d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Wifi</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="1.5"
                                viewBox="0 0 24 24">
                                <path
                                    d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Dedicated workspace</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="1.5"
                                viewBox="0 0 24 24">
                                <path
                                    d="M8 7h8m-8 5h8m-8 5h8M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Free parking on premises</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="1.5"
                                viewBox="0 0 24 24">
                                <path
                                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Pool</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="1.5"
                                viewBox="0 0 24 24">
                                <path
                                    d="M4 16h16M4 20h16M5 12h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v3a2 2 0 002 2z"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Hot tub</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="1.5"
                                viewBox="0 0 24 24">
                                <path
                                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Pets allowed</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="1.5"
                                viewBox="0 0 24 24">
                                <path
                                    d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Exterior security cameras on property</span>
                        </div>
                        <div className="flex items-center gap-4 text-neutral-400">
                            <span className="line-through flex items-center gap-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                        strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Carbon monoxide alarm
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-neutral-400">
                            <span className="line-through flex items-center gap-4">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5"
                                    viewBox="0 0 24 24">
                                    <path
                                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                        strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Smoke alarm
                            </span>
                        </div>
                    </div>
                    <div className="mt-8">
                        <button
                            className="border border-neutral-900 text-neutral-900 font-semibold px-6 py-3 rounded-lg text-sm hover:bg-neutral-50 transition" onClick={() => setIsAmenitiesModalOpen(true)}>
                            Show all 50 amenities
                        </button>
                    </div>
                </div>
                {/*  Availability Calendar Section  */}
                <div className="py-8 border-b border-neutral-200" id="calendar-section">
                    <div className="mb-4">
                        <h3 className="text-xl font-bold text-neutral-900">5 nights in Candolim</h3>
                        <p className="text-xs text-neutral-500 mt-0.5">18 Oct 2026 - 23 Oct 2026</p>
                    </div>
                    {/*  Calendar Grid Container  */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                        {/*  October 2026  */}
                        <div>
                            <div className="flex items-center justify-between font-semibold text-sm mb-4 px-2">
                                <button aria-label="Previous Month" className="p-1 hover:bg-neutral-100 rounded-full">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"
                                        viewBox="0 0 24 24">
                                        <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <span>October 2026</span>
                                <span className="w-4"></span>
                            </div>
                            <div className="grid grid-cols-7 text-center text-xs text-neutral-500 font-medium mb-2">
                                <div>S</div>
                                <div>M</div>
                                <div>T</div>
                                <div>W</div>
                                <div>T</div>
                                <div>F</div>
                                <div>S</div>
                            </div>
                            <div className="grid grid-cols-7 text-center text-xs gap-y-1 font-semibold">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div className="py-2">1</div>
                                <div className="py-2">2</div>
                                <div className="py-2">3</div>
                                <div className="py-2">4</div>
                                <div className="py-2">5</div>
                                <div className="py-2">6</div>
                                <div className="py-2">7</div>
                                <div className="py-2">8</div>
                                <div className="py-2">9</div>
                                <div className="py-2">10</div>
                                <div className="py-2">11</div>
                                <div className="py-2">12</div>
                                <div className="py-2">13</div>
                                <div className="py-2">14</div>
                                <div className="py-2">15</div>
                                <div className="py-2">16</div>
                                <div className="py-2">17</div>
                                {/*  Selected Range: 18 - 23  */}
                                <div className="py-2 calendar-day-selected">18</div>
                                <div className="py-2 calendar-day-in-range">19</div>
                                <div className="py-2 calendar-day-in-range">20</div>
                                <div className="py-2 calendar-day-in-range">21</div>
                                <div className="py-2 calendar-day-in-range">22</div>
                                <div className="py-2 calendar-day-selected">23</div>
                                <div className="py-2">24</div>
                                <div className="py-2">25</div>
                                <div className="py-2">26</div>
                                <div className="py-2">27</div>
                                <div className="py-2">28</div>
                                <div className="py-2">29</div>
                                <div className="py-2">30</div>
                                <div className="py-2">31</div>
                            </div>
                        </div>
                        {/*  November 2026  */}
                        <div>
                            <div className="flex items-center justify-between font-semibold text-sm mb-4 px-2">
                                <span className="w-4"></span>
                                <span>November 2026</span>
                                <button aria-label="Next Month" className="p-1 hover:bg-neutral-100 rounded-full">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"
                                        viewBox="0 0 24 24">
                                        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                            <div className="grid grid-cols-7 text-center text-xs text-neutral-500 font-medium mb-2">
                                <div>S</div>
                                <div>M</div>
                                <div>T</div>
                                <div>W</div>
                                <div>T</div>
                                <div>F</div>
                                <div>S</div>
                            </div>
                            <div className="grid grid-cols-7 text-center text-xs gap-y-1 font-semibold">
                                <div className="py-2">1</div>
                                <div className="py-2">2</div>
                                <div className="py-2">3</div>
                                <div className="py-2">4</div>
                                <div className="py-2">5</div>
                                <div className="py-2">6</div>
                                <div className="py-2">7</div>
                                <div className="py-2">8</div>
                                <div className="py-2">9</div>
                                <div className="py-2">10</div>
                                <div className="py-2">11</div>
                                <div className="py-2">12</div>
                                <div className="py-2">13</div>
                                <div className="py-2">14</div>
                                <div className="py-2">15</div>
                                <div className="py-2">16</div>
                                <div className="py-2">17</div>
                                <div className="py-2 text-neutral-300 line-through">18</div>
                                <div className="py-2 text-neutral-300 line-through">19</div>
                                <div className="py-2 text-neutral-300 line-through">20</div>
                                <div className="py-2 text-neutral-300 line-through">21</div>
                                <div className="py-2 text-neutral-300 line-through">22</div>
                                <div className="py-2 text-neutral-300 line-through">23</div>
                                <div className="py-2 text-neutral-300 line-through">24</div>
                                <div className="py-2">25</div>
                                <div className="py-2">26</div>
                                <div className="py-2">27</div>
                                <div className="py-2">28</div>
                                <div className="py-2 text-neutral-300 line-through">29</div>
                                <div className="py-2 text-neutral-300 line-through">30</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <button aria-label="Toggle keyboard navigation" className="p-1 hover:bg-neutral-100 rounded-md">
                            <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="1.5"
                                viewBox="0 0 24 24">
                                <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" strokeLinecap="round"
                                    strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button className="text-xs font-semibold underline text-neutral-800 hover:text-black">Clear
                            dates</button>
                    </div>
                </div>
            </div>
            {/*  Right Column: Sticky Booking Widget  */}
            <div className="lg:col-span-5 xl:col-span-4 relative">
                <aside className="sticky top-28 space-y-4" data-purpose="reservation-card-sidebar">
                    {/*  Promo Banner  */}
                    <div
                        className="border border-neutral-200 rounded-2xl p-4 flex items-center justify-between shadow-xs bg-white">
                        <div className="flex items-center gap-3">
                            <div className="text-green-600 bg-green-50 p-2 rounded-lg">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path
                                        d="M12.97 2.59a1.5 1.5 0 00-1.06-.44H4.5A2.5 2.5 0 002 4.65v7.41c0 .4.16.78.44 1.06l8.88 8.88a2.5 2.5 0 003.54 0l6.59-6.59a2.5 2.5 0 000-3.54l-8.48-8.88zm-6.47 4.91a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                                    
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-neutral-900">Get 10% off your next stay.</p>
                                <a className="text-xs text-neutral-600 underline" href="#">Terms apply</a>
                            </div>
                        </div>
                        <button
                            className="border border-neutral-300 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-neutral-50 transition">Claim</button>
                    </div>
                    {/*  Main Booking Card  */}
                    <div className="border border-neutral-300 rounded-2xl p-6 shadow-xl bg-white">
                        <div className="flex items-baseline justify-between mb-5">
                            <div>
                                <span className="text-2xl font-bold text-neutral-900 underline decoration-1">₹28,499</span>
                                <span className="text-neutral-500 text-sm ml-1">for 5 nights</span>
                            </div>
                        </div>
                        {/*  Date and Guest Input Box  */}
                        <div className="border border-neutral-400 rounded-xl overflow-hidden mb-4 text-xs font-medium">
                            <div className="grid grid-cols-2 border-b border-neutral-400">
                                <div className="p-2.5 border-r border-neutral-400">
                                    <span
                                        className="block text-[10px] font-extrabold tracking-wider text-neutral-800 uppercase">CHECK-IN</span>
                                    <span className="text-neutral-700 text-xs font-semibold">10/18/2026</span>
                                </div>
                                <div className="p-2.5">
                                    <span
                                        className="block text-[10px] font-extrabold tracking-wider text-neutral-800 uppercase">CHECKOUT</span>
                                    <span className="text-neutral-700 text-xs font-semibold">10/23/2026</span>
                                </div>
                            </div>
                            <div className="p-2.5 flex items-center justify-between">
                                <div>
                                    <span
                                        className="block text-[10px] font-extrabold tracking-wider text-neutral-800 uppercase">GUESTS</span>
                                    <span className="text-neutral-700 text-xs font-semibold">2 guests</span>
                                </div>
                                <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" strokeWidth="2"
                                    viewBox="0 0 24 24">
                                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                        {/*  Cancellation Note  */}
                        <div
                            className="bg-neutral-100 rounded-lg p-2.5 text-center text-xs text-neutral-700 mb-4 font-normal">
                            Free cancellation before <span className="font-bold">17 October</span>
                        </div>
                        {/*  CTA Button  */}
                        <button
                            className="w-full bg-[#E61E4D] hover:bg-[#D70466] text-white font-semibold py-3.5 rounded-xl text-base transition shadow-xs active:scale-[0.99] cursor-pointer">
                            Reserve
                        </button>
                        <p className="text-center text-xs text-neutral-500 mt-3 font-normal">You won't be charged yet</p>
                    </div>
                    {/*  Report Listing Link  */}
                    <div className="text-center pt-2">
                        <button
                            className="text-xs text-neutral-600 hover:text-neutral-900 inline-flex items-center gap-2 underline font-medium">
                            <svg className="w-3.5 h-3.5 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="2"
                                viewBox="0 0 24 24">
                                <path
                                    d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Report this listing
                        </button>
                    </div>
                </aside>
            </div>
        </div>
        {/*  END: ListingContentTwoColumns  */}
        {/*  BEGIN: GuestFavouriteBigBanner  */}
        <section className="mt-14 pt-10 border-t border-neutral-200 text-center" data-purpose="guest-favourite-statement">
            <div className="flex items-center justify-center mb-1">
                <img src="/logos/guest_favourite_laurel.png" alt="4.95 Guest favourite rating" className="h-28 sm:h-32 object-contain mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mt-2">Guest favourite</h3>
            <p className="text-neutral-600 text-sm max-w-md mx-auto mt-1">This home is a guest favourite based on ratings,
                reviews and reliability</p>
            <button className="text-xs font-semibold underline text-neutral-900 mt-2 inline-block">How reviews work</button>
        </section>
        {/*  END: GuestFavouriteBigBanner  */}
        {/*  BEGIN: RatingMetricsSection  */}
        <section className="mt-10 py-6 border-y border-neutral-200" data-purpose="category-ratings" id="reviews-section">
            <div
                className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200 text-neutral-900">
                {/*  Overall Rating Bar  */}
                <div className="pb-3 sm:pb-0 sm:pr-4">
                    <span className="text-xs font-bold block mb-2">Overall rating</span>
                    <div className="space-y-1 text-[11px] font-medium text-neutral-600">
                        <div className="flex items-center gap-2"><span>5</span>
                            <div className="w-20 bg-neutral-900 h-1 rounded-full"></div>
                        </div>
                        <div className="flex items-center gap-2"><span>4</span>
                            <div className="w-20 bg-neutral-200 h-1 rounded-full">
                                <div className="w-2 bg-neutral-900 h-1 rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2"><span>3</span>
                            <div className="w-20 bg-neutral-200 h-1 rounded-full"></div>
                        </div>
                        <div className="flex items-center gap-2"><span>2</span>
                            <div className="w-20 bg-neutral-200 h-1 rounded-full"></div>
                        </div>
                        <div className="flex items-center gap-2"><span>1</span>
                            <div className="w-20 bg-neutral-200 h-1 rounded-full"></div>
                        </div>
                    </div>
                </div>
                {/*  Cleanliness  */}
                <div className="pt-3 sm:pt-0 sm:px-4">
                    <span className="text-xs font-bold block text-neutral-600">Cleanliness</span>
                    <span className="text-lg font-extrabold block mt-0.5">5.0</span>
                    <div className="mt-2 text-neutral-800">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path
                                d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3"
                                strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                {/*  Accuracy  */}
                <div className="pt-3 sm:pt-0 sm:px-4">
                    <span className="text-xs font-bold block text-neutral-600">Accuracy</span>
                    <span className="text-lg font-extrabold block mt-0.5">5.0</span>
                    <div className="mt-2 text-neutral-800">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round"
                                strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                {/*  Check-in  */}
                <div className="pt-3 sm:pt-0 sm:px-4">
                    <span className="text-xs font-bold block text-neutral-600">Check-in</span>
                    <span className="text-lg font-extrabold block mt-0.5">5.0</span>
                    <div className="mt-2 text-neutral-800">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path
                                d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                                strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                {/*  Communication  */}
                <div className="pt-3 sm:pt-0 sm:px-4">
                    <span className="text-xs font-bold block text-neutral-600">Communication</span>
                    <span className="text-lg font-extrabold block mt-0.5">5.0</span>
                    <div className="mt-2 text-neutral-800">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path
                                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                                strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                {/*  Location  */}
                <div className="pt-3 sm:pt-0 sm:px-4">
                    <span className="text-xs font-bold block text-neutral-600">Location</span>
                    <span className="text-lg font-extrabold block mt-0.5">4.8</span>
                    <div className="mt-2 text-neutral-800">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path
                                d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                                strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                {/*  Value  */}
                <div className="pt-3 sm:pt-0 sm:px-4">
                    <span className="text-xs font-bold block text-neutral-600">Value</span>
                    <span className="text-lg font-extrabold block mt-0.5">4.8</span>
                    <div className="mt-2 text-neutral-800">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path
                                d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.386l4.475-2.628a2.25 2.25 0 00.865-1.228 2.25 2.25 0 00-.386-2.186L11.16 3.659A2.25 2.25 0 009.568 3z"
                                strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
        {/*  END: RatingMetricsSection  */}
        {/*  BEGIN: ReviewPillFilters  */}
        <section
            className="py-6 overflow-x-auto custom-scrollbar flex items-center gap-2 text-xs font-medium text-neutral-700"
            data-purpose="review-topic-tags">
            <button
                className="flex items-center gap-1.5 px-3 py-2 border border-neutral-300 rounded-full hover:border-neutral-900 transition flex-shrink-0">
                <span>🛋️</span> <span>Comfort</span> <span className="text-neutral-400">6</span>
            </button>
            <button
                className="flex items-center gap-1.5 px-3 py-2 border border-neutral-300 rounded-full hover:border-neutral-900 transition flex-shrink-0">
                <span>✅</span> <span>Accuracy</span> <span className="text-neutral-400">5</span>
            </button>
            <button
                className="flex items-center gap-1.5 px-3 py-2 border border-neutral-300 rounded-full hover:border-neutral-900 transition flex-shrink-0">
                <span>🛁</span> <span>Hot tub</span> <span className="text-neutral-400">5</span>
            </button>
            <button
                className="flex items-center gap-1.5 px-3 py-2 border border-neutral-300 rounded-full hover:border-neutral-900 transition flex-shrink-0">
                <span>🧼</span> <span>Condition</span> <span className="text-neutral-400">4</span>
            </button>
            <button
                className="flex items-center gap-1.5 px-3 py-2 border border-neutral-300 rounded-full hover:border-neutral-900 transition flex-shrink-0">
                <span>🎁</span> <span>Hospitality</span> <span className="text-neutral-400">8</span>
            </button>
            <button
                className="flex items-center gap-1.5 px-3 py-2 border border-neutral-300 rounded-full hover:border-neutral-900 transition flex-shrink-0">
                <span>🧹</span> <span>Cleanliness</span> <span className="text-neutral-400">4</span>
            </button>
            <button
                className="flex items-center gap-1.5 px-3 py-2 border border-neutral-300 rounded-full hover:border-neutral-900 transition flex-shrink-0">
                <span>🎂</span> <span>Amenities</span> <span className="text-neutral-400">2</span>
            </button>
        </section>
        {/*  END: ReviewPillFilters  */}
        {/*  BEGIN: ReviewsGrid  */}
        <section className="pb-10 border-b border-neutral-200" data-purpose="guest-reviews">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-10">
                {/*  Review 1: Amit  */}
                <article className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm">
                            A</div>
                        <div>
                            <h4 className="font-semibold text-sm text-neutral-900">Amit</h4>
                            <p className="text-xs text-neutral-500">2 months on Airbnb</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-700">
                        <span>★★★★★</span>
                        <span>·</span>
                        <span>1 week ago</span>
                    </div>
                    <p className="text-sm text-neutral-800 leading-relaxed">
                        Very helpful and responsive team. Safe and peaceful stay. loved everything about the property.
                    </p>
                </article>
                {/*  Review 2: Aheesh  */}
                <article className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm">
                            <span className="scale-90">AH</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm text-neutral-900">Aheesh</h4>
                            <p className="text-xs text-neutral-500">3 years on Airbnb</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-700">
                        <span>★★★★★</span>
                        <span>·</span>
                        <span>2 weeks ago</span>
                    </div>
                    <p className="text-sm text-neutral-800 leading-relaxed">
                        We had a wonderful stay. The apartment was clean, comfortable, and exactly as shown in the
                        photos. The host was very responsive and helpful throughout our stay. We would definitely
                        recommend this place and would love to stay here again.
                    </p>
                    <button className="text-xs font-semibold underline text-neutral-900">Show more</button>
                </article>
                {/*  Review 3: Samiksha  */}
                <article className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center text-sm">
                            S</div>
                        <div>
                            <h4 className="font-semibold text-sm text-neutral-900">Samiksha</h4>
                            <p className="text-xs text-neutral-500">8 months on Airbnb</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-700">
                        <span>★★★★★</span>
                        <span>·</span>
                        <span>May 2026</span>
                    </div>
                    <p className="text-sm text-neutral-800 leading-relaxed">
                        the host nitish was really great help
                    </p>
                </article>
                {/*  Review 4: Vedant  */}
                <article className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-sm">
                            V</div>
                        <div>
                            <h4 className="font-semibold text-sm text-neutral-900">Vedant</h4>
                            <p className="text-xs text-neutral-500">4 years on Airbnb</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-700">
                        <span>★★★★★</span>
                        <span>·</span>
                        <span>May 2026</span>
                    </div>
                    <p className="text-sm text-neutral-800 leading-relaxed">
                        We had an amazing stay at this property in Goa! The entire home was spotless and exceptionally
                        well-maintained, making us feel comfortable from the moment we arrived. The cleanliness
                        standards were truly impressive, with every corner of the house looking fresh and pristine....
                    </p>
                    <button className="text-xs font-semibold underline text-neutral-900">Show more</button>
                </article>
                {/*  Review 5: Vaibhav S  */}
                <article className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                            VS</div>
                        <div>
                            <h4 className="font-semibold text-sm text-neutral-900">Vaibhav S</h4>
                            <p className="text-xs text-neutral-500">3 years on Airbnb</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-700">
                        <span>★★★★★</span>
                        <span>·</span>
                        <span>May 2026</span>
                    </div>
                    <p className="text-sm text-neutral-800 leading-relaxed">
                        Great great experience living out there , can't expect more , will always look for it in the
                        future and will recommend my friends too.
                    </p>
                </article>
                {/*  Review 6: Mohd  */}
                <article className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-sm">
                            M</div>
                        <div>
                            <h4 className="font-semibold text-sm text-neutral-900">Mohd</h4>
                            <p className="text-xs text-neutral-500">5 years on Airbnb</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-700">
                        <span>★★★★★</span>
                        <span>·</span>
                        <span>May 2026</span>
                    </div>
                    <p className="text-sm text-neutral-800 leading-relaxed">
                        Great place. Exactly as described in the listing.
                    </p>
                </article>
            </div>
            <div className="mt-8">
                <button
                    className="border border-neutral-900 text-neutral-900 font-semibold px-6 py-3 rounded-lg text-sm hover:bg-neutral-50 transition">
                    Show all 19 reviews
                </button>
            </div>
        </section>
        {/*  END: ReviewsGrid  */}
        {/*  BEGIN: WhereYoullBeSection  */}
        <section className="py-10 border-b border-neutral-200" data-purpose="map-and-location" id="location-section">
            <h3 className="text-xl font-bold text-neutral-900">Where you'll be</h3>
            <p className="text-sm text-neutral-700 mt-1 mb-6">Candolim, Goa, India</p>
            {/*  Simulated Map Box  */}
            <div
                className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden bg-[#e5f0f0] border border-neutral-200">
                {/*  SVG Map Background Representation  */}
                <svg className="w-full h-full object-cover" preserveAspectRatio="none" viewBox="0 0 800 400">
                    <defs>
                        <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d5e8e8" strokeWidth="0.8" />
                        </pattern>
                    </defs>
                    {/*  Water Coastline  */}
                    <path d="M0 0 L 320 0 L 220 400 L 0 400 Z" fill="#b9ddf2" />
                    {/*  Land Area  */}
                    <path d="M320 0 L 800 0 L 800 400 L 220 400 Z" fill="#e9f3ea" />
                    {/*  Grid Overlay  */}
                    <rect fill="url(#grid)" height="400" width="800"></rect>
                    {/*  Subtle Green Radius Circles  */}
                    <circle cx="280" cy="300" fill="#c3e4c7" opacity="0.6" r="45" />
                    <circle cx="520" cy="360" fill="#c3e4c7" opacity="0.6" r="55" />
                </svg>
                {/*  Center Airbnb Pin  */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div
                        className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center text-white shadow-xl ring-4 ring-white">
                        <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                        </svg>
                    </div>
                </div>
                {/*  Map Controls  */}
                <div className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow-md border border-neutral-200">
                    <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" strokeWidth="2"
                        viewBox="0 0 24 24">
                        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round"
                            strokeLinejoin="round" />
                    </svg>
                </div>
                <div
                    className="absolute top-4 right-4 bg-white rounded-lg shadow-md border border-neutral-200 flex flex-col divide-y divide-neutral-200">
                    <button className="p-2 hover:bg-neutral-50 text-neutral-700 font-bold text-base leading-none">+</button>
                    <button className="p-2 hover:bg-neutral-50 text-neutral-700 font-bold text-base leading-none">-</button>
                </div>
            </div>
            <div className="mt-5 space-y-2">
                <h4 className="font-semibold text-sm text-neutral-900">Neighborhood highlights</h4>
                <p className="text-sm text-neutral-700 leading-relaxed max-w-3xl">
                    Located in the vibrant area of Candolim, Goa, you'll be within easy reach of sandy beaches, buzzing
                    beach shacks, lively nightlife, and popular cafes.
                </p>
                <button className="font-semibold underline text-sm text-neutral-900 inline-flex items-center gap-1 mt-1">
                    Show more
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </section>
        {/*  END: WhereYoullBeSection  */}
        {/*  BEGIN: MeetYourHostSection  */}
        <section className="py-10 border-b border-neutral-200" data-purpose="host-profile">
            <h3 className="text-xl font-bold text-neutral-900 mb-6">Meet your host</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/*  Host Profile Card  */}
                <div
                    className="border border-neutral-200 rounded-3xl p-6 bg-neutral-50 flex flex-col items-center text-center shadow-xs">
                    <div className="relative mb-3">
                        <div
                            className="w-24 h-24 rounded-full bg-[#183a37] text-white flex items-center justify-center font-bold text-sm tracking-wider uppercase border-2 border-white shadow-md">
                            Mirashya
                        </div>
                        <div className="absolute bottom-0 right-0 bg-airbnb text-white p-1.5 rounded-full shadow">
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path
                                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                
                            </svg>
                        </div>
                    </div>
                    <h4 className="text-xl font-extrabold text-neutral-900">Mirashya Homes</h4>
                    <p className="text-xs text-neutral-500 font-medium">Host</p>
                    <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-4 border-t border-neutral-200 text-left">
                        <div>
                            <div className="text-lg font-bold text-neutral-900">1,137</div>
                            <div className="text-[11px] text-neutral-500">Reviews</div>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-neutral-900">4.92 ★</div>
                            <div className="text-[11px] text-neutral-500">Rating</div>
                        </div>
                        <div className="col-span-2">
                            <div className="text-lg font-bold text-neutral-900">2</div>
                            <div className="text-[11px] text-neutral-500">Years hosting</div>
                        </div>
                    </div>
                </div>
                {/*  Co-Hosts & Host Details  */}
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <h4 className="font-semibold text-sm text-neutral-900 mb-3">Co-hosts</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="flex items-center gap-2.5">
                                <div
                                    className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-700 font-bold flex items-center justify-center text-xs">
                                    A</div>
                                <span className="text-xs font-semibold text-neutral-800">Ashish</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div
                                    className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-700 font-bold flex items-center justify-center text-xs">
                                    N</div>
                                <span className="text-xs font-semibold text-neutral-800">Nitish</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div
                                    className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-700 font-bold flex items-center justify-center text-xs">
                                    P</div>
                                <span className="text-xs font-semibold text-neutral-800">Prashant</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div
                                    className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-700 font-bold flex items-center justify-center text-xs">
                                    R</div>
                                <span className="text-xs font-semibold text-neutral-800">Rahul</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <div
                                    className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-700 font-bold flex items-center justify-center text-xs">
                                    V</div>
                                <span className="text-xs font-semibold text-neutral-800">Varun</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2 text-sm text-neutral-800">
                        <h4 className="font-semibold text-neutral-900">Host details</h4>
                        <p className="text-xs text-neutral-600">Response rate: 100%</p>
                        <p className="text-xs text-neutral-600">Responds within an hour</p>
                    </div>
                    <div>
                        <button
                            className="bg-neutral-900 hover:bg-black text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition">
                            Message Host
                        </button>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 pt-2 border-t border-neutral-200">
                        <svg className="w-4 h-4 text-airbnb" fill="none" stroke="currentColor" strokeWidth="2"
                            viewBox="0 0 24 24">
                            <path
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>To protect your payment, never transfer money or communicate outside of the Airbnb website
                            or app.</span>
                    </div>
                </div>
            </div>
        </section>
        {/*  END: MeetYourHostSection  */}
        {/*  BEGIN: ThingsToKnowSection  */}
        <section className="py-10 border-b border-neutral-200" data-purpose="policies-and-rules">
            <h3 className="text-xl font-bold text-neutral-900 mb-6">Things to know</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                {/*  Cancellation policy  */}
                <div className="space-y-2.5">
                    <div className="text-neutral-900 font-semibold flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path
                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                                strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Cancellation policy
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                        Free cancellation before 17 October. Cancel before check-in on 18 October for a partial refund.
                    </p>
                    <p className="text-xs text-neutral-600">Review this host's full policy for details.</p>
                    <button className="font-semibold underline text-xs text-neutral-900 block pt-1">Learn more</button>
                </div>
                {/*  House rules  */}
                <div className="space-y-2.5">
                    <div className="text-neutral-900 font-semibold flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path
                                d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                                strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        House rules
                    </div>
                    <p className="text-xs text-neutral-600">Check-in after 2:00 pm</p>
                    <p className="text-xs text-neutral-600">Checkout before 11:00 am</p>
                    <p className="text-xs text-neutral-600">3 guests maximum</p>
                    <button className="font-semibold underline text-xs text-neutral-900 block pt-1">Learn more</button>
                </div>
                {/*  Safety & property  */}
                <div className="space-y-2.5">
                    <div className="text-neutral-900 font-semibold flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path
                                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                                strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Safety &amp; property
                    </div>
                    <p className="text-xs text-neutral-600">Carbon monoxide alarm not reported</p>
                    <p className="text-xs text-neutral-600">Smoke alarm not reported</p>
                    <p className="text-xs text-neutral-600">Exterior security cameras on property</p>
                    <button className="font-semibold underline text-xs text-neutral-900 block pt-1">Learn more</button>
                </div>
            </div>
        </section>
        {/*  END: ThingsToKnowSection  */}
        {/*  BEGIN: MoreStaysNearbySection  */}
        <section className="py-10" data-purpose="nearby-recommendations">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-neutral-900">More stays nearby</h3>
                <div className="flex items-center gap-3 text-xs font-semibold">
                    <span className="text-neutral-500">1 / 2</span>
                    <button aria-label="Previous Page"
                        className="p-2 border border-neutral-300 rounded-full hover:border-neutral-900 transition">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button aria-label="Next Page"
                        className="p-2 border border-neutral-300 rounded-full hover:border-neutral-900 transition">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
            {/*  Carousel Cards Grid  */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/*  Stay Card 1  */}
                <div className="group cursor-pointer">
                    <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-neutral-100 relative">
                        <img alt="Beautiful Studio with a view to die for"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            src="/images/lr3.jpeg" />
                        <button aria-label="Save listing"
                            className="absolute top-2.5 right-2.5 text-white/90 hover:text-white">
                            <svg className="w-5 h-5 drop-shadow stroke-2" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    <h4 className="font-semibold text-xs text-neutral-900 line-clamp-1">Beautiful Studio with a view to die
                        for</h4>
                    <p className="text-xs text-neutral-600 mt-0.5"><span className="font-bold text-neutral-900">₹23,600</span> ·
                        ★ 4.91</p>
                </div>
                {/*  Stay Card 2  */}
                <div className="group cursor-pointer">
                    <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-neutral-100 relative">
                        <img alt="NAQAB - 1bhk with private pool"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            src="/images/e2.jpeg" />
                        <button aria-label="Save listing"
                            className="absolute top-2.5 right-2.5 text-white/90 hover:text-white">
                            <svg className="w-5 h-5 drop-shadow stroke-2" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    <h4 className="font-semibold text-xs text-neutral-900 line-clamp-1">NAQAB - 1bhk with private pool</h4>
                    <p className="text-xs text-neutral-600 mt-0.5"><span className="font-bold text-neutral-900">₹42,218</span> ·
                        ★ 4.95</p>
                </div>
                {/*  Stay Card 3  */}
                <div className="group cursor-pointer">
                    <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-neutral-100 relative">
                        <img alt="Greentique Luxury Flat with plunge pool, Calangute"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            src="/images/p2.jpeg" />
                        <button aria-label="Save listing"
                            className="absolute top-2.5 right-2.5 text-white/90 hover:text-white">
                            <svg className="w-5 h-5 drop-shadow stroke-2" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    <h4 className="font-semibold text-xs text-neutral-900 line-clamp-1">Greentique Luxury Flat with plunge
                        pool</h4>
                    <p className="text-xs text-neutral-600 mt-0.5"><span className="font-bold text-neutral-900">₹44,506</span> ·
                        ★ 4.94</p>
                </div>
                {/*  Stay Card 4  */}
                <div className="group cursor-pointer">
                    <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-neutral-100 relative">
                        <img alt="The Tropical Studio | 5 mins to Beach"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            src="/images/g1.jpeg" />
                        <button aria-label="Save listing"
                            className="absolute top-2.5 right-2.5 text-white/90 hover:text-white">
                            <svg className="w-5 h-5 drop-shadow stroke-2" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    <h4 className="font-semibold text-xs text-neutral-900 line-clamp-1">The Tropical Studio | 5 mins to
                        Beach</h4>
                    <p className="text-xs text-neutral-600 mt-0.5"><span className="font-bold text-neutral-900">₹22,824</span> ·
                        ★ 4.96</p>
                </div>
                {/*  Stay Card 5  */}
                <div className="group cursor-pointer">
                    <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-neutral-100 relative">
                        <img alt="Luxury Casa Bella 1BHK with plunge pool, Calangute"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            src="/images/b2.jpeg" />
                        <button aria-label="Save listing"
                            className="absolute top-2.5 right-2.5 text-white/90 hover:text-white">
                            <svg className="w-5 h-5 drop-shadow stroke-2" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                    <h4 className="font-semibold text-xs text-neutral-900 line-clamp-1">Luxury Casa Bella 1BHK with plunge
                        pool</h4>
                    <p className="text-xs text-neutral-600 mt-0.5"><span className="font-bold text-neutral-900">₹39,942</span> ·
                        ★ 4.95</p>
                </div>
            </div>
        </section>
        {/*  END: MoreStaysNearbySection  */}
    </main>
            <Footer />
            <AmenitiesModal isOpen={isAmenitiesModalOpen} onClose={() => setIsAmenitiesModalOpen(false)} />
        </div>
    );
}