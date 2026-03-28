import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types';
import { supabase } from '../lib/supabase';

const CATEGORIES = [
  { name: 'Electronics', emoji: '💻', slug: 'Electronics' },
  { name: 'Fashion',     emoji: '👗', slug: 'Fashion' },
  { name: 'Shoes',       emoji: '👟', slug: 'Shoes' },
  { name: 'Accessories', emoji: '⌚', slug: 'Accessories' },
  { name: 'Gadgets',     emoji: '🎧', slug: 'Gadgets' },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('products').select('*').limit(8).then(({ data, error }) => {
      if (!error && data) setProducts(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      {/* ─── Hero ─── */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 60%, #3b82f6 100%)',
        padding: '64px 0',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span style={{ background: '#f97316', color: '#fff', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, padding: '4px 12px', letterSpacing: '0.5px' }}>
            SUMMER SALE 2025
          </span>
          <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.15, marginTop: '16px', marginBottom: '16px' }}>
            Shop Smarter,<br />Live Better
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', maxWidth: '480px', marginBottom: '28px' }}>
            Discover thousands of products across Electronics, Fashion, Gadgets & more — all at unbeatable prices.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn btn-accent btn-lg">Shop Now</Link>
            <Link to="/products?category=Electronics" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}>
              Explore Deals
            </Link>
          </div>
        </div>
        {/* Decorative blob */}
        <div style={{ position: 'absolute', right: '-80px', top: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', right: '80px', bottom: '-120px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(249,115,22,0.12)' }} />
      </div>

      {/* ─── Category Strip ─── */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', marginBottom: '32px' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '20px 0' }} className="hide-scrollbar">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                to={`/products?category=${cat.slug}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '100px',
                  border: '1.5px solid var(--border)',
                  background: '#fff',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 180ms ease',
                  color: 'var(--text)',
                  flexShrink: 0,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2563eb'; (e.currentTarget as HTMLElement).style.color = '#2563eb'; (e.currentTarget as HTMLElement).style.background = '#eff6ff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = 'var(--text)'; (e.currentTarget as HTMLElement).style.background = '#fff'; }}
              >
                <span style={{ fontSize: '1.1rem' }}>{cat.emoji}</span>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Featured Products ─── */}
      <div className="container" style={{ marginBottom: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Featured Products</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '2px', fontSize: '0.9rem' }}>Handpicked deals just for you</p>
          </div>
          <Link to="/products" className="btn btn-outline btn-sm">View All</Link>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <div className="skeleton" style={{ height: '180px' }} />
                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="skeleton" style={{ height: '12px', width: '60%' }} />
                  <div className="skeleton" style={{ height: '16px' }} />
                  <div className="skeleton" style={{ height: '16px', width: '80%' }} />
                  <div className="skeleton" style={{ height: '32px', marginTop: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>

      {/* ─── Why Shop With Us ─── */}
      <div style={{ background: '#fff', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '48px 0', marginBottom: '0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, marginBottom: '36px', letterSpacing: '-0.5px' }}>Why Shop With Us</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', textAlign: 'center' }}>
            {[
              { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹499' },
              { icon: '🔁', title: 'Easy Returns', desc: '7-day hassle-free returns' },
              { icon: '🔒', title: 'Secure Payments', desc: '100% safe & encrypted' },
              { icon: '⭐', title: 'Top Brands', desc: 'Authentic products only' },
            ].map(f => (
              <div key={f.title} style={{ padding: '24px', borderRadius: 'var(--radius-md)', background: 'var(--gray-50)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{f.icon}</div>
                <p style={{ fontWeight: 700, marginBottom: '4px' }}>{f.title}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
