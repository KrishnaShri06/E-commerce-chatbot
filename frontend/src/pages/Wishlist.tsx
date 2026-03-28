import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Product } from '../types';

interface WishlistItem { id: string; products: Product; }

export default function Wishlist() {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase.from('wishlist').select('id, products(*)').eq('user_id', user.id)
      .then(({ data, error }) => {
        if (!error && data) setItems(data as unknown as WishlistItem[]);
        setLoading(false);
      });
  }, [user]);

  const remove = async (id: string) => {
    const { error } = await supabase.from('wishlist').delete().eq('id', id);
    if (!error) setItems(items.filter(i => i.id !== id));
  };

  const fmt = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="spinner" />
    </div>
  );

  if (!user) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '32px' }}>
      <Heart size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: 0.4 }} />
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Please login</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Login to view your saved items.</p>
      <Link to="/auth" className="btn btn-primary">Login</Link>
    </div>
  );

  return (
    <div style={{ paddingTop: '28px', paddingBottom: '64px' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
          <Heart size={24} style={{ color: 'var(--primary)' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>My Wishlist</h1>
          <span style={{ background: 'var(--gray-100)', borderRadius: '100px', padding: '2px 12px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            {items.length} items
          </span>
        </div>

        {items.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '80px 32px' }}>
            <Heart size={56} style={{ color: 'var(--text-muted)', opacity: 0.25, margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>Your wishlist is empty</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Save items you love and find them here later.</p>
            <Link to="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {items.map(item => (
              <div key={item.id} className="card" style={{ overflow: 'hidden' }}>
                <Link to={`/products/${item.products.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)', height: '180px', padding: '16px' }}>
                  <img src={item.products.image} alt={item.products.name} style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }} />
                </Link>
                <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>{item.products.category}</p>
                  <h3 style={{ fontWeight: 600, fontSize: '0.9375rem', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.products.name}</h3>
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>{fmt(item.products.price)}</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <Link to={`/products/${item.products.id}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                      <ShoppingBag size={14} /> View
                    </Link>
                    <button onClick={() => remove(item.id)} className="btn btn-sm" title="Remove" style={{ color: 'var(--danger)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '7px 12px' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
