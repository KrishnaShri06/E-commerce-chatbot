import { Heart, Star, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import './ProductCard.css';

export default function ProductCard({ product }: { product: Product }) {
  const fmt = (p: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  const originalPrice = Math.round(product.price * 1.4);
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <div className="pc-root card card-hover">
      <Link to={`/products/${product.id}`} className="pc-link">
        {/* Image */}
        <div className="pc-image-box">
          <img src={product.image} alt={product.name} className="pc-img object-contain" loading="lazy" />
          <button
            className="pc-wish-btn"
            title="Wishlist"
            onClick={e => { e.preventDefault(); }}
          >
            <Heart size={16} />
          </button>
          {discount > 0 && (
            <span className="pc-discount-badge">{discount}% off</span>
          )}
        </div>

        {/* Info */}
        <div className="pc-info">
          <span className="pc-category text-xs text-muted uppercase">{product.category}</span>
          <h3 className="pc-name line-clamp-2">{product.name}</h3>
          
          <div className="pc-rating">
            <span className="pc-rating__score">
              {product.rating} <Star size={10} fill="currentColor" />
            </span>
          </div>

          <div className="pc-price-row">
            <span className="pc-price">{fmt(product.price)}</span>
            <span className="pc-original">{fmt(originalPrice)}</span>
          </div>
        </div>
      </Link>

      {/* Quick action */}
      <div className="pc-actions">
        <Link to={`/products/${product.id}`} className="btn btn-primary btn-sm w-full">
          <ShoppingBag size={14} /> View Details
        </Link>
      </div>
    </div>
  );
}
