import {useState} from 'react'
import {Navigate,Link} from 'react-router-dom'
import {LayoutDashboard,Package,Tags,ClipboardList,LogOut} from 'lucide-react'
import {useStore} from '../store'
import {Product,Order,STATUSES,Status} from '../types'
import {vnd} from '../storage'
import {Img} from './Shop'
const blank:Product={id:'',name:'',category:'',description:'',price:0,stock:0,image:'',visible:true}
function ProductForm({init,onClose}:{init:Product;onClose:()=>void}){
 const {products,setProducts,cats,notify}=useStore();const [f,setF]=useState<Product>({...init,category:init.category||cats[0]||''});const [err,setErr]=useState('')
 const file=(e:React.ChangeEvent<HTMLInputElement>)=>{const x=e.target.files?.[0];if(!x)return
  if(!/^image\/(png|jpe?g|webp)$/.test(x.type))return setErr('Chỉ nhận PNG/JPG/WEBP');if(x.size>300*1024)return setErr('Ảnh tối đa 300KB')
  const r=new FileReader();r.onload=()=>setF({...f,image:String(r.result)});r.readAsDataURL(x)}
 const save=()=>{if(!f.name.trim())return setErr('Tên sản phẩm không được để trống')
  if(!(f.price>0))return setErr('Giá phải lớn hơn 0');if(!Number.isInteger(f.stock)||f.stock<0)return setErr('Tồn kho phải là số nguyên không âm')
  const n={...f,name:f.name.trim()};setProducts(n.id?products.map((p:Product)=>p.id===n.id?n:p):[...products,{...n,id:'p'+Date.now()}]);notify('Đã lưu sản phẩm');onClose()}
 return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><div className="max-h-full w-full max-w-md space-y-2 overflow-auto rounded-2xl bg-white p-5">
 <h3 className="font-bold">{f.id?'Sửa':'Thêm'} sản phẩm</h3>
 <input className="inp" placeholder="Tên sản phẩm" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/>
 <select className="inp" value={f.category} onChange={e=>setF({...f,category:e.target.value})}>{cats.map((c:string)=><option key={c}>{c}</option>)}</select>
 <textarea className="inp" placeholder="Mô tả" value={f.description} onChange={e=>setF({...f,description:e.target.value})}/>
 <div className="flex gap-2"><input className="inp" type="number" placeholder="Giá (VNĐ)" value={f.price||''} onChange={e=>setF({...f,price:Number(e.target.value)})}/>
 <input className="inp" type="number" placeholder="Tồn kho" value={f.stock} onChange={e=>setF({...f,stock:Number(e.target.value)})}/></div>
 <input className="inp" placeholder="URL ảnh (tùy chọn)" value={f.image.startsWith('data:')?'(ảnh tải lên)':f.image} onChange={e=>setF({...f,image:e.target.value})}/>
 <input type="file" accept="image/png,image/jpeg,image/webp" onChange={file} className="text-xs"/>
 <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.visible} onChange={e=>setF({...f,visible:e.target.checked})}/>Hiển thị trên cửa hàng</label>
 {err&&<p className="text-sm text-mx">{err}</p>}<div className="flex justify-end gap-2"><button className="btn-o" onClick={onClose}>Hủy</button><button className="btn" onClick={save}>Lưu</button></div></div></div>}
