import type {TextStyle} from 'react-native';
import type {SkyTheme} from '../types/weather';

export const colors = {
  bg: '#F4F6F8', surface: '#FFFFFF', surfaceMuted: '#EEF1F4', border: '#E4E7EC',
  text: '#15202B', textSecondary: '#475467', textMuted: '#667085', accent: '#1F5FBF',
  onAccent: '#FFFFFF', danger: '#B42318', temp: '#B45309', tempSoft: '#F5C98B',
  rain: '#2563A8', rainSoft: '#C9DBF0', dataNeutral: '#475467', sun: '#D97706', cloud: '#667085',
} as const;
export const uvColors = {low: '#2E7D32', moderate: '#A16207', high: '#C2410C', veryHigh: '#B42318', extreme: '#6B21A8'} as const;
export const heroTint = {clearDay: '#FDF3E1', clearNight: '#E6E9F2', cloudy: '#EDF0F4', rain: '#E3ECF6', storm: '#E8E6F1', mist: '#EFEFEB'} as const satisfies Record<SkyTheme, string>;
export const space = {xxs: 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 48} as const;
export const radius = {sm: 8, md: 12, full: 999} as const;
export const iconSize = {xs: 16, sm: 20, md: 24, lg: 32, hero: 88} as const;
export const touch = {min: 48} as const;
export const layout = {maxContentWidth: 640, hourColumnWidth: 56, dayRowHeight: 52} as const;
export const type = {
  display: {fontSize: 72, lineHeight: 80, fontWeight: '300', letterSpacing: -1},
  title: {fontSize: 20, lineHeight: 26, fontWeight: '600'},
  headline: {fontSize: 17, lineHeight: 24, fontWeight: '600'},
  metric: {fontSize: 24, lineHeight: 30, fontWeight: '600'},
  body: {fontSize: 15, lineHeight: 22, fontWeight: '400'},
  bodyStrong: {fontSize: 15, lineHeight: 22, fontWeight: '600'},
  section: {fontSize: 14, lineHeight: 20, fontWeight: '600'},
  caption: {fontSize: 12, lineHeight: 16, fontWeight: '400'},
} as const satisfies Record<string, TextStyle>;
export const motion = {fast: 150, base: 200, slow: 250, pulse: 900} as const;
export function gutterFor(width: number): number {
  if (width >= 600) { return space.lg; }
  if (width >= 400) { return 20; }
  return space.md;
}
export function metricColumnsFor(width: number): 2 | 3 { return width >= 600 ? 3 : 2; }
export const dimensions = {border: 1, stroke: 1.75, fontScale: 1.4, displayScale: 1.2, skeletonOpacity: 0.55, visualHeight: 40, stateWidth: 320} as const;
