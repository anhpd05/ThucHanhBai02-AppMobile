import type { IconKind, SkyTheme } from '../types/weather';

export type WeatherDescription = {
  label: string;
  icon: IconKind;
  theme: SkyTheme;
};

const descriptions: Partial<Record<number, WeatherDescription>> = {
  0: { label: 'Trời quang', icon: 'clear', theme: 'clearDay' },
  1: { label: 'Ít mây', icon: 'partly', theme: 'clearDay' },
  2: { label: 'Mây rải rác', icon: 'partly', theme: 'clearDay' },
  3: { label: 'Nhiều mây', icon: 'cloudy', theme: 'cloudy' },
  45: { label: 'Sương mù', icon: 'fog', theme: 'mist' },
  48: { label: 'Sương mù băng', icon: 'fog', theme: 'mist' },
  51: { label: 'Mưa phùn nhẹ', icon: 'drizzle', theme: 'rain' },
  53: { label: 'Mưa phùn', icon: 'drizzle', theme: 'rain' },
  55: { label: 'Mưa phùn dày', icon: 'drizzle', theme: 'rain' },
  56: { label: 'Mưa phùn băng nhẹ', icon: 'drizzle', theme: 'rain' },
  57: { label: 'Mưa phùn băng', icon: 'drizzle', theme: 'rain' },
  61: { label: 'Mưa nhỏ', icon: 'rain', theme: 'rain' },
  63: { label: 'Mưa vừa', icon: 'rain', theme: 'rain' },
  65: { label: 'Mưa to', icon: 'rain', theme: 'rain' },
  66: { label: 'Mưa băng nhẹ', icon: 'rain', theme: 'rain' },
  67: { label: 'Mưa băng', icon: 'rain', theme: 'rain' },
  71: { label: 'Tuyết nhẹ', icon: 'snow', theme: 'mist' },
  73: { label: 'Tuyết', icon: 'snow', theme: 'mist' },
  75: { label: 'Tuyết dày', icon: 'snow', theme: 'mist' },
  77: { label: 'Tuyết hạt', icon: 'snow', theme: 'mist' },
  80: { label: 'Mưa rào nhẹ', icon: 'rain', theme: 'rain' },
  81: { label: 'Mưa rào', icon: 'rain', theme: 'rain' },
  82: { label: 'Mưa rào mạnh', icon: 'rain', theme: 'rain' },
  85: { label: 'Mưa tuyết nhẹ', icon: 'snow', theme: 'mist' },
  86: { label: 'Mưa tuyết', icon: 'snow', theme: 'mist' },
  95: { label: 'Dông', icon: 'storm', theme: 'storm' },
  96: { label: 'Dông kèm mưa đá nhẹ', icon: 'storm', theme: 'storm' },
  99: { label: 'Dông kèm mưa đá', icon: 'storm', theme: 'storm' },
};

const unknownWeather: WeatherDescription = {
  label: 'Không xác định',
  icon: 'cloudy',
  theme: 'cloudy',
};

export function weatherCode(code: number, isDay: boolean = true): WeatherDescription {
  const description = descriptions[code] ?? unknownWeather;
  if (!isDay && description.theme === 'clearDay') {
    return { ...description, theme: 'clearNight' };
  }
  return description;
}
