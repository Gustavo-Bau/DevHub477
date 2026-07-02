import { useMemo, useState } from 'react';
import Seo from '../seo/Seo';
import { useCart } from '../context/CartContext';
import { createCheckout, finalizeOrder } from '../services/checkoutService';
import CheckoutStepper from '../components/checkout/CheckoutStepper';
import PaymentMethodSelector from '../components/checkout/PaymentMethodSelector';
import CreditCardForm from '../components/checkout/CreditCardForm';
import CheckoutSummary from '../components/checkout/CheckoutSummary';
import SecurityInfo from '../components/checkout/SecurityInfo';
import EmptyCartState from '../components/checkout/EmptyCartState';
import CheckoutLoadingState from '../components/checkout/CheckoutLoadingState';
import ErrorState from '../components/ErrorState';

export default function CheckoutPage() {
  const { items, loading, error, subtotal, discount, total, applyCoupon, loadCart } = useCart();
  const [method, setMethod] = useState('card');
  const [form, setForm] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const errors = useMemo(
    () => ({
      name: !form.name.trim(),
      number: form.number.replace(/\s/g, '').length !== 16,
      expiry: !/^\d{2}\/\d{2}$/.test(form.expiry),
      cvv: form.cvv.length < 3,
    }),
    [form],
  );

  const cardValid = !Object.values(errors).some(Boolean);
  const canSubmit = items.length > 0 && (method !== 'card' || cardValid) && !status.loading;

  const handleSubmit = async () => {
    setStatus({ loading: true, error: '', success: '' });
    try {
      const checkout = await createCheckout({ items, method });
      await finalizeOrder({ checkoutId: checkout.id, payment: method === 'card' ? form : { method }, total });
      setStatus({ loading: false, error: '', success: 'Pagamento enviado com sucesso. Aguarde a confirmação do pedido.' });
    } catch (e) {
      setStatus({ loading: false, error: e.message || 'Não foi possível concluir a compra.', success: '' });
    }
  };

  return (
    <section className="page-shell" style={{ paddingTop: '2rem' }}>
      <Seo title='Checkout | DEVHUB' description='Finalize sua compra com segurança no DEVHUB.' path='/checkout' />

      <div className="section-header" style={{ marginBottom: '1.75rem' }}>
        <div>
          <p className="eyebrow">Finalizar pedido</p>
          <h1 style={{ margin: 0 }}>Checkout e pagamento</h1>
          <p className="muted" style={{ marginTop: '0.75rem' }}>
            Revise seu pedido, escolha uma forma de pagamento e conclua com segurança.
          </p>
        </div>
      </div>

      <CheckoutStepper />

      {loading && <CheckoutLoadingState />}

      {!loading && error && items.length === 0 && (
        <ErrorState message={error} retry={<button className='btn btn-secondary' onClick={loadCart}>Tentar novamente</button>} />
      )}

      {!loading && error && items.length > 0 && (
        <div className='alert-error' style={{ marginBottom: '1.25rem' }}>{error}</div>
      )}

      {!loading && items.length === 0 && !error && <EmptyCartState />}

      {!loading && items.length > 0 && (
        <div className='checkout-grid' style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.9fr', gap: '1.5rem' }}>
          <article className='card card-surface'>
            <div className='section-header' style={{ marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ margin: 0 }}>Pagamento</h2>
                <p className='muted' style={{ margin: '0.65rem 0 0' }}>
                  Escolha o método e verifique os dados antes de concluir.
                </p>
              </div>
            </div>

            <PaymentMethodSelector value={method} onChange={setMethod} />

            {method === 'card' ? (
              <CreditCardForm form={form} setForm={setForm} errors={errors} />
            ) : (
              <div className='card card-surface' style={{ marginTop: '1rem' }}>
                <p className='muted'>As instruções de pagamento serão enviadas após o pedido.</p>
              </div>
            )}

            {status.error ? <div className='alert-error' style={{ marginTop: '1rem' }}>{status.error}</div> : null}
            {status.success ? <div className='alert-success' style={{ marginTop: '1rem' }}>{status.success}</div> : null}

            <button className='btn btn-primary btn-full' onClick={handleSubmit} disabled={!canSubmit} style={{ marginTop: '1.5rem' }}>
              {status.loading ? 'Processando...' : 'Concluir compra'}
            </button>

            <SecurityInfo />
          </article>

          <CheckoutSummary items={items} subtotal={subtotal} discount={discount} total={total} onApplyCoupon={applyCoupon} />
        </div>
      )}
    </section>
  );
}
