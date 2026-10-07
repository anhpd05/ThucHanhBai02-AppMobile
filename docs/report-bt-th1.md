# BÁO CÁO CHỐT YÊU CẦU – BÀI THỰC HÀNH 01

**Nguồn yêu cầu:** `docs/req-bt-th1.md` (đã chốt, không thay đổi)
**Trạng thái:** đã chốt thiết kế – **chưa viết code**
**Ngày chốt:** 2026-09-23

---

## 1. Hợp đồng công việc

### Outcome

01 màn hình **Trang chủ** cho ứng dụng quản lý sinh viên, chạy được trên React
Native 0.87 (Android), gồm 5 khối: Header, Khu vực thống kê, Ô tìm kiếm, Danh
sách môn học, Thanh điều hướng dưới.

### Constraints

| Ràng buộc | Nguồn |
|---|---|
| Chỉ dùng `View`, `Text`, `Image`, `TextInput`, `ScrollView`/`FlatList`, `Pressable`/`TouchableOpacity`, `StyleSheet`, Flexbox | `req-bt-th1.md` mục 3 |
| **Cấm** thư viện UI dựng sẵn thay thế phần lớn giao diện | `req-bt-th1.md` mục 3 |
| Không yêu cầu chuyển màn hình | `req-bt-th1.md` mục 2e |
| Không được thêm dependency UI vào `package.json` | Suy ra từ ràng buộc trên |
| Dependency hiện có: `react-native 0.87.1`, `react 19.2.3`, `react-native-safe-area-context ^5.5.2` | `package.json:12-17` |
| Asset hiện có: chỉ `assets/images/giphy.gif` | `assets/images/index.ts` |

### Non-goals

- Màn hình đăng nhập / đăng ký (code đã có sẵn tại `component/auth/`, nằm ngoài đề bài 01).
- Điều hướng đa màn hình (navigation library).
- Gọi API, lưu trữ dữ liệu, xác thực.
- Dark Mode (đã loại khỏi phạm vi – xem mục 3).
- Kiểm thử tự động.

### Acceptance criteria

1. App chạy được, render đủ 5 khối a–e trên một màn hình dọc điện thoại.
2. Danh sách hiển thị **≥ 4 môn học**, mỗi môn đủ 5 thông tin: tên, icon/ảnh, số
   bài học, phần trăm hoàn thành, thanh tiến độ.
3. Thanh tiến độ khớp số phần trăm (ví dụ 75% → bề rộng phần fill bằng 75%).
4. Ô tìm kiếm nhập được (controlled state), có placeholder tiếng Việt, bo góc.
5. `package.json` **không phát sinh** dependency mới.
6. Nội dung dài vẫn cuộn được; thanh điều hướng dưới không bị đẩy khỏi màn hình.
7. Có `<Image>` thật xuất hiện trong giao diện (đề yêu cầu vận dụng `Image`).

---

## 2. Đối chiếu yêu cầu đề bài → thành phần

| Mục đề | Yêu cầu | Thành phần dự kiến |
|---|---|---|
| a | Lời chào + họ tên SV + ảnh đại diện + icon thông báo | `Header` |
| b | ≥ 3 thẻ thống kê (tổng môn học / số bài tập / số môn đã hoàn thành), mỗi thẻ có icon + số liệu + tiêu đề | `StatCard` × 3 |
| c | `TextInput` tìm kiếm, có placeholder, bo góc | `SearchBar` |
| d | ≥ 4 môn học, mỗi môn: tên, icon/ảnh, số bài học, % hoàn thành, thanh tiến độ | `CourseItem` + `ProgressBar` |
| e | 4 mục: Trang chủ / Môn học / Bài tập / Cá nhân | `BottomNav` |

---

## 3. Quyết định đã chốt

