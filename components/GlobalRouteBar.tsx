import Link from 'next/link';

const routes = [
  ['/', 'Home'],
  ['/login', 'Login'],
  ['/create-account', 'Create Account'],
  ['/create-account-comprehensive', 'Cadastro Completo'],
  ['/dashboard', 'Dashboard'],
  ['/marketplace', 'Marketplace'],
  ['/product/cloudscale-pro', 'Produto'],
  ['/checkout', 'Checkout'],
  ['/order-confirmation', 'Confirmação'],
  ['/billing/invoices', 'Faturas'],
  ['/settings/profile', 'Perfil'],
  ['/settings/security', 'Segurança'],
  ['/settings/notifications', 'Notificações'],
  ['/subscriptions/cloudscale-pro', 'Assinatura']
] as const;

export function GlobalRouteBar() {
  return (
    <div className="sticky top-0 z-[60] border-b border-slate-200/60 bg-white/90 px-3 py-2 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl flex-wrap gap-2">
        {routes.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/10"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
