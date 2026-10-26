export interface Product{id:string;name:string;category:string;description:string;price:number;stock:number;image:string;visible:boolean}
export interface CartItem{id:string;qty:number}
export const STATUSES=['Chờ xác nhận','Đã xác nhận','Đang chuẩn bị','Đang giao','Hoàn thành','Đã hủy'] as const
export type Status=typeof STATUSES[number]
export interface OrderItem{id:string;name:string;price:number;qty:number}
export interface Order{id:string;items:OrderItem[];name:string;phone:string;address:string;note:string;payment:'COD';total:number;status:Status;createdAt:string}
export interface User{username:string;hash:string}
export interface Session{name:string;role:'admin'|'user'}
