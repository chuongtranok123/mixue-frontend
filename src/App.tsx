import {useState} from 'react'
import {Routes,Route,Link,NavLink,useNavigate,Navigate} from 'react-router-dom'
import {ShoppingCart,Search,Menu,X,LogOut,User} from 'lucide-react'
import {useStore} from './store'
import {Home,Detail} from './pages/Shop'
import {Cart,Checkout,Success} from './pages/Cart'
import Login from './pages/Login'
import Admin from './pages/Admin'
function Header(){
 const {cart,session,logout}=useStore();const nav=useNavigate();const [open,setOpen]=useState(false);const [q,setQ]=useState('')
 const count=cart.reduce((s:number,c:any)=>s+c.qty,0)
 const links=[['/','Trang chủ'],['/?cat=all','Thực đơn'],['/?cat=Kem','Kem'],['/?cat=__drinks','Đồ uống']]
 return <header className="sticky top-0 z-50 bg-white shadow-sm"><div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2">
 <Link to="/"><img src="https://ibb.co/0jpDnZg1" alt="MIXUE" className="h-11 w-11 rounded-full"/></Link>
 <nav className="hidden gap-5 text-sm font-medium md:flex">{links.map(([t,n])=><NavLink key={n} to={t} className="hover:text-mx">{n}</NavLink>)}</nav>
 <form className="relative ml-auto hidden max-w-xs flex-1 sm:block" onSubmit={e=>{e.preventDefault();nav('/?q='+encodeURIComponent(q))}}>
 <Search size={16} className="absolute left-3 top-2.5 text-sub"/><input className="inp pl-9" placeholder="Tìm sản phẩm..." value={q} onChange={e=>setQ(e.target.value)}/></form>
 <Link to="/cart" className="relative ml-auto sm:ml-0"><ShoppingCart/>{count>0&&<span className="absolute -right-2 -top-2 rounded-full bg-mx px-1.5 text-[10px] text-white">{count}</span>}</Link>
 <div className="hidden items-center gap-2 md:flex">{session?<>
 <span className="flex items-center gap-1 text-sm"><User size={14}/>{session.name}</span>
 {session.role==='admin'&&<Link to="/admin" className="btn-o">Admin</Link>}
 <button className="btn" onClick={()=>{logout();nav('/')}}><LogOut size={14}/>Đăng xuất</button></>:<Link to="/login" className="btn">Đăng nhập</Link>}</div>
 <button className="md:hidden" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div>
 {open&&<div className="space-y-3 border-t px-4 py-3 md:hidden" onClick={()=>setOpen(false)}>
 {links.map(([t,n])=><Link key={n} to={t} className="block">{n}</Link>)}
 <form onSubmit={e=>{e.preventDefault();nav('/?q='+encodeURIComponent(q))}}><input className="inp" placeholder="Tìm sản phẩm..." value={q} onChange={e=>setQ(e.target.value)} onClick={e=>e.stopPropagation()}/></form>
 {session?<>{session.role==='admin'&&<Link to="/admin" className="block text-mx">Quản trị</Link>}<button onClick={()=>{logout();nav('/')}}>Đăng xuất ({session.name})</button></>:<Link to="/login" className="block text-mx">Đăng nhập</Link>}</div>}</header>}
export default function App(){
 return <Routes>
 <Route path="/admin" element={<Admin/>}/>
 <Route path="*" element={<div className="flex min-h-screen flex-col"><Header/><main className="flex-1"><Routes>
 <Route path="/" element={<Home/>}/><Route path="/product/:id" element={<Detail/>}/><Route path="/cart" element={<Cart/>}/>
 <Route path="/checkout" element={<Checkout/>}/><Route path="/order/:id" element={<Success/>}/><Route path="/login" element={<Login/>}/>
 <Route path="*" element={<Navigate to="/"/>}/></Routes></main>
 <footer className="bg-mx py-6 text-center text-sm text-white">© MIXUE Demo – Website minh họa Frontend, giá và hình ảnh sản phẩm không phải thông tin chính thức.</footer></div>}/></Routes>}
