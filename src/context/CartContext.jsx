import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { fetchCart, applyCoupon as applyCouponApi, addCartItem, updateCartItem, removeCartItem } from '../services/cartService';

const CartContext = createContext(null);
const STORAGE_KEY = 'devhub_cart';

const loadLocalCart = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveLocalCart = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage pode estar indisponível; não travar a aplicação
  }
};

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState(() => loadLocalCart());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [coupon, setCoupon] = useState(null);

  const setCartItems = (nextItems) => {
    setItems(nextItems);
    saveLocalCart(nextItems);
  };

  const loadCart = async () => {
    setLoading(true);
    setError('');
    try {
      const cartItems = await fetchCart();
      setCartItems(cartItems);
    } catch (e) {
      const fallback = loadLocalCart();
      if (fallback.length > 0) {
        setCartItems(fallback);
        setError(e.message || 'Não foi possível carregar o carrinho do servidor. Exibindo itens locais.');
      } else {
        setCartItems([]);
        setError(e.message || 'Não foi possível carregar o carrinho.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addToCart = async (product, quantity = 1) => {
    setLoading(true);
    setError('');
    const itemId = product.id || product.slug || `${product.nome}-${product.preco}`;
    const cartItem = {
      id: itemId,
      slug: product.slug,
      name: product.nome || product.name || 'Produto',
      image: product.imagem_principal || product.image || 'https://via.placeholder.com/320',
      price: Number(product.preco || product.price || 0),
      quantity,
      category: product.categoria || product.category,
    };

    try {
      const saved = await addCartItem({ productId: itemId, quantity });
      const nextItem = { ...cartItem, ...saved };
      setCartItems((prev) => {
        const idx = prev.findIndex((item) => (item.id || item.slug) === itemId);
        if (idx === -1) return [...prev, nextItem];
        const next = [...prev];
        next[idx] = nextItem;
        return next;
      });
      return nextItem;
    } catch (e) {
      setCartItems((prev) => {
        const idx = prev.findIndex((item) => (item.id || item.slug) === itemId);
        if (idx === -1) return [...prev, cartItem];
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: Number(next[idx].quantity || 0) + quantity };
        return next;
      });
      setError(e.message || 'Não foi possível sincronizar com o servidor. O item foi adicionado localmente.');
      return cartItem;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    setLoading(true);
    setError('');
    try {
      await removeCartItem(itemId);
      setCartItems((prev) => prev.filter((item) => (item.id || item.slug) !== itemId));
    } catch (e) {
      setCartItems((prev) => prev.filter((item) => (item.id || item.slug) !== itemId));
      setError(e.message || 'Não foi possível remover o item do carrinho do servidor. Item removido localmente.');
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (itemId, quantity) => {
    setLoading(true);
    setError('');
    try {
      const updated = await updateCartItem(itemId, quantity);
      setCartItems((prev) => prev.map((item) => (item.id || item.slug) === (updated.id || updated.slug) ? updated : item));
      return updated;
    } catch (e) {
      setCartItems((prev) => prev.map((item) => (item.id || item.slug) === itemId ? { ...item, quantity } : item));
      setError(e.message || 'Não foi possível atualizar a quantidade no servidor. Atualizado localmente.');
      return { ...prev.find((item) => (item.id || item.slug) === itemId), quantity };
    } finally {
      setLoading(false);
    }
  };


  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0),
    [items],
  );

  const discount = useMemo(() => Number(coupon?.discountAmount || 0), [coupon]);
  const total = Math.max(subtotal - discount, 0);
  const quantity = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.quantity || 1), 0),
    [items],
  );

  const applyCoupon = async (code) => {
    setLoading(true);
    setError('');
    try {
      const data = await applyCouponApi(code);
      setCoupon(data);
      return data;
    } catch (e) {
      setError(e.message || 'Não foi possível aplicar o cupom.');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        error,
        subtotal,
        discount,
        total,
        quantity,
        coupon,
        loadCart,
        applyCoupon,
        addToCart,
        removeFromCart,
        updateItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
