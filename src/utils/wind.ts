const directions = ['B', 'ĐB', 'Đ', 'ĐN', 'N', 'TN', 'T', 'TB'];

export function windDirection(degrees: number): string {
  if (!Number.isFinite(degrees)) {
    return 'Không xác định';
  }
  const normalized = ((degrees % 360) + 360) % 360;
  return directions[Math.round(normalized / 45) % directions.length];
}
