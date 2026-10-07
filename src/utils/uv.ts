export type UvLevel = {
  label: string;
  level: 'low' | 'moderate' | 'high' | 'veryHigh' | 'extreme';
};

export function uvLevel(index: number): UvLevel {
  if (index < 3) {
    return { label: 'Thấp', level: 'low' };
  }
  if (index < 6) {
    return { label: 'Trung bình', level: 'moderate' };
  }
  if (index < 8) {
    return { label: 'Cao', level: 'high' };
  }
  if (index < 11) {
    return { label: 'Rất cao', level: 'veryHigh' };
  }
  return { label: 'Nguy hiểm', level: 'extreme' };
}
