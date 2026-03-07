import Link from 'next/link';

export default function SettingsTeamPage() {
  return (
    <main className="min-h-screen bg-background-light px-6 py-10">
      <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Settings</p>
        <h1 className="text-3xl font-black text-slate-900">Team Management</h1>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-slate-200 p-4">
            <h2 className="font-bold text-slate-900">Alex Chen</h2>
            <p className="text-sm text-slate-600">Owner • alex@devhub.io</p>
          </article>
          <article className="rounded-xl border border-slate-200 p-4">
            <h2 className="font-bold text-slate-900">Maya Costa</h2>
            <p className="text-sm text-slate-600">Billing Admin • maya@devhub.io</p>
          </article>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/settings/team?invite=sent" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
            Invite teammate
          </Link>
          <Link href="/settings/connected-apps" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
            Connected apps
          </Link>
        </div>
      </section>
    </main>
  );
}
