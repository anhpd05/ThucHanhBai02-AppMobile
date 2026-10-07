import { fetchForecast } from '../src/api/openMeteo';

function forecastResponse() {
  const times = Array.from({ length: 48 }, (_, index) => `2026-10-${index < 24 ? '07' : '08'}T${String(index % 24).padStart(2, '0')}:00`);
  const values = (value: number) => times.map(() => value);
  return {
    timezone: 'Asia/Bangkok',
    current: { time: '2026-10-07T14:30', temperature_2m: 29, apparent_temperature: 31, relative_humidity_2m: 60, weather_code: 2, wind_speed_10m: 12, wind_direction_10m: 180, pressure_msl: 1010, precipitation: 0, uv_index: 4, visibility: 20000, is_day: 1 },
    hourly: { time: times, temperature_2m: times.map((_, index) => 20 + index / 10), apparent_temperature: values(30), relative_humidity_2m: values(65), weather_code: values(2), wind_speed_10m: values(10), wind_direction_10m: values(180), pressure_msl: values(1010), precipitation: values(0.5), precipitation_probability: values(40), uv_index: values(3), visibility: values(18000), is_day: values(1) },
    daily: { time: ['2026-10-07', '2026-10-08'], weather_code: [2, 61], temperature_2m_max: [32, 31], temperature_2m_min: [24, 23], precipitation_probability_max: [40, 80], precipitation_sum: [2, 8], uv_index_max: [6, 5], wind_speed_10m_max: [15, 20], wind_direction_10m_dominant: [180, 90], sunrise: ['2026-10-07T05:49', '2026-10-08T05:49'], sunset: ['2026-10-07T17:38', '2026-10-08T17:38'] },
  };
}
function mockResponse(body: unknown) {
  return jest.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true, status: 200, json: async () => body } as Response);
}
afterEach(() => jest.restoreAllMocks());

test('24 giờ tới bắt đầu từ giờ hiện tại theo múi giờ của dự báo, không theo đồng hồ máy', async () => {
  mockResponse(forecastResponse());
  const forecast = await fetchForecast(21.03, 105.85);
  expect(forecast.next24[0]).toBe(forecast.hourly[14]);
  expect(forecast.next24[0]).toMatchObject({ time: '2026-10-07T14:00', temperature: 21.4, visibility: 18000, precipitationProbability: 40 });
  expect(forecast.next24[23].time).toBe('2026-10-08T13:00');
  expect(forecast.daily[1]).toMatchObject({ temperatureMax: 31, precipitationSum: 8, windDirection: 90 });
});

test('thiếu chỉ số bắt buộc thì báo lỗi dữ liệu, không tự điền số 0', async () => {
  const response = forecastResponse();
  mockResponse({ ...response, current: { ...response.current, uv_index: null } });
  await expect(fetchForecast(21.03, 105.85)).rejects.toMatchObject({ kind: 'http', message: expect.stringContaining('uv_index') });
});

test('các mảng dữ liệu lệch độ dài bị từ chối, không ghép sai giờ', async () => {
  const response = forecastResponse();
  response.hourly.visibility.pop();
  mockResponse(response);
  await expect(fetchForecast(21.03, 105.85)).rejects.toThrow();
});
