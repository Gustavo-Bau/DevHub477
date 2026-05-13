import { products } from '../data/products';
export async function fetchProducts(){
  try{const r=await fetch('/api/products',{headers:{Accept:'application/json'}});if(r.ok){return await r.json();}}catch{}
  return products;
}
export async function fetchProductByIdOrSlug(idOrSlug){
  try{const r=await fetch(`/api/products/${encodeURIComponent(idOrSlug)}`,{headers:{Accept:'application/json'}});if(r.ok)return await r.json();}catch{}
  return products.find(p=>p.slug===idOrSlug||p.id===idOrSlug)||null;
}
