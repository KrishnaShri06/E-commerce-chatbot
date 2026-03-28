import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, LogOut, ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/products?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="nav-root">
      <div className="container nav-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🛒</span>
          <span className="logo-text">ShopKart</span>
        </Link>

        {/* Search */}
        <form className="nav-search" onSubmit={handleSearch}>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search products, brands and categories…"
            className="nav-search__input"
          />
          <button type="submit" className="nav-search__btn" aria-label="Search">
            <Search size={18} />
          </button>
        </form>

        {/* Right side */}
        <nav className="nav-right">
          {user ? (
            <div className="nav-dropdown">
              <button className="nav-btn nav-user-btn">
                <User size={18} />
                <span className="sm:block hidden">{(user.user_metadata?.name || user.email || '').split(' ')[0]}</span>
                <ChevronDown size={14} />
              </button>
              <div className="dropdown-panel">
                <div className="dropdown-header">
                  <p className="font-semibold truncate">{user.email}</p>
                </div>
                <Link to="/profile" className="dropdown-link"><User size={15} /> My Profile</Link>
                <Link to="/orders" className="dropdown-link"><ShoppingBag size={15} /> Orders</Link>
                <Link to="/wishlist" className="dropdown-link"><Heart size={15} /> Wishlist</Link>
                <div className="dropdown-divider" />
                <button onClick={signOut} className="dropdown-link dropdown-link--danger w-full text-left">
                  <LogOut size={15} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/auth" className="btn btn-outline btn-sm">Login</Link>
          )}

          <Link to="/wishlist" className="nav-icon-btn" title="Wishlist">
            <Heart size={20} />
          </Link>

          <Link to="/orders" className="nav-icon-btn" title="Orders">
            <ShoppingBag size={20} />
          </Link>

          {/* Hamburger */}
          <button className="nav-icon-btn md:hidden" onClick={() => setMobileMenuOpen(o => !o)}>
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </div>



      {/* Mobile nav menu */}
      {mobileMenuOpen && (
        <div className="nav-mobile-menu">
          <Link to="/products" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
          <Link to="/wishlist" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Wishlist</Link>
          <Link to="/orders" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Orders</Link>
          {user
            ? <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="mobile-nav-link text-danger">Logout</button>
            : <Link to="/auth" className="mobile-nav-link font-semibold text-primary" onClick={() => setMobileMenuOpen(false)}>Login / Sign Up</Link>}
        </div>
      )}
    </header>
  );
}
