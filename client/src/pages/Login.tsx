import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Fetch user data directly after login to sync context
      const meRes = await fetch(`${BASE_URL}/api/auth/me`, { credentials: 'include' });
      const meData = await meRes.json();
      setUser(meData.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-surface text-on-surface antialiased min-h-screen flex items-center justify-center font-body-md py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-10 relative z-10 border border-outline-variant">
            
            <div className="flex flex-col items-center mb-8">
                <Link
                    className="flex items-center gap-space-sm group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg py-space-xs mb-4"
                    data-path="sanctuary-overview" to="/">
                    <span
                        className="material-symbols-outlined text-primary text-[36px] transition-transform duration-200 group-hover:rotate-45">wb_sunny</span>
                </Link>
                <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface font-serif text-center mb-2">Welcome Back</h1>
                <p className="text-on-surface-variant font-body-md text-center">Sign in to your Solstice account</p>
            </div>

            {error && (
                <div className="bg-error-container text-on-error-container p-4 rounded-xl mb-6 text-sm font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                    <label className="block text-label-md font-semibold text-on-surface mb-2" htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-on-surface font-body-md"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label className="block text-label-md font-semibold text-on-surface mb-2" htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-on-surface font-body-md"
                        placeholder="••••••••"
                    />
                </div>
                
                <div className="flex justify-end mt-1 mb-2">
                    <button
                        type="button"
                        onClick={() => {
                            setEmail('root@solstice.com');
                            setPassword('root1234');
                        }}
                        className="text-primary hover:text-[#7a3020] font-label-md font-semibold transition-colors focus:outline-none focus:underline"
                    >
                        Use test root user credentials
                    </button>
                </div>
                
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-on-primary py-3.5 px-6 rounded-xl font-label-lg font-semibold hover:bg-[#7a3020] transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : 'Sign In'}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-on-surface-variant font-body-sm text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary hover:underline font-semibold transition-all">
                        Create one now
                    </Link>
                </p>
            </div>
        </div>
    </div>
  );
}
