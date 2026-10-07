# DESIGN SYSTEM – BT TH01 (Màn hình Trang chủ quản lý sinh viên)

**Mục đích:** file nguồn duy nhất để sinh UI. Mọi giá trị trong file này là giá
trị cuối cùng — code chỉ đọc token, **không** hardcode màu/khoảng cách/cỡ chữ.

**Nguồn:** `docs/req-bt-th1.md` (đề bài), `docs/report-bt-th1.md` (quyết định đã
chốt), `plans/260923-0745-bt-th1-man-hinh-trang-chu/` (kế hoạch 5 phase).

**Ràng buộc kỹ thuật bắt buộc (đề mục 3):**

- Chỉ dùng `View`, `Text`, `Image`, `TextInput`, `FlatList`, `Pressable`, `StyleSheet`, Flexbox.
- `SafeAreaView` lấy từ `react-native-safe-area-context` — **đã có sẵn** trong
  `package.json`, không phải dependency mới.
- **Cấm emoji.** Mọi icon là SVG vector tự vẽ (mục 2 bên dưới).
- Dependency được phép thêm: **duy nhất `react-native-svg@15.15.5`**. Đây là
  primitive vẽ vector, không phải thư viện UI và cũng không phải bộ icon có sẵn —
  toàn bộ `d` path do dự án tự viết. Cấm `react-native-vector-icons`, UI kit,
  styling lib, icon pack.
- Mọi `fontWeight` viết dạng **chuỗi** (`'700'`), không phải số.
- Không Dark Mode (đã loại khỏi phạm vi).

---

## 1. Design tokens → `component/student/theme.ts`

### 1.1 `colors`

| Token | Hex | Dùng ở đâu |
|---|---|---|
| `background` | `#F4F6FB` | nền toàn màn hình |
| `card` | `#FFFFFF` | nền `StatCard`, `CourseItem`, `SearchBar`, `BottomNav` |
| `primary` | `#4C6FFF` | tab active, số liệu thẻ 1, fill tiến độ mặc định |
| `primarySoft` | `#E7EDFF` | nền tròn icon, nền pill tab active, ripple |
| `success` | `#16A34A` | badge "Đã hoàn thành", số liệu thẻ 3 |
| `successSoft` | `#DCFCE7` | nền badge, nền icon thẻ 3 |
| `warning` | `#F59E0B` | số liệu thẻ 2 (bài tập), badge chuông |
| `warningSoft` | `#FEF3C7` | nền icon thẻ 2 |
| `text` | `#10172A` | tiêu đề, họ tên, tên môn, số liệu |
| `textMuted` | `#6B7280` | lời chào, MSSV, tiêu đề thẻ, placeholder, tab không active |
| `border` | `#E5E7EB` | viền `SearchBar`, đường kẻ trên `BottomNav` |
| `track` | `#EEF1F6` | nền thanh tiến độ |
| `overlay` | `rgba(16, 23, 42, 0.45)` | lớp phủ mờ sau modal thông báo "đang phát triển" |

Không dùng màu nào ngoài 13 token trên (đề mục 4: "không quá nhiều màu sắc").

### 1.2 `spacing` (số, đơn vị dp)

`xs: 4` · `sm: 8` · `md: 12` · `lg: 16` · `xl: 24`

### 1.3 `radius`

`sm: 10` (ô icon) · `md: 16` (thẻ thống kê) · `lg: 20` (thẻ môn học) · `pill: 999` (avatar, search, badge, progress)

### 1.4 `typography`

| Token | fontSize | fontWeight | color mặc định | Dùng cho |
|---|---|---|---|---|
| `title` | 20 | `'700'` | `text` | họ tên sinh viên |
| `sectionTitle` | 17 | `'700'` | `text` | "Môn học của tôi" |
| `courseName` | 15 | `'700'` | `text` | tên môn học trong `CourseItem` |
| `body` | 14 | `'600'` | `text` | số liệu phụ, nhãn |
| `caption` | 12 | `'500'` | `textMuted` | lời chào, MSSV, tiêu đề thẻ, % hoàn thành |

Số liệu lớn trong `StatCard` dùng riêng: `fontSize: 18`, `fontWeight: '700'`,
màu `tint` của thẻ.

