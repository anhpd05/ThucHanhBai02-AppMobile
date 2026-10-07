import React from 'react';
import Svg, {Circle, G, Path} from 'react-native-svg';
import {colors, dimensions, iconSize} from '../../theme/tokens';
import type {IconKind} from '../../types/weather';

export function WeatherIcon({kind, isDay = true, size = iconSize.md, accessibilityLabel}: {kind: IconKind; isDay?: boolean; size?: number; accessibilityLabel?: string}) {
  const celestial = kind === 'clear' || kind === 'partly';
  return <Svg width={size} height={size} viewBox="0 0 24 24" accessible={Boolean(accessibilityLabel)} accessibilityRole="image" accessibilityLabel={accessibilityLabel} accessibilityElementsHidden={!accessibilityLabel} importantForAccessibility={accessibilityLabel ? 'yes' : 'no-hide-descendants'}>
    <G fill="none" strokeWidth={dimensions.stroke} strokeLinecap="round" strokeLinejoin="round">
      {celestial ? <G transform={kind === 'partly' ? 'translate(-1 -3) scale(0.85)' : undefined}>
        {isDay ? <G stroke={colors.sun}><Circle cx={12} cy={12} r={4} /><Path d="M12 2v2 M12 20v2 M2 12h2 M20 12h2 M5 5l1.5 1.5 M17.5 17.5 19 19 M5 19l1.5-1.5 M17.5 6.5 19 5" /></G> : <Path stroke={colors.textSecondary} d="M20 14a8 8 0 0 1-10-10 8.5 8.5 0 1 0 10 10Z" />}
      </G> : null}
      {kind !== 'clear' && kind !== 'fog' ? <Path fill={colors.surface} stroke={colors.cloud} d="M6 16a4 4 0 1 1 .5-8 5.5 5.5 0 0 1 10.3 1.2A3.5 3.5 0 1 1 18 16H6Z" /> : null}
      {kind === 'fog' ? <Path stroke={colors.cloud} d="M3 7h18 M5 12h14 M3 17h18" /> : null}
      {kind === 'drizzle' ? <G fill={colors.rain} stroke={colors.rain}><Circle cx={7} cy={20} r={0.6} /><Circle cx={12} cy={21} r={0.6} /><Circle cx={17} cy={20} r={0.6} /></G> : null}
      {kind === 'rain' ? <Path stroke={colors.rain} d="M8 19l-2 3 M13 19l-2 3 M18 19l-2 3" /> : null}
      {kind === 'snow' ? <Path stroke={colors.rain} strokeWidth={1.2} d="M6 18v5 M4 19.2l4 2.6 M4 21.8l4-2.6 M12 18v5 M10 19.2l4 2.6 M10 21.8l4-2.6 M18 18v5 M16 19.2l4 2.6 M16 21.8l4-2.6" /> : null}
      {kind === 'storm' ? <Path stroke={colors.sun} d="m13 16-4 4h4l-2 3 6-5h-4l2-2" /> : null}
    </G>
  </Svg>;
}
