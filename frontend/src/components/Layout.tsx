import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Chatbot from './Chatbot';

export default function Layout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Chatbot />
      <footer style={{
        background: '#0f172a',
        color: '#94a3b8',
        padding: '32px 0',
        marginTop: '32px'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>🛒 ShopKart</p>
            <p style={{ fontSize: '0.875rem' }}>Your premium shopping destination.</p>
          </div>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ color: '#fff', fontWeight: 600, marginBottom: '8px', fontSize: '0.875rem' }}>Quick Links</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8125rem' }}>
                <a href="/products" style={{ color: '#94a3b8' }}>All Products</a>
                <a href="/orders" style={{ color: '#94a3b8' }}>My Orders</a>
                <a href="/wishlist" style={{ color: '#94a3b8' }}>Wishlist</a>
              </div>
            </div>
          </div>
        </div>
        <div className="container" style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #1e293b', fontSize: '0.8125rem', textAlign: 'center' }}>
          © {new Date().getFullYear()} ShopKart. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
