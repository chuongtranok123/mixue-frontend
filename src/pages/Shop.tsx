import {Link,useParams,useSearchParams} from 'react-router-dom'
import {useState} from 'react'
import {useStore} from '../store'
import {Product} from '../types'
import {vnd,emoji} from '../storage'
export const Img=({p,big}:{p:Product;big?:boolean})=>p.image?<img src={p.image} alt={p.name} className={`w-full rounded-xl object-cover ${big?'aspect-square':'aspect-[4/3]'}`}/>:
 <div className={`flex w-full items-center justify-center rounded-xl bg-gradient-to-br from-red-50 to-red-100 ${big?'aspect-square text-8xl':'aspect-[4/3] text-5xl'}`}>{emoji(p.category)}</div>
function Card({p}:{p:Product}){const {addToCart,notify}=useStore();const out=p.stock<=0
 return <div className="card flex flex-col p-3"><Img p={p}/><div className="mt-3 flex-1"><span className="text-xs text-mx">{p.category}</span>
 <h3 className="font-semibold">{p.name}</h3><p className="line-clamp-2 text-xs text-sub">{p.description}</p></div>
 <div className="mt-2 flex items-center justify-between"><b className="text-mx">{vnd(p.price)}</b><span className={`text-xs ${out?'text-gray-400':'text-green-600'}`}>{out?'Hết hàng':`Còn ${p.stock}`}</span></div>
 <div className="mt-3 flex gap-2"><Link to={`/product/${p.id}`} className="btn-o flex-1">Xem chi tiết</Link>
 <button className="btn flex-1" disabled={out} onClick={()=>{const e=addToCart(p.id);if(e)notify(e)}}>Thêm vào giỏ</button></div></div>}
export function Home(){
 const {products,cats}=useStore();const [sp,setSp]=useSearchParams();const cat=sp.get('cat')||'all';const q=(sp.get('q')||'').toLowerCase()
 const list=(products as Product[]).filter(p=>p.visible&&(cat==='all'||(cat==='__drinks'?p.category!=='Kem':p.category===cat))&&p.name.toLowerCase().includes(q))
 const setCat=(c:string)=>{const n=new URLSearchParams(sp);n.set('cat',c);setSp(n)}
 const chips=[['all','Tất cả'],...cats.map((c:string)=>[c,c])]
 return <><section className="bg-white"><div className="mx-auto grid max-w-6xl items-center gap-6 px-4 py-10 md:grid-cols-2">
 <div><h1 className="text-3xl font-extrabold text-mx md:text-5xl">MIXUE – Mát lạnh mỗi ngày</h1>
 <p className="mt-4 text-sub">Thế giới kem tươi và đồ uống thơm ngon đang chờ bạn khám phá</p>
 <button className="btn mt-6 px-6 py-3" onClick={()=>document.getElementById('menu')?.scrollIntoView({behavior:'smooth'})}>Đặt hàng ngay</button></div>
 <img src="/images/mixue-banner.jpg" alt="Banner MIXUE" className="w-full object-contain"/></div></section>
 <section id="menu" className="bg-soft py-8"><div className="mx-auto max-w-6xl px-4">
 <div className="mb-6 flex flex-wrap gap-2">{chips.map(([k,t])=><button key={k} onClick={()=>setCat(k)} className={`rounded-full border px-4 py-1.5 text-sm ${cat===k?'border-mx bg-mx text-white':'bg-white hover:border-mx'}`}>{t}</button>)}</div>
 {q&&<p className="mb-3 text-sm text-sub">Kết quả cho “{sp.get('q')}”</p>}
 {list.length?<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{list.map(p=><Card key={p.id} p={p}/>)}</div>:
 <div className="py-16 text-center text-sub">😕 Không tìm thấy sản phẩm phù hợp.</div>}</div></section></>}
export function Detail(){
 const {id}=useParams();const {products,addToCart,notify}=useStore();const p:Product|undefined=products.find((x:Product)=>x.id===id);const [qty,setQty]=useState(1)
 if(!p||!p.visible)return <div className="py-20 text-center">Không tìm thấy sản phẩm. <Link to="/" className="text-mx underline">Về trang chủ</Link></div>
 const out=p.stock<=0
 return <div className="mx-auto grid max-w-4xl gap-8 px-4 py-10 md:grid-cols-2"><Img p={p} big/>
 <div><span className="text-sm text-mx">{p.category}</span><h1 className="text-3xl font-bold">{p.name}</h1><p className="mt-3 text-sub">{p.description}</p>
 <p className="mt-4 text-2xl font-bold text-mx">{vnd(p.price)}</p><p className={`mt-1 text-sm ${out?'text-gray-400':'text-green-600'}`}>{out?'Hết hàng':`Còn ${p.stock} sản phẩm`}</p>
 {!out&&<div className="mt-5 flex items-center gap-3"><button className="btn-o h-9 w-9 !p-0" onClick={()=>setQty(Math.max(1,qty-1))}>−</button><span className="w-8 text-center">{qty}</span>
 <button className="btn-o h-9 w-9 !p-0" onClick={()=>setQty(Math.min(p.stock,qty+1))}>+</button></div>}
 <button className="btn mt-6 px-6 py-3" disabled={out} onClick={()=>{const e=addToCart(p.id,qty);if(e)notify(e)}}>Thêm vào giỏ</button>
 <Link to="/" className="mt-4 block text-sm text-sub underline">← Tiếp tục xem thực đơn</Link></div></div>}
