import { apiRequest } from './api';

export async function fetchCart() {
  const data = await apiRequest('/api/cart');
  return data.items || [];
}

export async function applyCoupon(code) {
  return apiRequest('/api/cart/coupon', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
}

export async function addCartItem(payload) {
  return apiRequest('/api/cart/items', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateCartItem(itemId, quantity) {
  return apiRequest(`/api/cart/items/${encodeURIComponent(itemId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItem(itemId) {
  return apiRequest(`/api/cart/items/${encodeURIComponent(itemId)}`, {
    method: 'DELETE',
  });
}
