import type { CurrentWeather, DailyPoint, HourlyPoint, MetricItem } from '../types/weather';
import { formatTemp, formatVisibility } from './format';
import { windDirection } from './wind';
import { uvLevel } from './uv';

function number(value: number): string {
  return value.toFixed(1).replace('.', ',');
}
function buildMetrics(point: CurrentWeather, min: number, max: number, probability?: number): MetricItem[] {
  return [
    { key: 'temperature', title: 'Nhiệt độ', value: formatTemp(point.temperature), unit: '', caption: `Cảm giác ${formatTemp(point.apparentTemperature)}`, visual: { type: 'bar', min, max, value: point.temperature } },
    { key: 'humidity', title: 'Độ ẩm', value: String(Math.round(point.humidity)), unit: '%', caption: 'Độ ẩm tương đối', visual: { type: 'ring', percent: point.humidity } },
    { key: 'windSpeed', title: 'Gió', value: number(point.windSpeed), unit: 'km/h', caption: point.windSpeed < 12 ? 'Gió nhẹ' : point.windSpeed < 39 ? 'Gió vừa' : 'Gió mạnh', visual: { type: 'bar', min: 0, max: 60, value: point.windSpeed } },
    { key: 'windDirection', title: 'Hướng gió', value: windDirection(point.windDirection), unit: '', caption: `${Math.round(point.windDirection)}°`, visual: { type: 'compass', degrees: point.windDirection } },
    { key: 'uv', title: 'Chỉ số UV', value: number(point.uvIndex), unit: '', caption: uvLevel(point.uvIndex).label, visual: { type: 'uv', index: point.uvIndex } },
    { key: 'rain', title: 'Lượng mưa', value: number(point.precipitation), unit: 'mm', caption: probability === undefined ? 'Lượng mưa hiện tại' : `${Math.round(probability)}% khả năng mưa`, visual: { type: 'bar', min: 0, max: 20, value: point.precipitation } },
    { key: 'pressure', title: 'Áp suất', value: String(Math.round(point.pressure)), unit: 'hPa', caption: 'Quy về mực nước biển', visual: { type: 'bar', min: 950, max: 1050, value: point.pressure } },
    { key: 'visibility', title: 'Tầm nhìn', value: formatVisibility(point.visibility), unit: '', caption: point.visibility >= 10000 ? 'Tầm nhìn rõ' : point.visibility >= 4000 ? 'Tầm nhìn trung bình' : 'Tầm nhìn kém', visual: { type: 'bar', min: 0, max: 20000, value: point.visibility } },
  ];
}

export function buildCurrentMetrics(point: CurrentWeather, day: DailyPoint): MetricItem[] {
  return buildMetrics(point, day.temperatureMin, day.temperatureMax);
}
export function buildHourMetrics(point: HourlyPoint, day?: DailyPoint): MetricItem[] {
  return buildMetrics(point, day?.temperatureMin ?? point.temperature - 5, day?.temperatureMax ?? point.temperature + 5, point.precipitationProbability);
}
export function buildDayMetrics(day: DailyPoint, hours: HourlyPoint[]): MetricItem[] {
  if (!hours.length) return [];
  const mean = (readValue: (hour: HourlyPoint) => number) => hours.reduce((sum, hour) => sum + readValue(hour), 0) / hours.length;
  const point: CurrentWeather = {
    time: day.date,
    temperature: day.temperatureMax,
    apparentTemperature: mean(hour => hour.apparentTemperature),
    humidity: mean(hour => hour.humidity),
    weatherCode: day.weatherCode,
    windSpeed: day.windSpeedMax,
    windDirection: day.windDirection,
    pressure: mean(hour => hour.pressure),
    precipitation: day.precipitationSum,
    uvIndex: day.uvIndexMax,
    visibility: mean(hour => hour.visibility),
    isDay: true,
  };
  return buildMetrics(point, day.temperatureMin, day.temperatureMax, day.precipitationProbability).map(metric => {
    switch (metric.key) {
      case 'temperature': return { ...metric, caption: `Cao nhất · Thấp ${formatTemp(day.temperatureMin)}` };
      case 'humidity': return { ...metric, caption: 'Trung bình trong ngày' };
      case 'windSpeed': return { ...metric, caption: 'Cao nhất trong ngày' };
      case 'windDirection': return { ...metric, caption: `Hướng chủ đạo · ${Math.round(day.windDirection)}°` };
      case 'uv': return { ...metric, caption: `Cao nhất · ${uvLevel(day.uvIndexMax).label}` };
      case 'rain': return { ...metric, caption: `Tổng ngày · ${Math.round(day.precipitationProbability)}% mưa` };
      case 'pressure':
      case 'visibility': return { ...metric, caption: 'Trung bình trong ngày' };
    }
  });
}
