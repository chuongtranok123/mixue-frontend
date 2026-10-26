import {Product} from './types'
// DỮ LIỆU MINH HỌA: tên, giá, mô tả không phải thông tin bán hàng chính thức của MIXUE.
export const INIT_CATS=['Kem','Trà sữa','Trà trái cây','Trà nguyên vị','Đồ uống khác']
const p=(id:string,name:string,category:string,price:number,stock:number,description:string):Product=>({id,name,category,price,stock,description,image:'',visible:true})
export const INIT_PRODUCTS:Product[]=[
p('p1','Kem ốc quế','Kem',10000,50,'Kem tươi mềm mịn trong vỏ ốc quế giòn (giá minh họa).'),
p('p2','Kem tươi vị sữa','Kem',15000,40,'Kem tươi vị sữa béo nhẹ, mát lạnh (giá minh họa).'),
p('p3','Sundae dâu','Kem',22000,0,'Kem tươi phủ sốt dâu (giá minh họa, đang hết hàng).'),
p('p4','Trà sữa trân châu','Trà sữa',25000,30,'Trà sữa thơm béo cùng trân châu dai (giá minh họa).'),
p('p5','Trà sữa matcha','Trà sữa',29000,20,'Matcha thanh nhẹ kết hợp sữa tươi (giá minh họa).'),
p('p6','Trà đào','Trà trái cây',28000,25,'Trà đào thơm mát, miếng đào giòn ngọt (giá minh họa).'),
p('p7','Trà chanh','Trà trái cây',20000,35,'Trà chanh tươi giải nhiệt (giá minh họa).'),
p('p8','Trà trái cây nhiệt đới','Trà trái cây',32000,15,'Tổng hợp trái cây theo mùa (giá minh họa).'),
p('p9','Hồng trà','Trà nguyên vị',18000,40,'Hồng trà đậm vị, ít ngọt (giá minh họa).'),
p('p10','Nước ép cam','Đồ uống khác',30000,10,'Cam tươi ép lạnh (giá minh họa).')]
