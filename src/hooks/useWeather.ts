import { useCallback, useEffect, useRef, useState } from 'react';
import { AppError } from '../api/http';
import { fetchForecast } from '../api/openMeteo';
import { reverseGeocode } from '../api/reverseGeocode';
import type { Coordinates, Forecast, Place } from '../types/weather';

export type WeatherState = {
  status: 'idle' | 'loading' | 'success' | 'empty' | 'error';
  data: Forecast | null;
  place: Place | null;
  error: AppError | null;
  refreshing: boolean;
  refresh: () => void;
};

type WeatherSnapshot = Omit<WeatherState, 'refresh'>;

const initialState: WeatherSnapshot = {
  status: 'idle',
  data: null,
  place: null,
  error: null,
  refreshing: false,
};

function weatherError(cause: unknown): AppError {
  if (cause instanceof AppError) {
    return cause;
  }
  return new AppError('network', 'Không tải được dữ liệu thời tiết. Vui lòng thử lại.');
}

export function useWeather(coords?: Coordinates | null): WeatherState {
  const [state, setState] = useState<WeatherSnapshot>(initialState);
  const mounted = useRef(false);
  const activeRequest = useRef<AbortController | null>(null);
  const latitude = coords?.latitude;
  const longitude = coords?.longitude;

  const startRequest = useCallback((isRefresh: boolean) => {
    if (!mounted.current) {
      return;
    }
    activeRequest.current?.abort();
    activeRequest.current = null;
    if (latitude === undefined || longitude === undefined) {
      setState(initialState);
      return;
    }

    const controller = new AbortController();
    activeRequest.current = controller;
    const isCurrent = () => (
      mounted.current && activeRequest.current === controller && !controller.signal.aborted
    );
    const fallbackPlace: Place = {
      name: `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
      region: '',
    };
    setState(previous => {
      if (!isRefresh || !previous.data) {
        return { ...initialState, status: 'loading', refreshing: isRefresh };
      }
      return {
        ...previous,
        status: previous.data.next24.length === 0 || previous.data.daily.length === 0
          ? 'empty' : 'success',
        error: null,
        refreshing: true,
      };
    });

    Promise.allSettled([
      fetchForecast(latitude, longitude, controller.signal),
      reverseGeocode(latitude, longitude, controller.signal),
    ]).then(([forecastResult, placeResult]) => {
      if (!isCurrent()) {
        return;
      }
      const place = placeResult.status === 'fulfilled' ? placeResult.value : fallbackPlace;
      if (forecastResult.status === 'rejected') {
        const cause: unknown = forecastResult.reason;
        setState(previous => ({
          ...previous,
          status: 'error',
          place: previous.data ? previous.place : place,
          error: weatherError(cause),
          refreshing: false,
        }));
      } else {
        const data = forecastResult.value;
        setState({
          status: data.next24.length === 0 || data.daily.length === 0 ? 'empty' : 'success',
          data,
          place,
          error: null,
          refreshing: false,
        });
      }
      activeRequest.current = null;
    }).catch((cause: unknown) => {
      if (!isCurrent()) {
        return;
      }
      setState(previous => ({
        ...previous,
        status: 'error',
        error: weatherError(cause),
        refreshing: false,
      }));
      activeRequest.current = null;
    });
  }, [latitude, longitude]);

  useEffect(() => {
    mounted.current = true;
    startRequest(false);
    return () => {
      mounted.current = false;
      activeRequest.current?.abort();
      activeRequest.current = null;
    };
  }, [startRequest]);

  const refresh = useCallback(() => {
    startRequest(true);
  }, [startRequest]);

  return { ...state, refresh };
}