> **Thang phân cấp (đề mục 4 chấm trực tiếp):** 20 → 18 → 17 → 15 → 14 → 12.
> Không có hai vai trò khác cấp nào dùng chung một cỡ chữ. Họ tên sinh viên (20)
> luôn là chữ lớn nhất màn hình; số liệu thống kê (18) đứng sau nó, không ngang hàng.

### 1.5 `shadowCard`

```
shadowColor: '#0F172A', shadowOpacity: 0.06, shadowRadius: 12,
shadowOffset: { width: 0, height: 4 }, elevation: 3
```

> **Lưu ý Android:** bốn thuộc tính `shadow*` chỉ có tác dụng trên iOS. Trên
> Android chỉ `elevation` được áp dụng, nên bóng thật sẽ nhạt hơn spec. Không
> tăng `elevation` quá 3 — bóng đậm làm màn hình rối, trái đề mục 4.

---

## 2. Bộ icon → `component/student/Icon.tsx`

**Dependency:** `react-native-svg@15.15.5`. Sau khi cài phải build lại native
(`npm run android`) vì đây là native module.

**API:**

```ts
type IconName =
  | 'bell' | 'search' | 'book' | 'clipboard' | 'check'
  | 'phone' | 'database' | 'globe' | 'code' | 'shield'
  | 'home' | 'user';

type IconProps = { name: IconName; size?: number; color?: string };
```

**Quy ước vẽ:** `viewBox="0 0 24 24"`, `fill="none"`, `stroke={color}`,
`strokeWidth={1.9}`, `strokeLinecap="round"`, `strokeLinejoin="round"`.
`size` mặc định `20`, `color` mặc định `colors.text`.

**Dữ liệu path** (đã render kiểm tra bằng mắt; bản xem trước tại
`plans/260923-0745-bt-th1-man-hinh-trang-chu/assets/icons-preview.svg`):

| name | path `d` |
|---|---|
| `bell` | `M18 8.5a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9` · `M13.8 21.2a2 2 0 0 1-3.6 0` |
| `search` | `M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z` · `M21 21l-4.4-4.4` |
| `book` | `M4 19.5A2.5 2.5 0 0 1 6.5 17H20` · `M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z` |
| `clipboard` | `M9 4H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2` · `M10 2h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z` · `M9 12h6` · `M9 16h4` |
| `check` | `M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z` · `M8.2 12.3l2.6 2.6 5-5.2` |
| `phone` | `M7 2h10a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z` · `M10.5 18.6h3` |
| `database` | `M12 7.2c4.4 0 8-1.2 8-2.6S16.4 2 12 2 4 3.2 4 4.6 7.6 7.2 12 7.2z` · `M20 4.6v14.8c0 1.4-3.6 2.6-8 2.6s-8-1.2-8-2.6V4.6` · `M20 12c0 1.4-3.6 2.6-8 2.6S4 13.4 4 12` |
| `globe` | `M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z` · `M3.4 9.2h17.2` · `M3.4 14.8h17.2` · `M12 3c2.3 2.5 3.4 5.5 3.4 9s-1.1 6.5-3.4 9c-2.3-2.5-3.4-5.5-3.4-9S9.7 5.5 12 3z` |
| `code` | `M9 17.5L3.5 12 9 6.5` · `M15 6.5L20.5 12 15 17.5` |
| `shield` | `M12 2.4l8 3v6.2c0 4.9-3.4 8.5-8 10-4.6-1.5-8-5.1-8-10V5.4l8-3z` · `M8.8 12.2l2.3 2.3 4.1-4.3` |
| `home` | `M3 11.3L12 3.6l9 7.7` · `M5.9 9.9V20.4h12.2V9.9` · `M9.9 20.4v-4.8h4.2v4.8` |
| `user` | `M12 12.2a4.3 4.3 0 1 1 0-8.6 4.3 4.3 0 0 1 0 8.6z` · `M4.4 21c0-3.7 3.4-6.2 7.6-6.2s7.6 2.5 7.6 6.2` |

Cấu trúc file: một object `PATHS: Record<IconName, string[]>`, component đọc
`PATHS[name]` rồi `.map()` ra `<Path>`. Thêm icon mới = thêm một khoá, không sửa
component.

