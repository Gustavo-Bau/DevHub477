import Seo from '../seo/Seo';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import QuantityControl from '../components/QuantityControl';

export default function CartPage() {
  const { items, loading, error, total, removeFromCart, loadCart, updateItemQuantity } = useCart();

  if (loading) return <LoadingState message='Carregando carrinho...' />;
  if (error && !items.length) return <ErrorState message={error} retry={<button className='btn btn-secondary' onClick={loadCart}>Tentar novamente</button>} />;
  if (!items.length) return <EmptyState title='Seu carrinho está vazio' message='Adicione um produto ao carrinho para continuar.' action={<Link className='btn btn-primary' to='/mercado'>Explorar marketplace</Link>} />;

  return (
    <section className='cart-page'>
      <Seo title='Carrinho | DEVHUB' description='Revise itens do carrinho.' path='/carrinho' />
      <div className='page-header'>
        <div>
          <span className='eyebrow'>Carrinho</span>
          <h1>Reveja seu pedido</h1>
          <p className='muted'>Ajuste quantidades, remova itens e avance para o checkout com confiança.</p>
        </div>
      </div>

      <div className='cart-grid'>
        <div className='cart-items'>
          {error ? <div className='msg err' style={{ marginBottom: '1rem' }}>{error}</div> : null}
          {items.map((item) => (
            <article key={item.id || item.slug} className='cart-item-card'>
              <img src={item.image || item.imagem_principal || 'https://via.placeholder.com/150'} alt={item.name || item.nome} className='cart-item-image' />
              <div className='cart-item-content'>
                <div>
                  <h3>{item.name || item.nome}</h3>
                  <p className='muted'>{item.category || item.categoria || 'Software SaaS'}</p>
                  <p className='text-purple'>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(item.price || 0))}</p>
                </div>
                <div className='cart-item-actions'>
                  <QuantityControl
                    quantity={Number(item.quantity || 1)}
                    onChange={(nextQuantity) => updateItemQuantity(item.id || item.slug, nextQuantity)}
                  />
                  <button className='btn btn-secondary btn-sm' onClick={() => removeFromCart(item.id || item.slug)}>
                    Remover
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className='cart-sidebar card sticky-sidebar'>
          <h2>Resumo do pedido</h2>
          <div className='summary-list'>
            <div className='summary-row'><span>Subtotal</span><strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</strong></div>
            <div className='summary-row'><span>Descontos</span><strong>R$ 0,00</strong></div>
            <div className='summary-row total-row'><span>Total</span><strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</strong></div>
          </div>
          <button className='btn btn-primary btn-full'>Finalizar Compra</button>
          <Link className='btn btn-secondary btn-full' to='/mercado'>Continuar comprando</Link>
        </aside>
      </div>
    </section>
  );
}
