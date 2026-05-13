import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchCart, applyCoupon as applyCouponApi } from '../services/cartService';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [coupon, setCoupon] = useState(null);

  const loadCart = async () => {
    setLoading(true);
    setError('');
    try { setItems(await fetchCart()); } catch (e) { setError(e.message); setItems([]); } finally { setLoading(false); }
  };

  useEffect(() => { loadCart(); }, []);

  const subtotal = useMemo(() => items.reduce((a, i) => a + Number(i.price || 0) * Number(i.quantity || 1), 0), [items]);
  const discount = useMemo(() => (coupon?.discountAmount ? Number(coupon.discountAmount) : 0), [coupon]);
  const total = Math.max(subtotal - discount, 0);
  const quantity = useMemo(() => items.reduce((a, i) => a + Number(i.quantity || 1), 0), [items]);

  const applyCoupon = async (code) => {
    const data = await applyCouponApi(code);
    setCoupon(data);
    return data;
  };

  return <CartContext.Provider value={{ items, loading, error, subtotal, discount, total, quantity, coupon, loadCart, applyCoupon }}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
