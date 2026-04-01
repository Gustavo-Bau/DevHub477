'use client';

import { useState } from 'react';

import { useCart } from '@/contexts/CartContext';

type AddToCartButtonProps = {
  item: {
    id: string;
    title: string;
    description?: string;
    price: number;
    image?: string;
    category?: string;
    type: 'product' | 'service';
  };
};

export function AddToCartButton({ item }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          addItem(item);
          setMessage('Added to cart');
          setTimeout(() => setMessage(null), 1500);
        }}
      >
        Add to cart
      </button>
      {message ? <p style={{ color: '#15803d' }}>{message}</p> : null}
    </div>
  );
}
