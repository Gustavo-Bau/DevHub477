import { useMemo,useState } from 'react';
import { useCart } from '../context/CartContext';
import { finalizeOrder } from '../services/checkoutService';
import Seo from '../seo/Seo';
import CheckoutStepper from '../components/checkout/CheckoutStepper';
import PaymentMethodSelector from '../components/checkout/PaymentMethodSelector';
import CreditCardForm from '../components/checkout/CreditCardForm';
import CheckoutSummary from '../components/checkout/CheckoutSummary';
import SecurityBadges from '../components/checkout/SecurityBadges';

export default function CheckoutPage(){
  const {cart}=useCart();
  const [method,setMethod]=useState('card');
  const [form,setForm]=useState({name:'',number:'',expiry:'',cvv:''});
  const [discount,setDiscount]=useState(0);
  const [status,setStatus]=useState({loading:false,error:'',success:''});
  const subtotal=useMemo(()=>cart.items.reduce((acc,i)=>acc+i.price*i.quantity,0),[cart.items]);
  const total=Math.max(subtotal-discount,0);
  const errors={
    name:!form.name.trim(),
    number:form.number.replace(/\s/g,'').length!==16,
    expiry:!/^\d{2}\/\d{2}$/.test(form.expiry),
    cvv:form.cvv.length<3,
  };
  const cardValid=!Object.values(errors).some(Boolean);
  const canSubmit=cart.items.length>0 && (method!=='card'||cardValid) && !status.loading;
  const onApplyCoupon=(code)=>{ if(code==='DEVHUB10') setDiscount(subtotal*0.1); else setDiscount(0); };
  const onSubmit=async()=>{setStatus({loading:true,error:'',success:''}); try{await finalizeOrder({method,form,items:cart.items,total});setStatus({loading:false,error:'',success:'Pagamento enviado com sucesso. Confirmação pendente da API.'});}catch{setStatus({loading:false,error:'Não foi possível concluir agora. Tente novamente em instantes.',success:''});}};
  return <section>
    <Seo title='Checkout | DEVHUB' description='Conclua a compra dos seus softwares com segurança no DEVHUB.' path='/checkout'/>
    <h1>Pagamento</h1>
    <CheckoutStepper/>
    <div className='checkout-grid'>
      <article className='card'>
        <h2>Informações de pagamento</h2>
        <p className='muted'>Escolha o método de pagamento e revise os dados antes de concluir.</p>
        <PaymentMethodSelector value={method} onChange={setMethod}/>
        {method==='card' && <CreditCardForm form={form} setForm={setForm} errors={errors} />}
        {method!=='card' && <p className='muted'>As instruções de {method==='pix'?'Pix':'boleto'} serão disponibilizadas após concluir a compra.</p>}
        <SecurityBadges/>
        {status.error && <p className='msg err'>{status.error}</p>}
        {status.success && <p className='msg ok'>{status.success}</p>}
        <button className='btn btn-primary' onClick={onSubmit} disabled={!canSubmit}>{status.loading?'Processando...':'Concluir compra'}</button>
      </article>
      {cart.loading?<aside className='card'><p>Carregando resumo do pedido...</p></aside>:<CheckoutSummary items={cart.items} subtotal={subtotal} discount={discount} total={total} onApplyCoupon={onApplyCoupon}/>} 
    </div>
  </section>}