---

## 3. Data contract → `component/student/data.ts`

```ts
import type { IconName } from './Icon';

type Student = { name: string; studentId: string; unreadNotifications: number }
type Stat    = { id: string; icon: IconName; value: string; title: string; tint: string; tintSoft: string }
type Course  = { id: string; name: string; icon: IconName; instructor: string; credits: number; lessons: number; completedLessons: number; progress: number; tint: string; tintSoft: string }
```

`progress` là số **0–100**.

**`student`**

| name | studentId | unreadNotifications |
|---|---|---|
| Phạm Đức Anh | `B23DCCC014` | 3 |

**`stats`** (đúng 3 phần tử, khớp đề mục 2b)

| id | icon | value | title | tint / tintSoft |
|---|---|---|---|---|
| `courses` | `book` | `5` | Môn học | `primary` / `primarySoft` |
| `assignments` | `clipboard` | `12` | Bài tập | `warning` / `warningSoft` |
| `done` | `check` | `1` | Đã hoàn thành | `success` / `successSoft` |

> **Bất biến:** `stats.courses.value` phải bằng `courses.length`, và
> `stats.done.value` phải bằng số phần tử có `progress === 100`. Người chấm nhìn
> hai thứ này cạnh nhau trên cùng một màn hình; lệch là lỗi thấy ngay.

**`courses`** (5 phần tử ≥ yêu cầu 4; đúng 1 môn 100% để hiện badge)

| id | icon | name | instructor | credits | completedLessons/lessons | progress | tint / tintSoft |
|---|---|---|---|---|---|---|---|
| `c1` | `phone` | Phát triển ứng dụng di động | ThS. Vũ Văn Thương | 3 | 18/24 | 75 | `primary` / `primarySoft` |
| `c2` | `database` | Cơ sở dữ liệu | TS. Phan Lý Huỳnh | 3 | 18/18 | 100 | `success` / `successSoft` |
| `c3` | `globe` | Lập trình Web | ThS. Trần Quang Đại | 3 | 9/20 | 45 | `warning` / `warningSoft` |
| `c4` | `code` | Cấu trúc dữ liệu & Giải thuật | TS. Phan Lý Huỳnh | 4 | 18/30 | 60 | `primary` / `primarySoft` |
| `c5` | `shield` | An toàn thông tin | ThS. Đỗ Quang Huy | 2 | 0/16 | 0 | `warning` / `warningSoft` |

Asset: `assets/images/avatar.png` (~160×160), export thêm khoá `avatar` trong `assets/images/index.ts`.

---

## 4. Bố cục màn hình

```
SafeAreaView (edges: top+bottom, nền background)
├── FlatList  (flex: 1, contentContainerStyle paddingHorizontal: lg, paddingBottom: xl)
│   ├── ListHeaderComponent  ← JSX element, KHÔNG phải arrow function
│   │   ├── Header                     (a)
│   │   ├── Row: StatCard × 3          (b)
│   │   ├── SearchBar                  (c)
│   │   └── SectionTitle "Môn học của tôi" + "N môn"
│   ├── renderItem → CourseItem        (d)
│   └── ListEmptyComponent "Không tìm thấy môn học phù hợp."
└── BottomNav  (anh em cùng cấp, luôn cố định đáy)   (e)
```

Thứ tự dọc cố định: a → b → c → danh sách d → e. `FlatList` dùng
`keyExtractor={item => item.id}`, `showsVerticalScrollIndicator={false}`,
`keyboardShouldPersistTaps="handled"`.

---

## 5. Đặc tả component

### 5.1 `Header.tsx` — đề mục a

**Props:** `{ name: string; studentId: string; unreadNotifications: number }`

| Phần tử | Spec |
|---|---|
| Container | `flexDirection: 'row'`, `alignItems: 'center'`, `paddingVertical: spacing.lg`, `gap: spacing.md` |
| Avatar | `<Image source={images.avatar}>` 52×52, `borderRadius: radius.pill` |
| Cột giữa | `flex: 1` — "Xin chào" (`caption`) / `name` (`title`, `numberOfLines={1}`) / `studentId` (`caption`) |
| Nút chuông | `Pressable` 44×44, nền `card`, `borderRadius: radius.pill`, `shadowCard`, chứa `<Icon name="bell" size={20} color={colors.text} />` |
| Badge | `position: 'absolute'`, `top: 4`, `right: 4`, `minWidth: 18`, `height: 18`, `borderRadius: radius.pill`, nền `colors.warning`, chữ `#FFFFFF` fontSize 10 `'700'`; chỉ render khi `unreadNotifications > 0`; hiển thị `9+` khi `> 9` |

