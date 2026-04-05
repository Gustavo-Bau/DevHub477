'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { useCart } from '@/contexts/CartContext';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState('Finalizing your order...');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
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

      clearCart();
      setStatus('Payment successful! Your order has been created and confirmation email sent.');
    };

    run();
  }, [searchParams, clearCart]);

  return (
    <main style={{ maxWidth: 700, margin: '2rem auto' }}>
      <h1>Checkout Success</h1>
      <p>{status}</p>
    </main>
  );
}
