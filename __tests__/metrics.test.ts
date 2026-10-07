import { buildDayMetrics } from '../src/utils/metrics';
import type { DailyPoint, HourlyPoint } from '../src/types/weather';

const day: DailyPoint = {
  date: '2026-10-08', weatherCode: 61, temperatureMax: 32, temperatureMin: 24,
  precipitationProbability: 80, precipitationSum: 7.5, uvIndexMax: 8,
  windSpeedMax: 25, windDirection: 90,
  sunrise: '2026-10-08T05:49', sunset: '2026-10-08T17:38',
};
const morning: HourlyPoint = {
  time: '2026-10-08T06:00', temperature: 24, apparentTemperature: 25,
  humidity: 80, weatherCode: 61, windSpeed: 5, windDirection: 350,
  pressure: 1000, precipitation: 2, uvIndex: 1, visibility: 8000,
  isDay: true, precipitationProbability: 50,
};

test('chi tiết ngày lấy số cao nhất và tổng của ngày, không lấy trung bình theo giờ', () => {
  const evening = { ...morning, time: '2026-10-08T18:00', humidity: 40, pressure: 1020, visibility: 12000, windSpeed: 15, precipitation: 3 };
  const metrics = buildDayMetrics(day, [morning, evening]);
  const byKey = new Map(metrics.map(metric => [metric.key, metric]));
  expect(byKey.get('temperature')).toMatchObject({ value: '32°', caption: 'Cao nhất · Thấp 24°' });
  expect(byKey.get('humidity')).toMatchObject({ value: '60', caption: 'Trung bình trong ngày', visual: { type: 'ring', percent: 60 } });
  expect(byKey.get('rain')).toMatchObject({ value: '7,5', caption: 'Tổng ngày · 80% mưa' });
  expect(byKey.get('windSpeed')).toMatchObject({ value: '25,0', caption: 'Cao nhất trong ngày' });
  expect(byKey.get('windDirection')).toMatchObject({ visual: { type: 'compass', degrees: 90 } });
  expect(byKey.get('pressure')).toMatchObject({ value: '1010', caption: 'Trung bình trong ngày' });
  expect(byKey.get('visibility')).toMatchObject({ visual: { value: 10000 }, caption: 'Trung bình trong ngày' });
  expect(byKey.get('uv')).toMatchObject({ value: '8,0', caption: 'Cao nhất · Rất cao' });
});
