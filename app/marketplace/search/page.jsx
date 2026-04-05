'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { AddToCartButton } from '@/components/cart/AddToCartButton';

const DEBOUNCE_MS = 400;

export default function MarketplaceSearchPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [stack, setStack] = useState('');
  const [freelancerAvailability, setFreelancerAvailability] = useState(false);
  const [sort, setSort] = useState('popularity');

  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sentinelRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    if (category) params.set('category', category);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (minRating) params.set('minRating', minRating);
    if (stack) params.set('stack', stack);
    if (freelancerAvailability) params.set('freelancerAvailability', 'true');
    params.set('sort', sort);
    params.set('page', String(page));
    return params.toString();
  }, [debouncedQuery, category, minPrice, maxPrice, minRating, stack, freelancerAvailability, sort, page]);

  const fetchResults = useCallback(
    async (reset) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/search?${queryString}`);
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();

        setItems((current) => (reset ? data.items : [...current, ...data.items]));
        setHasMore(Boolean(data.hasMore));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load search results.');
      } finally {
        setLoading(false);
      }
    },
    [queryString],
  );

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, category, minPrice, maxPrice, minRating, stack, freelancerAvailability, sort]);

  useEffect(() => {
    fetchResults(page === 1);
  }, [page, fetchResults]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting && hasMore && !loading) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <main style={{ maxWidth: 1000, margin: '2rem auto', display: 'grid', gap: 16 }}>
      <h1>Marketplace Search</h1>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
        <input placeholder="Search products/services" value={query} onChange={(e) => setQuery(e.target.value)} />
        <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input placeholder="Min price" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <input placeholder="Max price" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        <input placeholder="Min rating" type="number" step="0.1" value={minRating} onChange={(e) => setMinRating(e.target.value)} />
        <input placeholder="Technology stack" value={stack} onChange={(e) => setStack(e.target.value)} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" checked={freelancerAvailability} onChange={(e) => setFreelancerAvailability(e.target.checked)} />Freelancer available</label>
        <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="popularity">Sort: Popularity</option><option value="price">Sort: Price</option><option value="rating">Sort: Rating</option></select>
      </section>
      {error ? <p style={{ color: '#b91c1c' }}>{error}</p> : null}
      <section style={{ display: 'grid', gap: 12 }}>{items.map((item) => <article key={item.id} style={{ border: '1px solid #ddd', padding: 12 }}><h3>{item.title}</h3><p>{item.description}</p><p><strong>Type:</strong> {item.owner?.role === 'freelancer' ? 'Service' : 'Product'}</p><p><strong>Category:</strong> {item.category} | <strong>Price:</strong> ${Number(item.price || 0).toFixed(2)}</p><p><strong>Rating:</strong> {item.ratings ?? 'n/a'} | <strong>Popularity:</strong> {item.popularity}</p><p><strong>Stack:</strong> {item.technologyStack?.join(', ') || 'n/a'}</p><p><strong>Freelancer availability:</strong> {item.freelancerAvailable ? 'Available' : 'Not available'}</p><AddToCartButton item={{ id: item.id, title: item.title, description: item.description, price: item.price, image: item.images?.[0], category: item.category, type: item.owner?.role === 'freelancer' ? 'service' : 'product' }} /></article>)}</section>
      {loading ? <p>Loading...</p> : null}
      <div ref={sentinelRef} style={{ height: 1 }} />
      {!hasMore && !loading ? <p>No more results.</p> : null}
    </main>
  );
}
