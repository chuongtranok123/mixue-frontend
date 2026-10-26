export function load<T>(k:string,def:T):T{try{const r=localStorage.getItem(k);if(!r)return def;const v=JSON.parse(r);return v===null?def:v}catch{return def}}
export function save(k:string,v:unknown){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){console.warn('Không ghi được localStorage',e)}}
export async function sha(s:string){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('')}
export const vnd=(n:number)=>n.toLocaleString('vi-VN')+'đ'
export const emoji=(c:string)=>c==='Kem'?'🍦':c==='Trà sữa'?'🧋':c==='Trà trái cây'?'🍑':c==='Trà nguyên vị'?'🍵':'🥤'
