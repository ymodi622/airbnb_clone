import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

type WishlistItem = {
  id: number;
  title: string;
  subtitle: string;
  property_type: string;
  location: string;
  price_per_night: string;
  cover_photo: string;
};

export default function Wishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetch('http://localhost:4000/api/wishlist', {
        credentials: 'include'
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch wishlists');
        return res.json();
      })
      .then(data => {
        setItems(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="w-full bg-surface text-on-surface antialiased min-h-screen font-body-md">
        <Header />
        <main className="w-full pt-28 px-gutter-desktop max-w-[1280px] mx-auto flex justify-center py-20">
            <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
        </main>
      </div>
    );
  }

  return (
    <div className="w-full bg-surface text-on-surface antialiased min-h-screen font-body-md">
        <Header />
        <main className="w-full pt-28 px-gutter-desktop max-w-[1280px] mx-auto min-h-[calc(100vh-280px)] pb-20">
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-serif mb-8">Wishlists</h1>
            
            {items.length === 0 ? (
                <div className="flex flex-col items-start gap-4 mt-10 p-10 bg-surface-container-lowest rounded-3xl border border-outline-variant max-w-2xl">
                    <span className="material-symbols-outlined text-[48px] text-primary">heart_broken</span>
                    <h2 className="font-headline-sm text-headline-sm font-serif">No saved sanctuaries yet</h2>
                    <p className="font-body-md text-on-surface-variant max-w-md">
                        As you search, tap the heart icon to save your favorite places to stay and experiences to your wishlist.
                    </p>
                    <Link to="/" className="mt-4 px-6 py-3 bg-primary text-on-primary rounded-xl font-label-lg font-semibold hover:bg-[#7a3020] transition-colors">
                        Start exploring
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map(item => (
                        <Link to="/" key={item.id} className="group flex flex-col gap-3">
                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface-container-high">
                                <img src={item.cover_photo} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                <button className="absolute top-3 right-3 p-2 rounded-full focus:outline-none">
                                    <svg className="w-6 h-6 text-primary transition-all duration-300 hover:scale-110" fill="#933c29" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                </button>
                            </div>
                            <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="font-label-lg text-label-lg font-semibold truncate pr-2">{item.location}</h3>
                                    <div className="flex items-center gap-1 shrink-0">
                                        <span className="material-symbols-outlined text-[14px] text-primary" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                                        <span className="font-body-sm text-sm">4.98</span>
                                    </div>
                                </div>
                                <p className="font-body-sm text-on-surface-variant truncate">{item.subtitle || item.title}</p>
                                <p className="font-body-md mt-1"><span className="font-semibold">${item.price_per_night}</span> / night</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    </div>
  );
}
