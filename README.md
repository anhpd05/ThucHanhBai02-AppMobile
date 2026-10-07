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

## Hướng dẫn cài đặt

### 1. Chuẩn bị môi trường

| Công cụ | Phiên bản | Ghi chú |
|---|---|---|
| Node.js | 22.11 trở lên | kèm `npm` |
| JDK | 17 | đặt `JAVA_HOME` |
| Android Studio | bản mới | cài kèm Android SDK Platform 36/37, Build-Tools, Platform-Tools (`adb`), NDK và CMake (cài qua SDK Manager) |
| Android | 7.0 (API 24) trở lên | emulator hoặc điện thoại thật |

Đặt biến môi trường `ANDROID_HOME` trỏ tới thư mục Android SDK (Windows thường là `%LOCALAPPDATA%\Android\Sdk`), và thêm `%ANDROID_HOME%\platform-tools` vào `PATH`. Kiểm tra bằng `node -v`, `java -version`, `adb version`.

### 2. Lấy mã nguồn và cài thư viện

```bash
git clone https://github.com/anhpd05/ThucHanhBai02-AppMobile.git
cd ThucHanhBai02-AppMobile
npm install
```

Trên Windows, nên clone vào thư mục có đường dẫn ngắn (ví dụ `C:\dev`) để tránh lỗi đường dẫn dài khi build.

### 3. Chạy bằng emulator hoặc điện thoại

1. Bật emulator trong Android Studio (Device Manager), hoặc cắm điện thoại, bật "Tuỳ chọn nhà phát triển" và "Gỡ lỗi USB".
2. Kiểm tra thiết bị đã được nhận: `adb devices` phải hiện một dòng có trạng thái `device`.
3. Mở một terminal chạy Metro, giữ nguyên terminal này:

   ```bash
   npm start
   ```

4. Mở terminal thứ hai để build và cài app lên thiết bị:

   ```bash
   npm run android
   ```

Lần build đầu tải nhiều thư viện nên mất vài phút. `npm start` tự chọn cổng trống (mặc định 8081) và tự chạy `adb reverse` để thiết bị kết nối được với Metro.

Emulator chưa có GPS thì đặt vị trí trước (kinh độ rồi đến vĩ độ), hoặc bấm "Dùng Hà Nội" trong app:

```bash
adb emu geo fix 105.85 21.03
```

### 4. Cài từ file APK (không cần Metro)

Bản release có sẵn bundle JS nên chạy độc lập. Có file `app-release.apk` thì cài như sau:

```bash
adb install -r app-release.apk
```

Hoặc chép file vào điện thoại, mở lên và cho phép "Cài đặt từ nguồn không xác định". Muốn tự build file APK thì xem mục "Build APK" bên dưới.

### 5. Cấp quyền khi dùng

Lần đầu mở app sẽ hỏi quyền vị trí, chọn "Khi dùng ứng dụng" (hoặc "Chỉ lần này"). App cần internet để tải dữ liệu thời tiết.

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
