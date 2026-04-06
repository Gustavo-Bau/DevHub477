import Link from 'next/link';

export default function SettingsSecurityPage() {
  return (
    <main className="min-h-screen bg-background-light px-4 py-8 lg:px-10">
      <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Settings</p>
            <h1 className="text-3xl font-black text-slate-900">Security & Access</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/settings/billing" className="rounded-lg border border-primary/30 px-4 py-2 text-sm font-semibold text-primary">Billing</Link>
            <Link href="/dashboard" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Voltar ao dashboard</Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="font-bold text-slate-900">Senha</h2>
            <p className="mt-1 text-sm text-slate-600">Última alteração: há 34 dias.</p>
            <button className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Alterar senha</button>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="font-bold text-slate-900">Autenticação em 2 fatores</h2>
            <p className="mt-1 text-sm text-slate-600">Recomendado para proteger sua conta.</p>
            <button className="mt-3 rounded-lg border border-primary/30 px-4 py-2 text-sm font-semibold text-primary">Configurar 2FA</button>
          </article>
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
            <h2 className="font-bold text-slate-900">Sessões ativas</h2>
            <p className="mt-1 text-sm text-slate-600">Gerencie dispositivos conectados e encerre sessões antigas.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Ver sessões</button>
              <button className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700">Encerrar outras sessões</button>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
