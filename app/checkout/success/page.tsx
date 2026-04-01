'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { useCart } from '@/contexts/CartContext';

type PurchasedItem = {
  id: string;
  productId: string;
  title: string;
};

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState('Finalizing your order...');
  const [items, setItems] = useState<PurchasedItem[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams?.get('session_id');
    if (!sessionId) {
      setStatus('Missing payment session id.');
      return;
    }

    const run = async () => {
      const response = await fetch('/api/checkout/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        setStatus('Payment was captured but we could not finalize your order. Contact support.');
        return;
      }

      const result = (await response.json()) as { items?: PurchasedItem[] };

      clearCart();
      setItems(result.items ?? []);
      setStatus('Payment successful! Your order has been created. Leave reviews below.');
    };

    run();
  }, [searchParams, clearCart]);

  const submitReview = async (event: FormEvent<HTMLFormElement>, productId: string) => {
    event.preventDefault();

    const rating = ratings[productId] ?? 5;
    const comment = comments[productId] ?? '';

    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, rating, comment }),
    });

    const data = await response.json();

    if (!response.ok) {
      setReviewMessage(data.error ?? 'Failed to submit review.');
      return;
    }

    setReviewMessage('Review submitted successfully.');
  };

  return (
    <main style={{ maxWidth: 700, margin: '2rem auto', display: 'grid', gap: 12 }}>
      <h1>Checkout Success</h1>
      <p>{status}</p>

      {reviewMessage ? <p>{reviewMessage}</p> : null}

      {items.map((item) => (
        <form key={item.id} onSubmit={(event) => submitReview(event, item.productId)} style={{ border: '1px solid #ddd', padding: 10 }}>
          <h3>Review: {item.title}</h3>
          <label>
            Rating (1-5)
            <input
              type="number"
              min={1}
              max={5}
              value={ratings[item.productId] ?? 5}
              onChange={(e) => setRatings((current) => ({ ...current, [item.productId]: Number(e.target.value) }))}
            />
          </label>
          <label>
            Comment
            <textarea
              required
              value={comments[item.productId] ?? ''}
              onChange={(e) => setComments((current) => ({ ...current, [item.productId]: e.target.value }))}
            />
          </label>
          <button type="submit">Submit review</button>
        </form>
      ))}
    </main>
  );
}
