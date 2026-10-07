import { OPEN_METEO_URL, REQUEST_TIMEOUT_MS } from '../constants';
import type { CurrentWeather, DailyPoint, Forecast, HourlyPoint } from '../types/weather';
import { AppError, getJson } from './http';

const currentFields = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'weather_code',
  'wind_speed_10m',
  'wind_direction_10m',
  'pressure_msl',
  'precipitation',
  'uv_index',
  'visibility',
  'is_day',
];
const hourlyFields = [...currentFields, 'precipitation_probability'];
const dailyFields = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_probability_max',
  'precipitation_sum',
  'uv_index_max',
  'wind_speed_10m_max',
  'wind_direction_10m_dominant',
  'sunrise',
  'sunset',
];

function invalid(field: string): never {
  throw new AppError(
    'http',
    `Dữ liệu thời tiết bị thiếu hoặc không hợp lệ (${field}). Vui lòng thử lại.`,
  );
}


function numeric(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return invalid(field);
  }
  return value;
}

function dayFlag(value: unknown, field: string): boolean {
  if (value !== 0 && value !== 1) {
    return invalid(field);
  }
  return value === 1;
}

function localDate(value: unknown, field: string, withTime: boolean): string {
  const pattern = withTime
    ? /^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d$/
    : /^\d{4}-\d{2}-\d{2}$/;
  if (typeof value !== 'string' || !pattern.test(value)) {
    return invalid(field);
  }
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return invalid(field);
  }
  return value;
}

function isNumericArray(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.every((item: unknown) => typeof item === 'number' && Number.isFinite(item))
  );
}

function numericArray(value: unknown, length: number, field: string): number[] {
  // Dự báo rỗng có thể không có các cột dữ liệu, nhưng không được tự bịa số liệu.
  if (length === 0 && value === undefined) {
    return [];
  }
  if (!isNumericArray(value) || value.length !== length) {
    return invalid(field);
  }
  return value;
}

function dateArray(value: unknown, field: string, withTime: boolean): string[] {
  if (!Array.isArray(value)) {
    return invalid(field);
  }
  return value.map((item: unknown, index: number) =>
    localDate(item, `${field}[${index}]`, withTime),
  );
}

function parseCurrent(value: unknown): CurrentWeather {
  const current = value;
  if (
    typeof current !== 'object' || current === null || Array.isArray(current) ||
    !('time' in current) || !('temperature_2m' in current) ||
    !('apparent_temperature' in current) || !('relative_humidity_2m' in current) ||
    !('weather_code' in current) || !('wind_speed_10m' in current) ||
    !('wind_direction_10m' in current) || !('pressure_msl' in current) ||
    !('precipitation' in current) || !('uv_index' in current) ||
    !('visibility' in current) || !('is_day' in current)
  ) {
    return invalid('current');
  }
  return {
    time: localDate(current.time, 'current.time', true),
    temperature: numeric(current.temperature_2m, 'current.temperature_2m'),
    apparentTemperature: numeric(current.apparent_temperature, 'current.apparent_temperature'),
    humidity: numeric(current.relative_humidity_2m, 'current.relative_humidity_2m'),
    weatherCode: numeric(current.weather_code, 'current.weather_code'),
    windSpeed: numeric(current.wind_speed_10m, 'current.wind_speed_10m'),
    windDirection: numeric(current.wind_direction_10m, 'current.wind_direction_10m'),
    pressure: numeric(current.pressure_msl, 'current.pressure_msl'),
    precipitation: numeric(current.precipitation, 'current.precipitation'),
    uvIndex: numeric(current.uv_index, 'current.uv_index'),
    visibility: numeric(current.visibility, 'current.visibility'),
    isDay: dayFlag(current.is_day, 'current.is_day'),
  };
}

function parseHourly(value: unknown): HourlyPoint[] {
  const hourly = value;
  if (
    typeof hourly !== 'object' || hourly === null || Array.isArray(hourly) ||
    !('time' in hourly)
  ) {
    return invalid('hourly');
  }
  const times = dateArray(hourly.time, 'hourly.time', true);
  const temperature = numericArray(
    'temperature_2m' in hourly ? hourly.temperature_2m : undefined,
    times.length, 'hourly.temperature_2m',
  );
  const apparentTemperature = numericArray(
    'apparent_temperature' in hourly ? hourly.apparent_temperature : undefined,
    times.length, 'hourly.apparent_temperature',
  );
  const humidity = numericArray(
    'relative_humidity_2m' in hourly ? hourly.relative_humidity_2m : undefined,
    times.length, 'hourly.relative_humidity_2m',
  );
  const weatherCode = numericArray(
    'weather_code' in hourly ? hourly.weather_code : undefined,
    times.length, 'hourly.weather_code',
  );
  const windSpeed = numericArray(
    'wind_speed_10m' in hourly ? hourly.wind_speed_10m : undefined,
    times.length, 'hourly.wind_speed_10m',
  );
  const windDirection = numericArray(
    'wind_direction_10m' in hourly ? hourly.wind_direction_10m : undefined,
    times.length, 'hourly.wind_direction_10m',
  );
  const pressure = numericArray(
    'pressure_msl' in hourly ? hourly.pressure_msl : undefined,
    times.length, 'hourly.pressure_msl',
  );
  const precipitation = numericArray(
    'precipitation' in hourly ? hourly.precipitation : undefined,
    times.length, 'hourly.precipitation',
  );
  const uvIndex = numericArray(
    'uv_index' in hourly ? hourly.uv_index : undefined,
    times.length, 'hourly.uv_index',
  );
  const visibility = numericArray(
    'visibility' in hourly ? hourly.visibility : undefined,
    times.length, 'hourly.visibility',
  );
  const isDay = numericArray(
    'is_day' in hourly ? hourly.is_day : undefined,
    times.length, 'hourly.is_day',
  );
  const precipitationProbability = numericArray(
    'precipitation_probability' in hourly ? hourly.precipitation_probability : undefined,
    times.length, 'hourly.precipitation_probability',
  );

  return times.map((time, index) => ({
    time,
    temperature: temperature[index],
    apparentTemperature: apparentTemperature[index],
    humidity: humidity[index],
    weatherCode: weatherCode[index],
    windSpeed: windSpeed[index],
    windDirection: windDirection[index],
    pressure: pressure[index],
    precipitation: precipitation[index],
    uvIndex: uvIndex[index],
    visibility: visibility[index],
    isDay: dayFlag(isDay[index], `hourly.is_day[${index}]`),
    precipitationProbability: precipitationProbability[index],
  }));
}

