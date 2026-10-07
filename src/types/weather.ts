export type IconKind = 'clear' | 'partly' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'storm';
export type SkyTheme = 'clearDay' | 'clearNight' | 'cloudy' | 'rain' | 'storm' | 'mist';
export type Coordinates = { latitude: number; longitude: number; source: 'gps' | 'default' };
export type Place = { name: string; region: string };
export type CurrentWeather = {
  time: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  precipitation: number;
  uvIndex: number;
  visibility: number;
  isDay: boolean;
};
export type HourlyPoint = CurrentWeather & { precipitationProbability: number };
export type DailyPoint = {
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbability: number;
  precipitationSum: number;
  uvIndexMax: number;
  windSpeedMax: number;
  windDirection: number;
  sunrise: string;
  sunset: string;
};
export type Forecast = {
  current: CurrentWeather;
  hourly: HourlyPoint[];
  next24: HourlyPoint[];
  daily: DailyPoint[];
  timezone: string;
};
export type MetricVisual =
  | { type: 'ring'; percent: number }
  | { type: 'bar'; min: number; max: number; value: number }
  | { type: 'compass'; degrees: number }
  | { type: 'uv'; index: number };
export type MetricItem = {
  key: 'temperature' | 'humidity' | 'windSpeed' | 'windDirection' | 'uv' | 'rain' | 'pressure' | 'visibility';
  title: string;
  value: string;
  unit: string;
  caption: string;
  visual: MetricVisual;
};
