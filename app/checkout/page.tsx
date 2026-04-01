'use client';

import { useState } from 'react';

import { useCart } from '@/contexts/CartContext';

const TAX_RATE = 0.08;

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer'>('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, paymentMethod, taxRate: TAX_RATE }),
      });

      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error ?? 'Unable to create checkout session.');
      }

      window.location.href = data.url as string;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment initialization failed.');
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 850, margin: '2rem auto', display: 'grid', gap: 16 }}>
      <h1>Checkout</h1>

      <section>
        <h2>Order Summary</h2>
        {!items.length ? <p>No items in cart.</p> : null}
        <ul style={{ display: 'grid', gap: 10 }}>
          {items.map((item) => (
            <li key={item.id} style={{ border: '1px solid #ddd', padding: 10 }}>
              <strong>{item.title}</strong> × {item.quantity}
              <div>${(item.price * item.quantity).toFixed(2)}</div>
            </li>
          ))}
        </ul>

        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Tax (8%): ${tax.toFixed(2)}</p>
        <p>
          <strong>Total: ${total.toFixed(2)}</strong>
        </p>
      </section>

      <section>
        <h2>Payment Method</h2>
        <label>
          <input
            type="radio"
            checked={paymentMethod === 'card'}
            onChange={() => setPaymentMethod('card')}
          />
          Credit / Debit Card (Stripe)
        </label>
        <label>
          <input
            type="radio"
            checked={paymentMethod === 'bank_transfer'}
            onChange={() => setPaymentMethod('bank_transfer')}
          />
          Bank Transfer
        </label>
      </section>

      {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}

      <button type="button" onClick={handlePayment} disabled={!items.length || loading}>
        {loading ? 'Redirecting to Stripe...' : 'Pay now'}
      </button>
    </main>
  );
}
