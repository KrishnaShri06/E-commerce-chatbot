import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff, CheckCircle, Mail, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const { user, signOut } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signedUp, setSignedUp] = useState(false);
  const navigate = useNavigate();


  const handle = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.toLowerCase().includes('not confirmed')) {
            throw new Error('Email not confirmed. Please check your inbox and click the confirmation link, or ask your admin to disable email confirmation in Supabase.');
          }
          throw error;
        }
        navigate('/profile');
      } else {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
        if (error) throw error;
        setSignedUp(true);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
      <div style={{ width: '100%', maxWidth: '900px', display: 'flex', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>
        {/* Left Panel */}
        <div style={{ flex: '0 0 380px', background: 'linear-gradient(145deg, #1e3a5f 0%, #2563eb 100%)', padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="sm:flex hidden">
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '24px' }}>🛒 ShopKart</div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', lineHeight: 1.25, marginBottom: '12px' }}>
              {isLogin ? 'Welcome back!' : 'Join us today!'}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.72)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              {isLogin
                ? 'Log in to access your orders, wishlist, and personalized recommendations.'
                : 'Create your account and start your shopping journey for free.'}
            </p>
          </div>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Free delivery on every order', 'Exclusive member discounts', 'Track orders in real time'].map(t => (
              <li key={t} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' }}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Panel */}
        <div style={{ flex: 1, background: '#fff', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

          {/* ── Already logged in banner ── */}
          {user && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-md)', padding: '16px 20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
                  {(user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600, marginBottom: '1px' }}>Currently signed in as</p>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to="/profile" className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                  Go to My Account
                </Link>
                <button
                  className="btn btn-sm"
                  style={{ border: '1.5px solid #bfdbfe', borderRadius: 'var(--radius-sm)', color: '#2563eb', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '6px', background: 'white' }}
                  onClick={async () => { await signOut(); }}
                >
                  <LogOut size={14} /> Switch Account
                </button>
              </div>
            </div>
          )}

          {/* ── Email confirmation screen ── */}
          {signedUp ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#16a34a' }}>
                <Mail size={28} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '10px' }}>Check your email</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
                We've sent a confirmation link to <strong>{email}</strong>.<br />
                Click it to activate your account, then come back to sign in.<br />
                <em style={{ fontSize: '0.8rem' }}>(Or ask your admin to disable email confirmation in Supabase.)</em>
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: '#16a34a', marginBottom: '28px' }}>
                <CheckCircle size={18} /> Account created successfully
              </div>
              <button
                className="btn btn-primary w-full"
                onClick={() => { setSignedUp(false); setIsLogin(true); setPassword(''); setError(null); }}
              >
                Go to Sign in
              </button>
            </div>

          ) : (
            /* ── Normal form ── */
            <>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>{isLogin ? 'Sign in' : 'Create account'}</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.9rem' }}>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button type="button" onClick={() => { setIsLogin(l => !l); setError(null); }} style={{ color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>

              {error && (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: '20px', fontSize: '0.875rem', color: '#dc2626' }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 2 }} /> {error}
                </div>
              )}

              <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {!isLogin && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>Full Name</label>
                    <input className="input" type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                )}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>Email</label>
                  <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input className="input" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: '44px' }} />
                    <button type="button" onClick={() => setShowPw(s => !s)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-full" style={{ marginTop: '8px' }} disabled={loading}>
                  {loading ? 'Please wait…' : (isLogin ? 'Sign in' : 'Create Account')}
                </button>
              </form>

              <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                By continuing, you agree to our <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Terms</span> and <span style={{ color: 'var(--primary)', cursor: 'pointer' }}>Privacy Policy</span>.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
