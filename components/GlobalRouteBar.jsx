import Link from 'next/link';

const routes = [
  ['/', 'Home'],
  ['/marketplace', 'Marketplace'],
  ['/notifications', 'Notificações'],
  ['/marketplace/search', 'Buscar'],
  ['/cart', 'Carrinho'],
  ['/checkout', 'Checkout'],
  ['/settings/notifications', 'Configurações'],
  ['/auth/login', 'Login'],
  ['/auth/register', 'Cadastro']
];

export function GlobalRouteBar() {
  return (
    <nav className="global-route-bar" aria-label="Navegação principal">
      <div className="global-route-bar__inner">
        <ul className="flex flex-wrap gap-2">
          {routes.map(([href, label]) => (
            <li key={href}>
              <Link href={href} className="global-route-bar__link">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