| # | Quyết định | Lý do |
|---|---|---|
| 1 | **Phạm vi: cơ bản + nâng cao, trừ Dark Mode** | Lấy điểm cộng mục 5 (tách component, `FlatList`, hiệu ứng nhấn, badge "Đã hoàn thành") mà không gánh chi phí một lớp theme xuyên mọi component và phải kiểm tra tương phản ở 2 chế độ |
| 2 | **Giữ nguyên code cũ, thêm màn hình mới** | `component/weather/`, `component/home/`, `component/auth/` là bài tập trước của sinh viên. Màn hình mới đặt tại thư mục riêng, không đè lên bài cũ |
| 3 | **Icon dùng emoji trong `<Text>`** | Không thêm dependency (đúng ràng buộc mục 3 của đề), render tốt trên Android. Đánh đổi: emoji hiển thị khác nhau giữa các hệ điều hành – chấp nhận được với bài tập |
| 4 | **Ảnh đại diện dùng file PNG local** | `<Image>` là thành phần bắt buộc phải vận dụng. Ảnh local không phụ thuộc mạng → quay video demo không rủi ro |
| 5 | **`FlatList` thay `ScrollView`** cho danh sách môn | Thuộc mục nâng cao của đề; phần Header + thống kê + tìm kiếm đặt trong `ListHeaderComponent` để toàn trang cuộn mượt, `BottomNav` nằm ngoài nên luôn cố định |
| 6 | **Ô tìm kiếm lọc thật theo tên môn** | Chi phí thấp, làm nổi bật việc dùng state so với một ô input không hoạt động |

---

## 4. Trade-offs

**Phạm vi bài làm** — so sánh 3 mức:

- *Chỉ cơ bản (a–e), một file, `ScrollView`*: rẻ nhất, nhưng bỏ toàn bộ điểm cộng mục 5.
- *Cơ bản + nâng cao, trừ Dark Mode* ← **đã chọn**. Giả định phụ thuộc nhiều nhất: giảng viên chấm mục 5 theo từng ý, không yêu cầu trọn gói. Hỏng trước tiên nếu barem yêu cầu **đủ cả 5 ý** mục 5 mới tính điểm.
- *Full nâng cao có Dark Mode*: điểm cộng tối đa, nhưng thêm một lớp theme xuyên mọi component và rủi ro tương phản màu sai ở chế độ tối – lỗi thị giác dễ bị trừ điểm mục 4 (màu sắc hài hòa).

**Xử lý code cũ** — so sánh 2 hướng:

- *Giữ nguyên, thêm màn mới* ← **đã chọn**. Không mất bài cũ. Hỏng trước tiên nếu yêu cầu nộp là "repo chỉ chứa đúng bài 01".
- *Ghi đè `component/home/HomeScreen.tsx`, xoá `component/weather/`*: repo sạch, nhưng mất code bài thời tiết và không thể khôi phục nếu chưa commit.

**Nguồn ảnh đại diện** — `{uri: 'https://...'}` tiện, không cần thêm file, nhưng
phụ thuộc mạng khi quay video demo. PNG local tốn một file nhưng chạy offline →
chọn PNG local.

**Better approaches:** không có — hướng đã chọn trùng với hướng đề bài gợi ý.
Bằng chứng: đề mục 3 liệt kê đúng các primitive của React Native, đề mục 5 liệt
kê đúng các cải tiến đã đưa vào phạm vi.

---

## 5. Hiện trạng repo (bằng chứng)

- `App.tsx:51-57` đang render `HomeScreen` từ `component/home/HomeScreen.tsx`;
  nhánh login/register bị comment (`App.tsx:23-49`).
- `component/home/HomeScreen.tsx:56-122` **không phải** app sinh viên — đây là
  giao diện **thời tiết** (`ImageBackground` nền gif, 8 thẻ `<Weather/>` cuộn
  ngang, 17 `<WeatherEnd/>` cuộn dọc). Bài 01 phải dựng mới hoàn toàn.
- Bố cục của màn thời tiết (header → dải cuộn ngang → danh sách dọc) ánh xạ khá
  sát sang (header → 3 thẻ thống kê → danh sách môn học), có thể tham khảo lại
  cách chia `StyleSheet`.
- `component/weather/index.tsx:23` dùng `fontWeight: 400` dạng số; chuẩn React
  Native là chuỗi `'400'` — cần dùng chuỗi ở code mới.
- Dependency hiện tại **đã đủ**, không cần cài thêm gì.

---

## 6. Sản phẩm phải nộp (đề mục 6)

1. Source code dự án React Native.
2. Ảnh chụp màn hình giao diện.
3. Video ngắn **tối đa 2 phút** quay quá trình chạy ứng dụng.

> Mục 2 và 3 phải do sinh viên tự thực hiện trên máy/emulator — không tạo được
> từ phía công cụ.

---

## 7. Câu hỏi còn mở

- Barem chấm mục 5 (Yêu cầu nâng cao) tính điểm theo từng ý hay trọn gói? Đây là
  giả định chịu lực của quyết định #1. Nếu là trọn gói thì phải bổ sung Dark Mode.
