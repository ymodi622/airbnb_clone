export default function Footer() {
    return (
        <footer className="border-t border-neutral-200 bg-[#F7F7F7] text-xs text-neutral-600" data-purpose="site-footer">
        <div
            className="max-w-[1280px] mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>© 2026 Airbnb, Inc.</span>
                <span>·</span>
                <a className="hover:underline" href="#void">Privacy</a>
                <span>·</span>
                <a className="hover:underline" href="#void">Terms</a>
                <span>·</span>
                <a className="hover:underline" href="#void">Sitemap</a>
                <span>·</span>
                <a className="hover:underline" href="#void">Company details</a>
            </div>
            <div className="flex items-center gap-6 font-semibold text-neutral-800">
                <button className="flex items-center gap-2 hover:underline">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                            strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    English (IN)
                </button>
                <button className="hover:underline">₹ INR</button>
            </div>
        </div>
    </footer>
    );
}