import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, ShoppingBag, Heart, LogOut, Shield } from 'lucide-react';

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '32px' }}>
      <User size={48} style={{ color: 'var(--text-muted)', opacity: 0.4, marginBottom: '16px' }} />
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Not logged in</h2>
      <Link to="/auth" className="btn btn-primary" style={{ marginTop: '8px' }}>Login</Link>
    </div>
  );

  const initials = (user.user_metadata?.name || user.email || 'U').charAt(0).toUpperCase();
  const displayName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';

  return (
    <div style={{ paddingTop: '36px', paddingBottom: '64px' }}>
      <div className="container" style={{ maxWidth: 840 }}>
        {/* Profile card */}
        <div className="card" style={{ padding: '32px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '4px' }}>{displayName}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <Mail size={15} /> {user.email}
            </div>
          </div>
          <button
            onClick={async () => { await signOut(); navigate('/'); }}
            className="btn btn-outline btn-sm"
            style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
          >
            <LogOut size={15} /> Logout
          </button>
        </div>

        {/* Quick links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {[
            { to: '/orders', icon: <ShoppingBag size={22} />, label: 'My Orders', desc: 'View & track your orders' },
            { to: '/wishlist', icon: <Heart size={22} />, label: 'Wishlist', desc: 'Items you saved for later' },
          ].map(tile => (
            <Link key={tile.to} to={tile.to} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px', transition: 'all 180ms ease', textDecoration: 'none', color: 'inherit', border: '1px solid var(--border)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = ''; (e.currentTarget as HTMLElement).style.transform = ''; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: 'var(--blue-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                {tile.icon}
              </div>
              <div>
                <p style={{ fontWeight: 700, marginBottom: '2px' }}>{tile.label}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tile.desc}</p>
              </div>
            </Link>
          ))}

          {/* Account info tile */}
          <div className="card" style={{ padding: '24px', border: '1px solid var(--border)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', marginBottom: '10px' }}>
              <Shield size={22} />
            </div>
            <p style={{ fontWeight: 700, marginBottom: '2px' }}>Account Security</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Your account is active & verified.</p>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#dcfce7', color: 'var(--success)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700 }}>
              ✓ Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
