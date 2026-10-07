import React from 'react';
import Svg, {Circle, G, Path} from 'react-native-svg';
import {colors, dimensions, iconSize} from '../../theme/tokens';

export type IconName = 'pin' | 'back' | 'refresh' | 'droplet' | 'wind' | 'gauge' | 'eye' | 'sunrise' | 'sunset' | 'alert' | 'location-off';
const paths: Record<IconName, string> = {
  pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z M15 10a3 3 0 1 1-6 0a3 3 0 0 1 6 0',
  back: 'M20 12H4m7-7-7 7 7 7',
  refresh: 'M20 7v5h-5 M20 12a8 8 0 1 0-2 6 M20 7v5',
  droplet: 'M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13Z',
  wind: 'M3 8h12a3 3 0 1 0-3-3 M3 12h15a3 3 0 1 1-3 3 M3 16h5a3 3 0 1 1-3 3',
  gauge: 'M4 19a10 10 0 1 1 16 0 M12 13l5-6 M5 14H3 M7 7 5 5 M12 5V2 M19 14h2',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0',
  sunrise: 'M2 18h20 M6 15a6 6 0 0 1 12 0 M12 2v7 M9 5l3-3 3 3 M3 10l2 2 M21 10l-2 2 M4 22h16',
  sunset: 'M2 18h20 M6 15a6 6 0 0 1 12 0 M12 2v7 M9 6l3 3 3-3 M3 10l2 2 M21 10l-2 2 M4 22h16',
  alert: 'M10.3 3.5 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.5a2 2 0 0 0-3.4 0Z M12 8v5 M12 17h.01',
  'location-off': 'M3 3l18 18 M6 6a8 8 0 0 0-2 5c0 5 8 11 8 11s3-2 5-5 M10 3a8 8 0 0 1 10 8c0 1-.3 2-.8 3 M10 10a3 3 0 0 0 4 4',
};
export function Icon({name, size = iconSize.md, color = colors.textSecondary, accessibilityLabel}: {name: IconName; size?: number; color?: string; accessibilityLabel?: string}) {
  return <Svg width={size} height={size} viewBox="0 0 24 24" accessible={Boolean(accessibilityLabel)} accessibilityRole="image" accessibilityLabel={accessibilityLabel} accessibilityElementsHidden={!accessibilityLabel} importantForAccessibility={accessibilityLabel ? 'yes' : 'no-hide-descendants'}>
    <G fill="none" stroke={color} strokeWidth={dimensions.stroke} strokeLinecap="round" strokeLinejoin="round">
      <Path d={paths[name]} />
      {name === 'gauge' ? <Circle cx={12} cy={14} r={1.5} /> : null}
    </G>
  </Svg>;
}
