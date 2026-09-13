import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export default function Header() {
    const { showToast } = useToast();
    return (
        <header className="sticky top-0 z-40 bg-white border-b border-neutral-200" data-purpose="global-header">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
            {/*  Airbnb Logo  */}
            <Link aria-label="Airbnb Home" className="flex items-center focus:outline-none hover:opacity-90 transition" to="/">
                <img src="/logos/airbnb_logo.webp" alt="Airbnb" className="h-8 object-contain" />
            </Link>
            {/*  Search Bar Capsule  */}
            <div
                className="hidden md:flex items-center border border-neutral-300 rounded-full py-2 px-2 pl-5 shadow-sm hover:shadow-md transition text-sm font-medium bg-white cursor-pointer gap-1"
                onClick={() => showToast()}
            >
                <button className="flex items-center gap-2 pr-4 border-r border-neutral-200 font-semibold hover:text-neutral-600 focus:outline-none">
                    <span className="text-lg leading-none">🏡</span>
                    <span className="text-neutral-900 font-semibold">Anywhere</span>
                </button>
                <button className="px-4 border-r border-neutral-200 font-semibold text-neutral-900 hover:text-neutral-600 focus:outline-none">Anytime</button>
                <button className="px-4 pr-3 text-neutral-500 font-normal hover:text-neutral-700 focus:outline-none">Add guests</button>
                <div className="bg-[#FF385C] hover:bg-[#E00B41] text-white w-8 h-8 rounded-full flex items-center justify-center transition shadow-xs">
                    <svg className="w-3.5 h-3.5 stroke-white stroke-[3]" fill="none" viewBox="0 0 24 24">
                        <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
            {/*  Right Actions  */}
            <div className="flex items-center gap-2">
                <button className="text-sm font-semibold hover:bg-neutral-100 py-2.5 px-4 rounded-full transition text-neutral-800"
                    onClick={() => showToast()} type="button">Become a host</button>
                <button aria-label="Choose a language" className="w-10 h-10 flex items-center justify-center bg-[#F1F1F1] hover:bg-neutral-200 rounded-full transition text-neutral-800"
                    onClick={() => showToast()}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"
                        viewBox="0 0 24 24">
                        <path
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                            strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <button aria-label="Menu" className="w-10 h-10 flex items-center justify-center bg-[#F1F1F1] hover:bg-neutral-200 rounded-full transition text-neutral-800"
                    onClick={() => showToast()}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    </header>
    );
}