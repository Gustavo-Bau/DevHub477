import { createContext,useContext,useEffect,useState } from 'react';
import { getCart } from '../services/checkoutService';
const CartContext=createContext();
export function CartProvider({children}){const [cart,setCart]=useState({items:[],loading:true,error:''});useEffect(()=>{getCart().then(items=>setCart({items,loading:false,error:''})).catch(()=>setCart({items:[],loading:false,error:'Não foi possível carregar seu carrinho no momento.'}));},[]);return <CartContext.Provider value={{cart,setCart}}>{children}</CartContext.Provider>}
export const useCart=()=>useContext(CartContext);
