// TODO: Replace all functions with API calls to MySQL backend
// Currently using mock data - integrate with real backend endpoints

import { categories, notifications, products, sellers } from './mock-data';

const sortFunctions = {
  relevance: (a, b) => b.popularity - a.popularity,
  price_asc: (a, b) => a.price - b.price,
  price_desc: (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
  sales: (a, b) => b.sales - a.sales,
};

function normalizeQuery(query) {
  return String(query ?? '').trim().toLowerCase();
}

export function getCategories() {
  // TODO: Replace with fetch('/api/categories')
  return categories;
}

export function getNotifications() {
  // TODO: Replace with fetch('/api/notifications')
  return notifications;
}

export function getSellerById(id) {
  // TODO: Replace with fetch(`/api/sellers/${id}`)
  return sellers.find((seller) => seller.id === id) ?? null;
}

export function getProductsBySellerId(sellerId) {
  // TODO: Replace with fetch(`/api/sellers/${sellerId}/products`)
  return products.filter((product) => product.vendorId === sellerId);
}

export function getTopSellers(count = 4) {
  // TODO: Replace with fetch('/api/sellers/top')
  return sellers
    .slice()
    .sort((a, b) => b.reputation - a.reputation || b.totalSales - a.totalSales)
    .slice(0, count);
}

export function getTopRankedProducts(count = 4) {
  // TODO: Replace with fetch('/api/products/top')
  return products
    .slice()
    .sort((a, b) => a.rank - b.rank || b.popularity - a.popularity)
    .slice(0, count);
}

export function getProductBySlug(slug) {
  // TODO: Replace with fetch(`/api/products/slug/${slug}`)
  return products.find((product) => product.slug === slug) ?? null;
}

export function getSponsoredProducts() {
  // TODO: Replace with fetch('/api/products/sponsored')
  return products.filter((product) => product.isSponsored);
}

export function getRecommendedProducts({ category, count = 4 }) {
  return products
    .filter((product) => product.category === category)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, count);
}

export function searchProducts({ query, category, minPrice, maxPrice, minRating, location, sort, sponsoredOnly = false }) {
  const normalizedQuery = normalizeQuery(query);

  let items = products.filter((product) => {
    const seller = getSellerById(product.vendorId);
    const matchesQuery =
      !normalizedQuery ||
      product.title.toLowerCase().includes(normalizedQuery) ||
      product.brief.toLowerCase().includes(normalizedQuery) ||
      product.category.toLowerCase().includes(normalizedQuery) ||
      seller?.name.toLowerCase().includes(normalizedQuery);

    const categoryMatch = !category || category === 'All' || product.category === category;
    const priceMatch =
      (typeof minPrice !== 'number' || product.price >= minPrice) &&
      (typeof maxPrice !== 'number' || product.price <= maxPrice);
    const ratingMatch = typeof minRating !== 'number' || product.rating >= minRating;
    const locationMatch = !location || product.location.toLowerCase().includes(location.toLowerCase());
    const sponsoredMatch = !sponsoredOnly || product.isSponsored;

    return matchesQuery && categoryMatch && priceMatch && ratingMatch && locationMatch && sponsoredMatch;
  });

  const sortFn = sortFunctions[sort] || sortFunctions.relevance;
  return items.sort(sortFn);
}

export function getAutocompleteSuggestions(query) {
  const normalized = normalizeQuery(query);
  if (!normalized) return [];

  const suggestions = new Set();
  products.forEach((product) => {
    if (product.title.toLowerCase().includes(normalized)) {
      suggestions.add(product.title);
    }
    if (product.category.toLowerCase().includes(normalized)) {
      suggestions.add(product.category);
    }
  });

  sellers.forEach((seller) => {
    if (seller.name.toLowerCase().includes(normalized)) {
      suggestions.add(seller.name);
    }
  });

  return Array.from(suggestions).slice(0, 6);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}