function parseDaily(value: unknown): DailyPoint[] {
  const daily = value;
  if (
    typeof daily !== 'object' || daily === null || Array.isArray(daily) ||
    !('time' in daily)
  ) {
    return invalid('daily');
  }
  const dates = dateArray(daily.time, 'daily.time', false);
  const weatherCode = numericArray(
    'weather_code' in daily ? daily.weather_code : undefined,
    dates.length, 'daily.weather_code',
  );
  const temperatureMax = numericArray(
    'temperature_2m_max' in daily ? daily.temperature_2m_max : undefined,
    dates.length, 'daily.temperature_2m_max',
  );
  const temperatureMin = numericArray(
    'temperature_2m_min' in daily ? daily.temperature_2m_min : undefined,
    dates.length, 'daily.temperature_2m_min',
  );
  const precipitationProbability = numericArray(
    'precipitation_probability_max' in daily ? daily.precipitation_probability_max : undefined,
    dates.length, 'daily.precipitation_probability_max',
  );
  const precipitationSum = numericArray(
    'precipitation_sum' in daily ? daily.precipitation_sum : undefined,
    dates.length, 'daily.precipitation_sum',
  );
  const uvIndexMax = numericArray(
    'uv_index_max' in daily ? daily.uv_index_max : undefined,
    dates.length, 'daily.uv_index_max',
  );
  const windSpeedMax = numericArray(
    'wind_speed_10m_max' in daily ? daily.wind_speed_10m_max : undefined,
    dates.length, 'daily.wind_speed_10m_max',
  );
  const windDirection = numericArray(
    'wind_direction_10m_dominant' in daily ? daily.wind_direction_10m_dominant : undefined,
    dates.length, 'daily.wind_direction_10m_dominant',
  );
  const sunrise = dates.length === 0 && !('sunrise' in daily)
    ? []
    : dateArray('sunrise' in daily ? daily.sunrise : undefined, 'daily.sunrise', true);
  const sunset = dates.length === 0 && !('sunset' in daily)
    ? []
    : dateArray('sunset' in daily ? daily.sunset : undefined, 'daily.sunset', true);
  if (sunrise.length !== dates.length || sunset.length !== dates.length) {
    return invalid('daily.sunrise/sunset');
  }

  return dates.map((date, index) => ({
    date,
    weatherCode: weatherCode[index],
    temperatureMax: temperatureMax[index],
    temperatureMin: temperatureMin[index],
    precipitationProbability: precipitationProbability[index],
    precipitationSum: precipitationSum[index],
    uvIndexMax: uvIndexMax[index],
    windSpeedMax: windSpeedMax[index],
    windDirection: windDirection[index],
    sunrise: sunrise[index],
    sunset: sunset[index],
  }));
}

export async function fetchForecast(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<Forecast> {
  if (
    !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
    !Number.isFinite(longitude) || longitude < -180 || longitude > 180
  ) {
    return invalid('coordinates');
  }
  const query = [
    `latitude=${latitude}`,
    `longitude=${longitude}`,
    `current=${currentFields.join(',')}`,
    `hourly=${hourlyFields.join(',')}`,
    `daily=${dailyFields.join(',')}`,
    'timezone=auto',
    'forecast_days=7',
    'temperature_unit=celsius',
    'wind_speed_unit=kmh',
    'precipitation_unit=mm',
  ].join('&');
  const payload = await getJson(`${OPEN_METEO_URL}?${query}`, REQUEST_TIMEOUT_MS, signal);
  if (
    typeof payload !== 'object' || payload === null || Array.isArray(payload) ||
    !('current' in payload) || !('hourly' in payload) ||
    !('daily' in payload) || !('timezone' in payload)
  ) {
    return invalid('forecast');
  }
  const current = parseCurrent(payload.current);
  const hourly = parseHourly(payload.hourly);
  const daily = parseDaily(payload.daily);
  if (typeof payload.timezone !== 'string' || !payload.timezone.trim()) {
    return invalid('timezone');
  }
  const currentHour = current.time.slice(0, 13);
  const firstHour = hourly.findIndex(point => point.time.slice(0, 13) === currentHour);

  return {
    current,
    hourly,
    next24: firstHour === -1 ? [] : hourly.slice(firstHour, firstHour + 24),
    daily,
    timezone: payload.timezone,
  };
}
