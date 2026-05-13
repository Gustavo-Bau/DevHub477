export async function getCart(){
  const r=await fetch('/api/cart',{headers:{Accept:'application/json'}});
  if(!r.ok) throw new Error('cart unavailable');
  const data=await r.json();
  return data.items||[];
}
export async function finalizeOrder(payload){
  const r=await fetch('/api/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  if(!r.ok) throw new Error('checkout failed');
  return r.json();
}
