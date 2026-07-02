import { apiRequest } from './api';

export async function createCheckout(payload) {
  return apiRequest('/api/checkout/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function finalizeOrder(payload) {
  return apiRequest('/api/checkout/finalize', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