### 5.2 `StatCard.tsx` — đề mục b

**Props:** `{ icon: IconName; value: string; title: string; tint: string; tintSoft: string }`

- `flex: 1` để 3 thẻ chia đều; hàng chứa dùng `gap: spacing.md`.
- Nền `card`, `borderRadius: radius.md`, `padding: spacing.md`, `shadowCard`.
- Trên: vòng tròn 36×36 `borderRadius: radius.pill` nền `tintSoft`, giữa là
  `<Icon name={icon} size={18} color={tint} />`.
- Giữa: `value` fontSize 18 `'700'` màu `tint`, `marginTop: spacing.sm`.
- Dưới: `title` theo `caption`, `numberOfLines={1}`.

### 5.3 `SearchBar.tsx` — đề mục c

**Props:** `{ value: string; onChangeText: (t: string) => void }`

- Hàng ngang: `<Icon name="search" size={18} color={colors.textMuted} />` + `TextInput` `flex: 1`.
- Nền `card`, `borderRadius: radius.pill`, `borderWidth: 1` màu `border`,
  `paddingHorizontal: spacing.lg`, `height: 46`, `gap: spacing.sm`.
- `placeholder="Tìm kiếm môn học..."`, `placeholderTextColor={colors.textMuted}`,
  `returnKeyType="search"`, controlled (state nằm ở màn hình cha).

### 5.4 `SectionTitle` — nằm trong `StudentHomeScreen`, không tách file

- Hàng ngang `justifyContent: 'space-between'`, `alignItems: 'baseline'`,
  `marginTop: spacing.xl`, `marginBottom: spacing.md`.
- Trái: "Môn học của tôi" theo `sectionTitle`.
- Phải: "`{n}` môn" theo `caption`, trong đó `n` là số phần tử **sau khi lọc**.

### 5.5 `ProgressBar.tsx` — đề mục d

**Props:** `{ progress: number; color: string }`

- Clamp: `Math.max(0, Math.min(100, progress))`.
- Track: `height: 8`, `borderRadius: radius.pill`, nền `track`, **`overflow: 'hidden'`**.
- Fill: `width: `${clamped}%``, `height: '100%'`, nền `color`.

### 5.6 `CourseItem.tsx` — đề mục d

**Props:** `{ course: Course; onPress?: (c: Course) => void }`

- Gốc `Pressable`, nền `card`, `borderRadius: radius.lg`, `padding: spacing.lg`,
  `marginBottom: spacing.md`, `shadowCard`.
- `style={({pressed}) => [styles.card, pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] }]}`
  \+ `android_ripple={{ color: course.tintSoft }}`.
