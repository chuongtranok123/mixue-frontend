import {createContext,useContext,useEffect,useState,ReactNode} from 'react'
import {Product,CartItem,Order,Session,User,Status} from './types'
import {load,save,sha} from './storage'
import {INIT_PRODUCTS,INIT_CATS} from './data'
const ADMIN_USER='admin',ADMIN_PASS='MixueDemo@123' // CHỈ DÙNG DEMO
const Ctx=createContext<any>(null)
export const useStore=()=>useContext(Ctx)
export function Provider({children}:{children:ReactNode}){
const [products,setProducts]=useState<Product[]>(()=>load('mx_products',INIT_PRODUCTS))
const [cats,setCats]=useState<string[]>(()=>load('mx_cats',INIT_CATS))
const [cart,setCart]=useState<CartItem[]>(()=>load('mx_cart',[]))
const [orders,setOrders]=useState<Order[]>(()=>load('mx_orders',[]))
const [users,setUsers]=useState<User[]>(()=>load('mx_users',[]))
const [session,setSession]=useState<Session|null>(()=>load('mx_session',null))
const [toast,setToast]=useState('')
useEffect(()=>save('mx_products',products),[products])
useEffect(()=>save('mx_cats',cats),[cats])
useEffect(()=>save('mx_cart',cart),[cart])
useEffect(()=>save('mx_orders',orders),[orders])
useEffect(()=>save('mx_users',users),[users])
useEffect(()=>save('mx_session',session),[session])
const notify=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),2500)}
const addToCart=(id:string,qty=1):string|null=>{
 const p=products.find(x=>x.id===id);if(!p||!p.visible||p.stock<=0)return 'Sản phẩm đã hết hàng'
 const cur=cart.find(c=>c.id===id)?.qty||0
 if(cur+qty>p.stock)return `Chỉ còn ${p.stock} sản phẩm trong kho`
 setCart(cur?cart.map(c=>c.id===id?{...c,qty:cur+qty}:c):[...cart,{id,qty}]);notify('Đã thêm vào giỏ hàng');return null}
const setQty=(id:string,q:number)=>{const p=products.find(x=>x.id===id);const m=p?Math.min(q,p.stock):q
 setCart(m<1?cart.filter(c=>c.id!==id):cart.map(c=>c.id===id?{...c,qty:m}:c))}
const removeItem=(id:string)=>setCart(cart.filter(c=>c.id!==id))
const placeOrder=(info:{name:string;phone:string;address:string;note:string}):Order|string=>{
 if(!cart.length)return 'Giỏ hàng trống'
 const items=[];for(const c of cart){const p=products.find(x=>x.id===c.id)
  if(!p||p.stock<c.qty)return `"${p?.name||'Sản phẩm'}" không đủ tồn kho`
  items.push({id:p.id,name:p.name,price:p.price,qty:c.qty})}
 const o:Order={id:'MX'+Date.now().toString(36).toUpperCase()+Math.random().toString(36).slice(2,5).toUpperCase(),items,...info,payment:'COD',
  total:items.reduce((s,i)=>s+i.price*i.qty,0),status:'Chờ xác nhận',createdAt:new Date().toISOString()}
 setProducts(products.map(p=>{const i=items.find(x=>x.id===p.id);return i?{...p,stock:p.stock-i.qty}:p}))
 setOrders([o,...orders]);setCart([]);return o}
const setStatus=(id:string,s:Status)=>{const o=orders.find(x=>x.id===id);if(!o||o.status==='Đã hủy'||o.status===s)return
 if(s==='Đã hủy')setProducts(products.map(p=>{const i=o.items.find(x=>x.id===p.id);return i?{...p,stock:p.stock+i.qty}:p})) // hoàn kho đúng 1 lần
 setOrders(orders.map(x=>x.id===id?{...x,status:s}:x))}
const login=async(u:string,pw:string)=>{const h=await sha(pw)
 if(u===ADMIN_USER){if(h===await sha(ADMIN_PASS)){setSession({name:'Admin',role:'admin'});return null}return 'Sai tên đăng nhập hoặc mật khẩu'}
 const f=users.find(x=>x.username===u.toLowerCase()&&x.hash===h);if(!f)return 'Sai tên đăng nhập hoặc mật khẩu'
 setSession({name:f.username,role:'user'});return null}
const register=async(u:string,pw:string)=>{const n=u.trim().toLowerCase()
 if(n.length<3||pw.length<6)return 'Tên ≥ 3 ký tự, mật khẩu ≥ 6 ký tự'
 if(n===ADMIN_USER||users.some(x=>x.username===n))return 'Tên đăng nhập đã tồn tại'
 setUsers([...users,{username:n,hash:await sha(pw)}]);setSession({name:n,role:'user'});return null}
const logout=()=>setSession(null)
return <Ctx.Provider value={{products,setProducts,cats,setCats,cart,addToCart,setQty,removeItem,orders,placeOrder,setStatus,session,login,register,logout,notify}}>
{children}{toast&&<div className="fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 rounded-full bg-[#222] px-5 py-2 text-sm text-white shadow-lg">{toast}</div>}</Ctx.Provider>}
