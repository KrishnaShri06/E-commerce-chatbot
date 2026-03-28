import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Truck, CheckCircle, AlertCircle, XCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Product } from '../types';

interface OrderItem { id: string; status: string; created_at: string; products: Product; }

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  Processing: { icon: <Clock size={14} />,       color: '#2563eb', bg: '#dbeafe' },
  Shipped:    { icon: <Truck size={14} />,        color: '#7c3aed', bg: '#ede9fe' },
  Delivered:  { icon: <CheckCircle size={14} />,  color: '#16a34a', bg: '#dcfce7' },
  Delayed:    { icon: <AlertCircle size={14} />,  color: '#b45309', bg: '#fef3c7' },
  Cancelled:  { icon: <XCircle size={14} />,      color: '#dc2626', bg: '#fee2e2' },
};

// Orders that can still be cancelled
const CANCELLABLE = ['Processing'];

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [refundMsg, setRefundMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase.from('orders').select('id, status, created_at, products(*)').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setOrders(data as unknown as OrderItem[]);
        setLoading(false);
      });
  }, [user]);

  // Auto-dismiss refund toast after 6 seconds
  useEffect(() => {
    if (!refundMsg) return;
    const t = setTimeout(() => setRefundMsg(null), 6000);
    return () => clearTimeout(t);
  }, [refundMsg]);

  const cancelOrder = async (id: string) => {
    setCancellingId(id);

    // Find the order to get the product price
    const order = orders.find(o => o.id === id);
    const amount = order?.products?.price ?? 0;

    // 1. Update order status → Cancelled
    const { error: orderErr } = await supabase
      .from('orders')
      .update({ status: 'Cancelled' })
      .eq('id', id);

    if (orderErr) {
      alert('Could not cancel order: ' + orderErr.message);
      setCancellingId(null);
      return;
    }

    // 2. Insert refund record with amount
    const { error: refundErr } = await supabase
      .from('refunds')
      .insert({
        user_id: user!.id,
        order_id: id,
        amount,
        status: 'Pending',
      });

    if (refundErr) {
      console.error('Refund insert error:', refundErr.message);
      // Order is still cancelled, just log the refund error
    }

    // 3. Update local state
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Cancelled' } : o));
    setCancellingId(null);
    setConfirmId(null);
    setRefundMsg(`Refund of ₹${amount.toLocaleString('en-IN')} initiated. It will be processed in 3–5 business days.`);
  };

  const fmt = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="spinner" />
    </div>
  );

  if (!user) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '32px' }}>
      <Package size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: 0.4 }} />
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Please login</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Login to view your order history.</p>
      <Link to="/auth" className="btn btn-primary">Login</Link>
    </div>
  );

  return (
    <div style={{ paddingTop: '28px', paddingBottom: '64px' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: refundMsg ? '16px' : '28px' }}>
          <Package size={24} style={{ color: 'var(--primary)' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>My Orders</h1>
          <span style={{ background: 'var(--gray-100)', borderRadius: '100px', padding: '2px 12px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            {orders.length} orders
          </span>
        </div>

        {/* ── Refund success toast ── */}
        {refundMsg && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 'var(--radius-md)', padding: '14px 18px', marginBottom: '24px' }}>
            <CheckCircle size={20} style={{ color: '#16a34a', flexShrink: 0, marginTop: 1 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, color: '#166534', marginBottom: '2px' }}>Order Cancelled · Refund Initiated</p>
              <p style={{ color: '#15803d', fontSize: '0.875rem' }}>{refundMsg}</p>
            </div>
            <button onClick={() => setRefundMsg(null)} style={{ color: '#16a34a', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexShrink: 0 }}>
              <X size={18} />
            </button>
          </div>
        )}

        {/* ── Cancel Confirmation Dialog ── */}
        {confirmId && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: '32px', maxWidth: 400, width: '100%', boxShadow: 'var(--shadow-lg)', position: 'relative' }}>
              <button
                onClick={() => setConfirmId(null)}
                style={{ position: 'absolute', top: 16, right: 16, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
              >
                <X size={20} />
              </button>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#dc2626' }}>
                <XCircle size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, textAlign: 'center', marginBottom: '10px' }}>Cancel this order?</h3>
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.5 }}>
                This action cannot be undone. The order will be marked as <strong>Cancelled</strong>.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-outline w-full" onClick={() => setConfirmId(null)}>
                  Go Back
                </button>
                <button
                  className="btn w-full"
                  style={{ background: '#dc2626', color: '#fff', flex: 1 }}
                  disabled={cancellingId === confirmId}
                  onClick={() => cancelOrder(confirmId)}
                >
                  {cancellingId === confirmId ? 'Cancelling…' : 'Yes, Cancel Order'}
                </button>
              </div>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '80px 32px' }}>
            <Package size={56} style={{ color: 'var(--text-muted)', opacity: 0.25, margin: '0 auto 20px' }} />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>No orders yet</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>When you place an order, it will appear here.</p>
            <Link to="/products" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map(order => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['Processing'];
              const canCancel = CANCELLABLE.includes(order.status);
              return (
                <div key={order.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                  {/* Order header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', background: 'var(--gray-50)', borderBottom: '1px solid var(--border)', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>Order ID</span>
                      <p style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.875rem' }}>#{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)' }}>Placed On</span>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: cfg.bg, color: cfg.color, padding: '5px 12px', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 700 }}>
                        {cfg.icon} {order.status}
                      </span>
                      {canCancel && (
                        <button
                          className="btn btn-sm"
                          style={{ border: '1.5px solid #fca5a5', color: '#dc2626', borderRadius: 'var(--radius-sm)', padding: '5px 12px', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px', background: '#fff' }}
                          onClick={() => setConfirmId(order.id)}
                        >
                          <X size={13} /> Cancel Order
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Order body */}
                  <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ width: 72, height: 72, background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)', flexShrink: 0 }}>
                      <img src={order.products.image} alt={order.products.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', opacity: order.status === 'Cancelled' ? 0.4 : 1 }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.975rem', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: order.status === 'Cancelled' ? 'line-through' : 'none', color: order.status === 'Cancelled' ? 'var(--text-muted)' : 'inherit' }}>
                        {order.products.name}
                      </p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Qty: 1</p>
                      <p style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '4px', color: order.status === 'Cancelled' ? 'var(--text-muted)' : 'inherit' }}>
                        {fmt(order.products.price)}
                      </p>
                    </div>
                    {order.status !== 'Cancelled' && (
                      <Link to={`/products/${order.products.id}`} className="btn btn-outline btn-sm" style={{ flexShrink: 0 }}>
                        Buy Again
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
