const json = async (r) => {
  if (!r.ok) throw new Error('Não foi possível carregar carrinho.');
  return r.json();
};

export async function fetchCart() {
  const res = await fetch('/api/cart', { headers: { Accept: 'application/json' } });
  const data = await json(res);
  return data.items || [];
}

export async function applyCoupon(code) {
  const res = await fetch('/api/cart/coupon', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  return json(res);
}
