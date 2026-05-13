import { useState } from 'react';
export default function PromoCodeInput({onApply}){const [code,setCode]=useState('');return <div className='promo'><input className='input' value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder='Cupom promocional'/><button type='button' className='btn btn-secondary' onClick={()=>onApply(code)} disabled={!code.trim()}>Aplicar</button></div>}
