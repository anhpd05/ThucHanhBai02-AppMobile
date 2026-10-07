import { REQUEST_TIMEOUT_MS, REVERSE_GEOCODE_URL } from '../constants';
import type { Place } from '../types/weather';
import { AppError, getJson } from './http';

function placeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<Place> {
  if (
    !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
    !Number.isFinite(longitude) || longitude < -180 || longitude > 180
  ) {
    throw new AppError('http', 'Toạ độ địa điểm không hợp lệ.');
  }
  const payload = await getJson(
    `${REVERSE_GEOCODE_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=vi`,
    REQUEST_TIMEOUT_MS,
    signal,
  );
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    throw new AppError('http', 'Không đọc được tên địa điểm.');
  }
  const locality = placeText('locality' in payload ? payload.locality : undefined);
  const city = placeText('city' in payload ? payload.city : undefined);
  const subdivision = placeText(
    'principalSubdivision' in payload ? payload.principalSubdivision : undefined,
  );
  const country = placeText('countryName' in payload ? payload.countryName : undefined);
  const name = locality || city || subdivision || country;
  if (!name) {
    throw new AppError('http', 'Nguồn dữ liệu chưa trả về tên địa điểm.');
  }
  const region = [city, subdivision, country].find(value => value && value !== name) ?? '';
  return { name, region };
}
