import Link from 'next/link';

export default function SettingsBillingPage() {
  return (
    <main className="min-h-screen bg-background-light px-6 py-10">
      <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Settings</p>
            <h1 className="text-3xl font-black text-slate-900">Billing & Payments</h1>
          </div>
          <Link href="/billing/invoices" className="rounded-lg border border-primary/30 px-4 py-2 text-sm font-semibold text-primary">
            Open invoices view
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Current Plan</p>
            <p className="mt-2 text-lg font-bold text-slate-900">CloudScale Pro</p>
            <p className="text-sm text-slate-600">$49/month</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Payment Method</p>
            <p className="mt-2 text-lg font-bold text-slate-900">Visa •••• 8812</p>
            <p className="text-sm text-slate-600">Expires 08/25</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase text-slate-500">Next Charge</p>
            <p className="mt-2 text-lg font-bold text-slate-900">Oct 24, 2026</p>
            <p className="text-sm text-slate-600">Auto-renew enabled</p>
          </article>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/settings/billing?saved=1" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
            Save billing changes
          </Link>
          <Link href="/settings/connected-apps" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
            Connected apps
          </Link>
          <Link href="/settings/team" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
            Team management
          </Link>
        </div>
      </section>
    </main>
  );
}
