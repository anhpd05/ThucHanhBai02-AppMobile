import type { Coordinates } from './types/weather';

export const DEFAULT_COORDS: Coordinates = {
  latitude: 21.0285,
  longitude: 105.8542,
  source: 'default',
};

export const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';
export const REVERSE_GEOCODE_URL =
  'https://api.bigdatacloud.net/data/reverse-geocode-client';
export const REQUEST_TIMEOUT_MS = 15000;
