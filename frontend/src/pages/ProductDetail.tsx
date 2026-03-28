import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Zap, Shield, RotateCcw, Truck, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Product } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const S = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [ordered, setOrdered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from('products').select('*').eq('id', id).single().then(({ data, error }) => {
      if (!error) setProduct(data);
      setLoading(false);
    });
  }, [id]);

  const handleBuy = async () => {
    if (!user) { alert('Please login first.'); return; }
    const { error } = await supabase.from('orders').insert({
      user_id: user.id, product_id: product!.id, status: 'Processing',
      delivery_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    });
    if (!error) setOrdered(true);
    else alert('Error: ' + error.message);
  };

  const handleWishlist = async () => {
    if (!user) { alert('Please login first.'); return; }
    const { error } = await supabase.from('wishlist').insert({ user_id: user.id, product_id: product!.id });
    if (!error) setWishlisted(true);
    else alert('Error: ' + error.message);
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="spinner" />
    </div>
  );

  if (!product) return (
    <div className="container" style={{ textAlign: 'center', padding: '64px 0' }}>
      <div style={{ fontSize: '3rem' }}>😕</div>
      <h2 style={{ margin: '16px 0 8px', fontSize: '1.5rem', fontWeight: 700 }}>Product not found</h2>
      <Link to="/products" className="btn btn-primary" style={{ marginTop: '16px' }}>Back to Shop</Link>
    </div>
  );

  const originalPrice = Math.round(product.price * 1.4);
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <div style={{ paddingTop: '28px', paddingBottom: '64px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <Link to="/" style={{ color: 'var(--primary)' }}>Home</Link>
          <span>/</span>
          <Link to="/products" style={{ color: 'var(--primary)' }}>Shop</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} style={{ color: 'var(--primary)' }}>{product.category}</Link>
          <span>/</span>
          <span className="truncate" style={{ maxWidth: 200 }}>{product.name}</span>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', overflow: 'hidden' }}>
          {/* Left: Image */}
          <div style={{ flex: '0 0 min(100%, 440px)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '420px', background: 'var(--gray-50)', padding: '32px', position: 'relative' }}>
            {discount > 0 && (
              <span style={{ position: 'absolute', top: '16px', left: '16px', background: 'var(--accent)', color: '#fff', borderRadius: '6px', padding: '4px 12px', fontSize: '0.8rem', fontWeight: 700 }}>
                {discount}% OFF
              </span>
            )}
            <img src={product.image} alt={product.name} style={{ maxWidth: '100%', maxHeight: '320px', objectFit: 'contain' }} />
          </div>

          {/* Right: Info */}
          <div style={{ flex: 1, minWidth: 280, padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', background: 'var(--gray-100)', padding: '3px 10px', borderRadius: '100px' }}>
                {product.category}
              </span>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3, marginTop: '12px', letterSpacing: '-0.3px' }}>
                {product.name}
              </h1>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#388e3c', color: '#fff', padding: '3px 10px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 700 }}>
                  {product.rating} <Star size={12} fill="currentColor" />
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>12,452 ratings</span>
              </div>
            </div>

            {/* Price */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-1px' }}>{S(product.price)}</span>
                <span style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{S(originalPrice)}</span>
                {discount > 0 && <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--success)' }}>{discount}% off</span>}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>Inclusive of all taxes</p>
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.9375rem' }}>{product.description}</p>

            {/* Perks */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { icon: <Truck size={16}/>, text: 'Free Delivery' },
                { icon: <RotateCcw size={16}/>, text: '7-Day Returns' },
                { icon: <Shield size={16}/>, text: '1 Year Warranty' },
                { icon: <Star size={16}/>, text: 'Top Rated' },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--primary)' }}>{icon}</span> {text}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '4px', flexWrap: 'wrap' }}>
              <button className="btn btn-outline btn-lg" style={{ flex: '0 0 auto' }} onClick={handleWishlist} disabled={wishlisted}>
                <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
                {wishlisted ? 'Wishlisted' : 'Wishlist'}
              </button>
              <button className="btn btn-primary btn-lg" style={{ flex: 1, minWidth: 140 }}>
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button className="btn btn-accent btn-lg" style={{ flex: 1, minWidth: 140 }} onClick={handleBuy} disabled={ordered}>
                <Zap size={18} /> {ordered ? 'Order Placed!' : 'Buy Now'}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
