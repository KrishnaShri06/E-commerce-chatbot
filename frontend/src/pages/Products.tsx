import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types';
import { supabase } from '../lib/supabase';
import { SlidersHorizontal } from 'lucide-react';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Shoes', 'Accessories', 'Gadgets'];
const PRICE_RANGES = [
  { label: 'Any Price', min: 0, max: Infinity },
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 – ₹2,000', min: 500, max: 2000 },
  { label: '₹2,000 – ₹10,000', min: 2000, max: 10000 },
  { label: 'Above ₹10,000', min: 10000, max: Infinity },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const catParam = searchParams.get('category') || 'All';
  const initial = CATEGORIES.includes(catParam) ? catParam : 'All';

  const [cat, setCat] = useState(initial);
  const [sort, setSort] = useState<'default'|'asc'|'desc'>('default');
  const [priceIdx, setPriceIdx] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    let q = supabase.from('products').select('*');
    if (cat !== 'All') q = q.eq('category', cat);
    q.then(({ data, error }) => {
      if (!error && data) {
        let res = [...data];
        const { min, max } = PRICE_RANGES[priceIdx];
        res = res.filter(p => p.price >= min && p.price <= max);
        if (sort === 'asc') res.sort((a, b) => a.price - b.price);
        if (sort === 'desc') res.sort((a, b) => b.price - a.price);
        setProducts(res);
      }
      setLoading(false);
    });
    if (cat !== 'All') searchParams.set('category', cat); else searchParams.delete('category');
    setSearchParams(searchParams, { replace: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cat, sort, priceIdx]);

  const Sidebar = () => (
    <aside style={{ width: 240, flexShrink: 0 }}>
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: '0.9375rem' }}>
          Filters
        </div>

        {/* Category Filter */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '12px' }}>Category</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {CATEGORIES.map(c => (
              <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input
                  type="radio" name="cat" value={c} checked={cat === c}
                  onChange={() => setCat(c)}
                  style={{ accentColor: 'var(--primary)', width: 16, height: 16 }}
                />
                <span style={{ fontWeight: cat === c ? 600 : 400, color: cat === c ? 'var(--primary)' : 'var(--text)' }}>{c}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '12px' }}>Price Range</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {PRICE_RANGES.map((r, i) => (
              <label key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input
                  type="radio" name="price" checked={priceIdx === i}
                  onChange={() => setPriceIdx(i)}
                  style={{ accentColor: 'var(--primary)', width: 16, height: 16 }}
                />
                <span style={{ fontWeight: priceIdx === i ? 600 : 400, color: priceIdx === i ? 'var(--primary)' : 'var(--text)' }}>{r.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div style={{ padding: '16px 20px' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '12px' }}>Sort By Price</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[['default','Relevance'],['asc','Low to High'],['desc','High to Low']].map(([v, label]) => (
              <label key={v} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="radio" name="sort" checked={sort === v} onChange={() => setSort(v as typeof sort)} style={{ accentColor: 'var(--primary)', width: 16, height: 16 }} />
                <span style={{ fontWeight: sort === v ? 600 : 400, color: sort === v ? 'var(--primary)' : 'var(--text)' }}>{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div style={{ paddingTop: '28px', paddingBottom: '64px' }}>
      <div className="container" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* Sidebar Desktop */}
        <div className="md:block hidden"><Sidebar /></div>

        {/* Main */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.3px' }}>
                {cat === 'All' ? 'All Products' : cat}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
                {loading ? 'Loading…' : `${products.length} result${products.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <button className="btn btn-outline btn-sm md:hidden" onClick={() => setSidebarOpen(o => !o)}>
              <SlidersHorizontal size={15} /> Filters
            </button>
          </div>

          {/* Mobile Sidebar */}
          {sidebarOpen && (
            <div style={{ marginBottom: '20px' }}><Sidebar /></div>
          )}

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <div className="skeleton" style={{ height: '180px' }} />
                  <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className="skeleton" style={{ height: '12px', width: '50%' }} />
                    <div className="skeleton" style={{ height: '16px' }} />
                    <div className="skeleton" style={{ height: '16px', width: '70%' }} />
                    <div className="skeleton" style={{ height: '36px', marginTop: '4px' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="card" style={{ padding: '64px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>No products found</h3>
              <p style={{ color: 'var(--text-muted)' }}>Try changing the category or price filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
