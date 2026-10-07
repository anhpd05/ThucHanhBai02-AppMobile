import React, { createContext, useContext, useMemo } from 'react';
import { useLocation, type LocationState } from '../hooks/useLocation';
import { useWeather, type WeatherState } from '../hooks/useWeather';

type WeatherContextValue = {
  location: LocationState;
  weather: WeatherState;
};
const WeatherContext = createContext<WeatherContextValue | null>(null);

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const weather = useWeather(location.coords);
  const value = useMemo(() => ({ location, weather }), [location, weather]);
  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeatherContext(): WeatherContextValue {
  const value = useContext(WeatherContext);
  if (!value) {
    throw new Error('WeatherProvider chưa được khởi tạo.');
  }
  return value;
}
