import { ActionHubPage } from '@/components/ActionHubPage';

export default function CartPage() {
  return (
    <ActionHubPage
      title="Marketplace Cart"
      description="Confira os itens selecionados e continue para o checkout com segurança."
      links={[
        { href: '/checkout', label: 'Ir para checkout' },
        { href: '/marketplace', label: 'Continuar comprando' },
        { href: '/billing/invoices', label: 'Ver métodos de pagamento' },
        { href: '/dashboard', label: 'Voltar ao dashboard' }
      ]}
    />
  );
}
