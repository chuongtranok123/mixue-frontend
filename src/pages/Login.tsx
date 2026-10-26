import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useStore} from '../store'
export default function Login(){
 const {login,register}=useStore();const nav=useNavigate();const [reg,setReg]=useState(false);const [u,setU]=useState('');const [p,setP]=useState('');const [err,setErr]=useState('')
 const go=async(e:React.FormEvent)=>{e.preventDefault();const r=await(reg?register(u,p):login(u,p));if(r)setErr(r);else nav('/')}
 return <form onSubmit={go} className="card mx-auto my-12 w-full max-w-sm space-y-3 p-6"><img src="/images/mixue-logo.jpg" alt="MIXUE" className="mx-auto h-16 w-16 rounded-full"/>
 <h1 className="text-center text-xl font-bold">{reg?'Đăng ký tài khoản':'Đăng nhập'}</h1>
 <input className="inp" placeholder="Tên đăng nhập hoặc email" value={u} onChange={e=>setU(e.target.value)}/>
 <input className="inp" type="password" placeholder="Mật khẩu" value={p} onChange={e=>setP(e.target.value)}/>
 {err&&<p className="text-sm text-mx">{err}</p>}<button className="btn w-full py-2.5">{reg?'Đăng ký':'Đăng nhập'}</button>
 <button type="button" className="w-full text-sm text-sub underline" onClick={()=>{setReg(!reg);setErr('')}}>{reg?'Đã có tài khoản? Đăng nhập':'Chưa có tài khoản? Đăng ký (User)'}</button></form>}
