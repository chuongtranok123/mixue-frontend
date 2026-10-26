# MIXUE Frontend (React + TS + Vite + Tailwind)
## Chạy
npm install && npm run dev
## Đổi logo/banner
Thay public/images/mixue-logo.jpg và public/images/mixue-banner.jpg (giữ nguyên tên tệp).
## Tài khoản Admin demo
admin / MixueDemo@123 (cấu hình ở src/store.tsx). CHỈ DÙNG DEMO, KHÔNG dùng cho website công khai.
## Xóa dữ liệu demo
Mở DevTools > Console: localStorage.clear() rồi tải lại trang (hoặc xóa các khóa mx_*).
## Giới hạn do không có Backend/Database
- Đăng nhập/phân quyền chỉ mang tính mô phỏng; ai sửa localStorage/mã nguồn đều có thể vượt qua. Không an toàn tuyệt đối.
- Mật khẩu User chỉ băm SHA-256 (không muối) để không lưu văn bản thuần; không đủ chuẩn bảo mật thật.
- Dữ liệu chỉ nằm trong trình duyệt hiện tại, không đồng bộ giữa thiết bị; người dùng khác không thấy đơn của nhau.
- Giá, mô tả, tên sản phẩm là dữ liệu minh họa, không phải thông tin chính thức. Không có thanh toán thật.
- Ảnh tải lên lưu dạng base64 (tối đa 300KB) nên dễ đầy dung lượng localStorage (~5MB).