export default function Admin(){
 const s=useStore();const {session,logout,products,setProducts,cats,setCats,orders,setStatus,notify}=s
 const [tab,setTab]=useState('dash');const [edit,setEdit]=useState<Product|null>(null);const [view,setView]=useState<Order|null>(null);const [cn,setCn]=useState('')
 if(!session)return <Navigate to="/login" replace/>;if(session.role!=='admin')return <Navigate to="/" replace/>
 const P=products as Product[],O=orders as Order[]
 const stats=[['Tổng sản phẩm',P.length],['Còn hàng',P.filter(p=>p.stock>0).length],['Hết hàng',P.filter(p=>p.stock<=0).length],['Đơn hàng demo',O.length],
  ['Doanh thu ước tính',vnd(O.filter(o=>o.status==='Hoàn thành').reduce((a,o)=>a+o.total,0))]]
 const tabs=[['dash','Tổng quan',LayoutDashboard],['prod','Quản lý sản phẩm',Package],['cat','Quản lý danh mục',Tags],['ord','Quản lý đơn hàng',ClipboardList]] as const
 const del=(p:Product)=>{if(confirm(`Xóa "${p.name}"?`)){setProducts(P.filter(x=>x.id!==p.id));notify('Đã xóa')}}
 const delCat=(c:string)=>{if(P.some(p=>p.category===c))return notify('Danh mục đang có sản phẩm, hãy chuyển/xóa sản phẩm trước');if(confirm(`Xóa danh mục "${c}"?`))setCats(cats.filter((x:string)=>x!==c))}
 const renCat=(c:string)=>{const n=prompt('Tên mới',c)?.trim();if(!n||n===c)return;if(cats.includes(n))return notify('Tên đã tồn tại')
  setCats(cats.map((x:string)=>x===c?n:x));setProducts(P.map(p=>p.category===c?{...p,category:n}:p))}
 const addCat=()=>{const n=cn.trim();if(!n)return;if(cats.includes(n))return notify('Danh mục đã tồn tại');setCats([...cats,n]);setCn('')}
 return <div className="flex min-h-screen flex-col md:flex-row"><aside className="flex gap-1 overflow-x-auto bg-mx p-3 text-white md:w-60 md:flex-col md:overflow-visible">
 <Link to="/" className="mb-2 hidden items-center gap-2 font-bold md:flex"><img src="/images/mixue-logo.jpg" className="h-10 w-10 rounded-full" alt=""/>MIXUE Admin</Link>
 {tabs.map(([k,t,I])=><button key={k} onClick={()=>setTab(k)} className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm ${tab===k?'bg-white text-mx':'hover:bg-mxd'}`}><I size={16}/>{t}</button>)}
 <button onClick={logout} className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-mxd md:mt-auto"><LogOut size={16}/>Đăng xuất</button></aside>
 <main className="min-w-0 flex-1 bg-soft p-4 md:p-6">
 {tab==='dash'&&<div className="grid grid-cols-2 gap-4 lg:grid-cols-3">{stats.map(([l,v])=><div key={l as string} className="card p-4"><div className="text-sm text-sub">{l}</div><div className="text-2xl font-bold text-mx">{v}</div></div>)}</div>}
 {tab==='prod'&&<><div className="mb-3 flex justify-between"><h1 className="text-xl font-bold">Sản phẩm</h1><button className="btn" onClick={()=>setEdit(blank)}>Thêm sản phẩm</button></div>
 <div className="overflow-x-auto rounded-2xl bg-white shadow"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-gray-50"><tr>{['Ảnh','Tên','Danh mục','Giá','Tồn kho','Trạng thái','Thao tác'].map(h=><th key={h} className="p-3">{h}</th>)}</tr></thead>
 <tbody>{P.map(p=><tr key={p.id} className="border-t"><td className="w-16 p-2"><Img p={p}/></td><td className="p-3">{p.name}</td><td>{p.category}</td><td>{vnd(p.price)}</td><td>{p.stock}</td>
 <td>{!p.visible?'Đang ẩn':p.stock>0?'Còn hàng':'Hết hàng'}</td><td className="space-x-2 whitespace-nowrap">
 <button className="text-blue-600" onClick={()=>setEdit(p)}>Sửa</button>
 {p.stock>0&&<button className="text-orange-600" onClick={()=>setProducts(P.map(x=>x.id===p.id?{...x,stock:0}:x))}>Đặt hết hàng</button>}
 <button className="text-mx" onClick={()=>del(p)}>Xóa</button></td></tr>)}</tbody></table></div></>}
 {tab==='cat'&&<><h1 className="mb-3 text-xl font-bold">Danh mục</h1><div className="mb-3 flex max-w-sm gap-2"><input className="inp" placeholder="Tên danh mục mới" value={cn} onChange={e=>setCn(e.target.value)}/><button className="btn" onClick={addCat}>Thêm</button></div>
 <div className="max-w-sm divide-y rounded-2xl bg-white shadow">{cats.map((c:string)=><div key={c} className="flex items-center justify-between p-3 text-sm"><span>{c} <i className="text-sub">({P.filter(p=>p.category===c).length})</i></span>
 <span className="space-x-3"><button className="text-blue-600" onClick={()=>renCat(c)}>Sửa</button><button className="text-mx" onClick={()=>delCat(c)}>Xóa</button></span></div>)}</div></>}
 {tab==='ord'&&<><h1 className="mb-3 text-xl font-bold">Đơn hàng demo</h1>{!O.length?<p className="text-sub">Chưa có đơn hàng nào.</p>:
 <div className="overflow-x-auto rounded-2xl bg-white shadow"><table className="w-full min-w-[640px] text-left text-sm"><thead className="bg-gray-50"><tr>{['Mã đơn','Người nhận','Tổng tiền','Trạng thái','Thao tác'].map(h=><th key={h} className="p-3">{h}</th>)}</tr></thead>
 <tbody>{O.map(o=><tr key={o.id} className="border-t"><td className="p-3">{o.id}</td><td>{o.name}</td><td>{vnd(o.total)}</td>
 <td><select className="rounded border p-1" value={o.status} disabled={o.status==='Đã hủy'} onChange={e=>setStatus(o.id,e.target.value as Status)}>{STATUSES.map(t=><option key={t}>{t}</option>)}</select></td>
 <td className="space-x-2"><button className="text-blue-600" onClick={()=>setView(o)}>Chi tiết</button>
 {o.status!=='Đã hủy'&&<button className="text-mx" onClick={()=>confirm('Hủy đơn này? Tồn kho sẽ được hoàn lại.')&&setStatus(o.id,'Đã hủy')}>Hủy</button>}</td></tr>)}</tbody></table></div>}</>}
 </main>
 {edit&&<ProductForm init={edit} onClose={()=>setEdit(null)}/>}
 {view&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={()=>setView(null)}><div className="w-full max-w-md space-y-1 rounded-2xl bg-white p-5 text-sm" onClick={e=>e.stopPropagation()}>
 <h3 className="font-bold">Đơn {view.id}</h3><p>Người nhận: {view.name} – {view.phone}</p><p>Địa chỉ: {view.address}</p>{view.note&&<p>Ghi chú: {view.note}</p>}
 <p>Thanh toán: COD (demo) · {new Date(view.createdAt).toLocaleString('vi-VN')}</p>
 {view.items.map(i=><div key={i.id} className="flex justify-between"><span>{i.name} × {i.qty}</span><span>{vnd(i.price*i.qty)}</span></div>)}
 <p className="border-t pt-1 font-bold">Tổng: {vnd(view.total)}</p><button className="btn mt-2" onClick={()=>setView(null)}>Đóng</button></div></div>}</div>}
