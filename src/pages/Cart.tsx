import {Link,useNavigate,useParams} from 'react-router-dom'
import {useState} from 'react'
import {Trash2} from 'lucide-react'
import {useStore} from '../store'
import {Product,Order} from '../types'
import {vnd} from '../storage'
import {Img} from './Shop'
function useLines(){const {cart,products}=useStore()
 const lines=(cart as any[]).map(c=>({p:products.find((x:Product)=>x.id===c.id) as Product,qty:c.qty})).filter(l=>l.p)
 return {lines,total:lines.reduce((s,l)=>s+l.p.price*l.qty,0),count:lines.reduce((s,l)=>s+l.qty,0)}}
export function Cart(){
 const {setQty,removeItem}=useStore();const {lines,total,count}=useLines()
 if(!lines.length)return <div className="py-20 text-center"><div className="text-5xl">🛒</div><p className="my-3 text-sub">Giỏ hàng đang trống</p><Link to="/" className="btn">Tiếp tục mua hàng</Link></div>
 return <div className="mx-auto max-w-3xl px-4 py-8"><h1 className="mb-4 text-2xl font-bold">Giỏ hàng ({count} sản phẩm)</h1>
 <div className="space-y-3">{lines.map(({p,qty})=><div key={p.id} className="card flex items-center gap-3 p-3"><div className="w-20"><Img p={p}/></div>
 <div className="flex-1"><b>{p.name}</b><div className="text-sm text-sub">{vnd(p.price)}</div>
 <div className="mt-1 flex items-center gap-2"><button className="rounded border px-2" onClick={()=>setQty(p.id,qty-1)}>−</button>{qty}
 <button className="rounded border px-2 disabled:opacity-40" disabled={qty>=p.stock} onClick={()=>setQty(p.id,qty+1)}>+</button></div></div>
 <div className="text-right"><b className="text-mx">{vnd(p.price*qty)}</b><button className="mt-2 block text-sub hover:text-mx" onClick={()=>removeItem(p.id)}><Trash2 size={16}/></button></div></div>)}</div>
 <div className="mt-6 flex items-center justify-between rounded-2xl bg-soft p-4"><span>Tổng tiền</span><b className="text-xl text-mx">{vnd(total)}</b></div>
 <div className="mt-4 flex gap-3"><Link to="/" className="btn-o flex-1">Tiếp tục mua hàng</Link><Link to="/checkout" className="btn flex-1">Tiến hành đặt hàng</Link></div></div>}
export function Checkout(){
 const {placeOrder}=useStore();const nav=useNavigate();const {lines,total}=useLines()
 const [f,setF]=useState({name:'',phone:'',address:'',note:''});const [err,setErr]=useState<Record<string,string>>({})
 if(!lines.length)return <div className="py-20 text-center">Giỏ hàng trống. <Link to="/" className="text-mx underline">Quay lại mua hàng</Link></div>
 const submit=(e:React.FormEvent)=>{e.preventDefault();const x:Record<string,string>={}
  if(f.name.trim().length<2)x.name='Vui lòng nhập họ tên'
  if(!/^(0|\+84)\d{9}$/.test(f.phone.trim()))x.phone='Số điện thoại không hợp lệ'
  if(f.address.trim().length<5)x.address='Vui lòng nhập địa chỉ giao hàng'
  setErr(x);if(Object.keys(x).length)return
  const r=placeOrder({...f,name:f.name.trim(),phone:f.phone.trim(),address:f.address.trim()})
  if(typeof r==='string')setErr({form:r});else nav('/order/'+r.id)}
 const fld=(k:'name'|'phone'|'address'|'note',l:string)=><label className="block text-sm">{l}<input className="inp mt-1" value={f[k]} onChange={e=>setF({...f,[k]:e.target.value})}/>{err[k]&&<span className="text-xs text-mx">{err[k]}</span>}</label>
 return <form onSubmit={submit} className="mx-auto grid max-w-4xl gap-6 px-4 py-8 md:grid-cols-2"><div className="space-y-3"><h1 className="text-2xl font-bold">Thông tin đặt hàng</h1>
 {fld('name','Họ tên người nhận')}{fld('phone','Số điện thoại')}{fld('address','Địa chỉ giao hàng')}{fld('note','Ghi chú')}
 <label className="flex items-center gap-2 rounded-lg border p-3 text-sm"><input type="radio" checked readOnly/>Thanh toán khi nhận hàng (COD) – demo</label></div>
 <div className="h-fit rounded-2xl bg-soft p-4"><h2 className="mb-2 font-bold">Đơn hàng</h2>{lines.map(({p,qty})=><div key={p.id} className="flex justify-between py-1 text-sm"><span>{p.name} × {qty}</span><span>{vnd(p.price*qty)}</span></div>)}
 <div className="mt-2 flex justify-between border-t pt-2"><b>Tổng</b><b className="text-mx">{vnd(total)}</b></div>
 {err.form&&<p className="mt-2 text-sm text-mx">{err.form}</p>}<button className="btn mt-4 w-full py-3">Xác nhận đặt hàng</button>
 <p className="mt-2 text-xs text-sub">Đây là đơn hàng demo, không có giao dịch tiền thật.</p></div></form>}
export function Success(){
 const {id}=useParams();const {orders}=useStore();const o:Order|undefined=orders.find((x:Order)=>x.id===id)
 if(!o)return <div className="py-20 text-center">Không tìm thấy đơn hàng. <Link to="/" className="text-mx underline">Trang chủ</Link></div>
 return <div className="mx-auto max-w-lg px-4 py-12 text-center"><div className="text-5xl">✅</div><h1 className="mt-2 text-2xl font-bold text-mx">Đặt hàng demo thành công!</h1>
 <p className="mt-1 text-sm text-sub">Mã đơn: <b>{o.id}</b></p><div className="card mt-5 p-4 text-left">{o.items.map(i=><div key={i.id} className="flex justify-between py-1 text-sm"><span>{i.name} × {i.qty}</span><span>{vnd(i.price*i.qty)}</span></div>)}
 <div className="mt-2 flex justify-between border-t pt-2"><b>Tổng tiền</b><b className="text-mx">{vnd(o.total)}</b></div></div>
 <p className="mt-3 text-xs text-sub">Đơn demo lưu trong trình duyệt, chưa có giao dịch tiền thật.</p><Link to="/" className="btn mt-5">Tiếp tục mua sắm</Link></div>}