- **Hàng 1:** ô icon 46×46 nền `tintSoft` bo `radius.sm` chứa
  `<Icon name={course.icon} size={22} color={course.tint} />` + cột `flex: 1`
  (tên `courseName` `numberOfLines={2}`; dòng "`{completedLessons}`/`{lessons}` bài học ·
  `{credits}` tín chỉ" `caption`; dòng "GV: `{instructor}`" `caption` `numberOfLines={1}`).
- **Hàng 2:** `ProgressBar` (`color = course.tint`), `marginTop: spacing.md`.
- **Hàng 3:** `flexDirection: 'row'`, `justifyContent: 'space-between'`,
  `alignItems: 'center'`, `marginTop: spacing.sm` — trái là badge
  "Đã hoàn thành" (chỉ khi `progress >= 100`), phải là "`{progress}`% hoàn thành"
  theo `caption` màu `course.tint`.
- Badge: nền `successSoft`, chữ `success` fontSize 11 `'700'`,
  `paddingHorizontal: spacing.sm`, `paddingVertical: spacing.xs`, `borderRadius: radius.pill`.

> Badge nằm ở **hàng 3**, không nằm cùng hàng với tên môn. Lý do: ở bề rộng
> 360dp, tên dài như "Cấu trúc dữ liệu & Giải thuật" cộng badge làm tên bị ép
> xuống còn vài ký tự mỗi dòng.

### 5.7 `BottomNav.tsx` — đề mục e

**Props:** `{ active: NavKey; onChange: (k: NavKey) => void }`
**Type:** `type NavKey = 'home' | 'courses' | 'assignments' | 'profile'`

| key | icon | label |
|---|---|---|
| `home` | `home` | Trang chủ |
| `courses` | `book` | Môn học |
| `assignments` | `clipboard` | Bài tập |
| `profile` | `user` | Cá nhân |

- Container: `flexDirection: 'row'`, nền `card`, `borderTopWidth: 1` màu `border`,
  `paddingVertical: spacing.sm`.
- Mỗi mục: `Pressable` `flex: 1`, `alignItems: 'center'`, `gap: spacing.xs`.
- Active: icon `color={colors.primary}` bọc trong pill nền `primarySoft`
  (`paddingHorizontal: spacing.md`, `paddingVertical: spacing.xs`,
  `borderRadius: radius.pill`), nhãn màu `primary` `fontWeight: '700'`.
  Không active: icon `color={colors.textMuted}`, nhãn `caption`.
- Chỉ đổi state `active`, **không** chuyển màn hình (đề mục 2e).

### 5.8 `StudentHomeScreen.tsx` — lắp ráp

- State: `keyword: string`, `tab: NavKey = 'home'`.
- Lọc `useMemo`: `needle = keyword.trim().toLowerCase()`; rỗng → nguyên mảng;
  ngược lại `course.name.toLowerCase().includes(needle)`.
- `ListEmptyComponent`: một `<Text>` theo `caption`, `textAlign: 'center'`,
  `paddingVertical: spacing.xl`, nội dung "Không tìm thấy môn học phù hợp.".
- **Bẫy:** `ListHeaderComponent` phải nhận **element**, không nhận arrow function
  inline → nếu không, `TextInput` mất focus sau mỗi ký tự.

---

## 6. Bảng trạng thái

| Component | Trạng thái | Biểu hiện |
|---|---|---|
| Nút chuông | `unread = 0` | không có badge |
| Nút chuông | `unread > 9` | badge hiển thị `9+` |
| `CourseItem` | pressed | `opacity 0.85` + `scale 0.99` + ripple Android |
| `CourseItem` | `progress >= 100` | badge "Đã hoàn thành" ở hàng 3, fill full track |
| `CourseItem` | `progress = 0` | track rỗng, hàng 3 chỉ có "0% hoàn thành", không badge |
| `SearchBar` | rỗng | hiện placeholder, danh sách đủ 5 môn |
| Danh sách | lọc không khớp | `ListEmptyComponent` "Không tìm thấy môn học phù hợp." |
| `BottomNav` | mục active | pill `primarySoft` + icon `primary` + nhãn `primary` đậm |

---

## 7. Checklist sinh UI

- [ ] `npm i react-native-svg@15.15.5` rồi **build lại native** (`npm run android`)
- [ ] `theme.ts` export đúng 5 nhóm: `colors`, `spacing`, `radius`, `typography`, `shadowCard`
- [ ] `Icon.tsx` export `IconName` + 12 khoá path, `viewBox="0 0 24 24"`, `strokeWidth 1.9`
- [ ] `data.ts` export `student`, `stats` (3), `courses` (5, đúng 1 môn 100%)
- [ ] `stats.courses.value === courses.length` và `stats.done.value ===` số môn 100%
- [ ] 8 component: `Icon`, `Header`, `StatCard`, `SearchBar`, `ProgressBar`, `CourseItem`, `BottomNav`, `StudentHomeScreen`
- [ ] **Không file nào chứa emoji**
- [ ] Không file nào chứa hex màu ngoài `theme.ts`
- [ ] Mọi `fontWeight` là chuỗi
- [ ] `git diff package.json` chỉ thêm đúng một dòng `react-native-svg`
- [ ] `npx tsc --noEmit` sạch; `npx eslint component/student` sạch
