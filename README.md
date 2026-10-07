# Ứng dụng dự báo thời tiết

Bài thực hành số 02 môn lập trình ứng dụng đa nền tảng. App React Native (chỉ chạy Android) lấy vị trí bằng GPS và hiển thị thời tiết lấy từ [Open-Meteo](https://open-meteo.com), không cần API key.

## Chức năng

- Thời tiết hiện tại: địa điểm, nhiệt độ, trạng thái, cao/thấp, cảm giác như.
- Dự báo 24 giờ (có đường nhiệt độ) và 7 ngày.
- Bấm vào một giờ hoặc một ngày để xem chi tiết.
- 8 chỉ số có hình minh hoạ: nhiệt độ, độ ẩm, tốc độ gió, hướng gió, UV, lượng mưa, áp suất, tầm nhìn.
- Xin quyền vị trí. Nếu từ chối thì có màn hướng dẫn, nút "Mở Cài đặt" khi bị chặn hẳn và nút "Dùng Hà Nội".
- Có màn Loading, Error (nút "Thử lại"), Empty.
- Chuyển màn bằng React Navigation, có hiệu ứng fade khi tải xong dữ liệu.
- Bố cục co giãn theo độ rộng màn hình.

## Yêu cầu môi trường

- Node.js 22.11 trở lên
- JDK 17
- Android SDK (đặt biến `ANDROID_HOME`) và emulator hoặc điện thoại Android

## Chạy thử

```bash
npm install
npm start
npm run android
```

Emulator chưa có GPS thì đặt vị trí trước (kinh độ rồi đến vĩ độ):

```bash
adb emu geo fix 105.85 21.03
```

## Build APK

```bash
cd android
gradlew.bat assembleRelease
```

File tạo ra nằm ở `android/app/build/outputs/apk/release/app-release.apk`, ký bằng debug keystore của template. Cài bằng `adb install -r <đường dẫn file>`.

## Nguồn dữ liệu

- `api.open-meteo.com`: thời tiết hiện tại, theo giờ, theo ngày.
- `api.bigdatacloud.net`: đổi toạ độ thành tên địa điểm. Nếu lỗi thì hiện toạ độ.

## Thư viện thêm vào

- `@react-navigation/native`, `@react-navigation/native-stack`: chuyển màn Home và Detail.
- `react-native-screens` (từ 4.27): native-stack cần, bản cũ hơn không chạy với RN 0.87.
- `@react-native-community/geolocation`: lấy toạ độ GPS.

## Cấu trúc thư mục `src/`

- `api/`: gọi Open-Meteo và BigDataCloud
- `hooks/`: `useLocation` (quyền và GPS), `useWeather` (tải dữ liệu)
- `context/`: chia sẻ dữ liệu giữa hai màn
- `screens/`: `HomeScreen`, `DetailScreen`
- `components/`: các thành phần giao diện
- `utils/`: mã thời tiết, định dạng, hướng gió, mức UV, ghép 8 chỉ số
- `theme/`: màu, cỡ chữ, khoảng cách
- `types/`: kiểu dữ liệu dùng chung

## Kiểm tra

```bash
npx tsc --noEmit
npx eslint App.tsx src __tests__
npm test
```

## Lỗi thường gặp

**Build báo `Filename longer than 260 characters` hoặc `mkdir(...R_/node_modules...)`.** Đường dẫn thư mục dự án quá dài so với giới hạn của Windows. Gán thư mục cha sang một ổ ngắn rồi build từ đó, và luôn dùng đúng đường dẫn này:

```bat
subst R: "C:\duong\dan\thu-muc-cha"
cd /d R:\ThucHanhSo02-DuBaoThoiTiet
npm run android
```

Nếu trước đó đã build từ đường dẫn khác thì xoá `android\app\.cxx` và `android\build\generated\autolinking` rồi build lại.

1. Tạo thư mục `android/app/src/main/assets`, rồi ở đường dẫn gốc thật chạy `npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res`.
2. Thêm tạm `debuggableVariants = ["debug", "release"]` vào khối `react { }` trong `android/app/build.gradle`.
3. Vào `R:\ThucHanhSo02-DuBaoThoiTiet\android` và chạy `gradlew.bat assembleRelease`.
4. Bỏ dòng vừa thêm ở `build.gradle`, xoá `android/app/src/main/assets`, `android/app/src/main/res/drawable-*` và `android/app/src/main/res/raw` mới sinh ra.

**`No such host is known` khi Gradle tải thư viện.** Mạng chập chờn, chạy lại lệnh build.

**Emulator không có vị trí.** Chạy `adb emu geo fix 105.85 21.03` hoặc bấm "Dùng Hà Nội".

**Cổng 8081 đang bị chiếm.** Chạy `npx react-native start --port 8082` rồi `adb reverse tcp:8081 tcp:8082`.
