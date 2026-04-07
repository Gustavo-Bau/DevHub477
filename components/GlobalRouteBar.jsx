import Link from 'next/link';

const routes = [
  ['/', 'Home'],
  ['/login', 'Login'],
  ['/create-account', 'Create Account'],
  ['/create-account-comprehensive', 'Cadastro Completo'],
  ['/forgot-password', 'Recuperar Senha'],
  ['/settings/billing', 'Settings Billing'],
  ['/settings/connected-apps', 'Connected Apps'],
  ['/settings/team', 'Team'],
  ['/solutions', 'Solutions'],
  ['/pricing', 'Pricing'],
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
];

export function GlobalRouteBar() {
  return (
    <div className="global-route-bar">
      <div className="global-route-bar__inner">
        {routes.map(([href, label]) => (
          <Link key={href} href={href} className="global-route-bar__link">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
