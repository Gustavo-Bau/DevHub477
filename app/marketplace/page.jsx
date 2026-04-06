'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const products = [
  { id: 'cloudscale-pro', name: 'CloudScale Pro', vendor: 'NexaSystems', category: 'SaaS & Cloud', platform: 'Web', price: 49, rating: 4.9 },
  { id: 'dataflow-engine', name: 'DataFlow Engine', vendor: 'QuantaStream', category: 'Dev Tools', platform: 'Desktop', price: 199, rating: 4.7 },
  { id: 'sentinel-guard', name: 'Sentinel Guard', vendor: 'CyberArmor Lab', category: 'Security', platform: 'Web', price: 29, rating: 4.8 },
  { id: 'insightx-analytics', name: 'InsightX Analytics', vendor: 'MetricMaster', category: 'Analytics', platform: 'Web', price: 12, rating: 4.5 },
  { id: 'devconsole-plus', name: 'DevConsole Plus', vendor: 'OpenTools Foundation', category: 'Dev Tools', platform: 'CLI', price: 0, rating: 5.0 },
  { id: 'micromesh-api', name: 'MicroMesh API', vendor: 'WebStack Solutions', category: 'SaaS & Cloud', platform: 'Web', price: 89, rating: 4.6 },
];

const categories = ['All Categories', 'SaaS & Cloud', 'Dev Tools', 'Security', 'Analytics'];
const platforms = ['Web', 'Desktop', 'Mobile', 'CLI'];
const ratings = [4, 3];

export default function MarketplacePage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [platform, setPlatform] = useState('Web');
  const [maxPrice, setMaxPrice] = useState(2500);
  const [minRating, setMinRating] = useState(4);

  const filteredProducts = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const categoryMatch = category === 'All Categories' || product.category === category;
      const platformMatch = platform ? product.platform === platform : true;
      const priceMatch = product.price <= maxPrice;
      const ratingMatch = product.rating >= minRating;
      const textMatch =
        !lowerQuery
        || product.name.toLowerCase().includes(lowerQuery)
        || product.vendor.toLowerCase().includes(lowerQuery)
        || product.category.toLowerCase().includes(lowerQuery);

      return categoryMatch && platformMatch && priceMatch && ratingMatch && textMatch;
    });
  }, [category, maxPrice, minRating, platform, query]);

  return (
    <main className="min-h-screen bg-background-light px-4 py-8 lg:px-10">
      <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6">
          <section>
            <h2 className="text-xl font-black text-slate-800">Categories</h2>
            <div className="mt-4 space-y-2">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`w-full rounded-xl px-4 py-3 text-left font-semibold transition ${category === item ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-700'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-800">Platform</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {platforms.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPlatform(item)}
                  className={`rounded-xl border px-3 py-2 text-sm font-semibold ${platform === item ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 text-slate-700 hover:border-primary/50'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-800">Price Range</h2>
            <input className="mt-4 w-full" type="range" min="0" max="2500" step="10" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
            <p className="mt-2 text-sm font-semibold text-slate-600">Até ${maxPrice}</p>
          </section>

          <section>
            <h2 className="text-xl font-black text-slate-800">Minimum Rating</h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {ratings.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMinRating(item)}
                  className={`rounded-xl border px-3 py-3 text-sm font-bold ${minRating === item ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 text-slate-700'}`}
                >
                  {item}+ Stars
                </button>
              ))}
            </div>
          </section>
        </aside>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-black text-slate-900">Marketplace</h1>
              <p className="text-sm text-slate-600">{filteredProducts.length} resultado(s)</p>
            </div>
            <input
              className="w-full max-w-md rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-primary"
              placeholder="Buscar software, vendedor ou categoria"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <article key={product.id} className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase text-primary">{product.category}</p>
                <h3 className="mt-2 text-lg font-bold text-slate-900">{product.name}</h3>
                <p className="text-sm text-slate-600">{product.vendor}</p>
                <p className="mt-2 text-sm text-slate-600">{product.platform} • ⭐ {product.rating.toFixed(1)}</p>
                <div className="mt-4 flex items-center justify-between">
                  <strong className="text-primary">${product.price}{product.price ? '/mo' : ''}</strong>
                  <Link href={`/product/${product.id}`} className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white">
                    Ver detalhes
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {!filteredProducts.length && <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Nenhum item encontrado para os filtros selecionados.</p>}
        </section>
      </div>
    </main>
  );
}
