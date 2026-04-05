'use client';

import Link from 'next/link';

import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  return (
    <main style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h1>Your Shopping Cart</h1>

      {!items.length ? (
        <p>
          Your cart is empty. <Link href="/marketplace/search">Search marketplace</Link>
        </p>
      ) : (
        <>
          <ul style={{ display: 'grid', gap: 12 }}>
            {items.map((item) => (
              <li key={item.id} style={{ border: '1px solid #ddd', padding: 12 }}>
                <h3>{item.title}</h3>
                <p>{item.type === 'service' ? 'Freelancer service' : 'Software product'}</p>
                <p>${item.price.toFixed(2)}</p>
                <label>
                  Qty
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                  />
                </label>
                <button type="button" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <p style={{ marginTop: 16 }}>
            <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
          </p>
          <Link href="/checkout">Proceed to checkout</Link>
        </>
      )}
    </main>
  );
}
