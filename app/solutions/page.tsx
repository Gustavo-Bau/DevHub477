import Link from 'next/link';

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-background-light px-6 py-10">
      <section className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">DevHub</p>
        <h1 className="text-3xl font-black text-slate-900">Solutions Explorer</h1>
        <p className="mt-2 text-sm text-slate-600">Explore recommended bundles for SaaS, security, analytics and developer productivity.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {['Startup Pack', 'Security Stack', 'Enterprise Integrations'].map((item) => (
            <article key={item} className="rounded-xl border border-slate-200 p-4">
              <h2 className="font-bold text-slate-900">{item}</h2>
              <p className="mt-1 text-sm text-slate-600">Curated combination of products available in marketplace.</p>
              <Link href="/marketplace" className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline">
                Explore tools
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
