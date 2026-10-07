import React from 'react';
import Svg, {Circle, Line} from 'react-native-svg';
import {colors, dimensions} from '../../../theme/tokens';
export function LevelBar({min, max, value, color = colors.dataNeutral}: {min: number; max: number; value: number; color?: string}) {
  const fraction = max > min ? Math.max(0, Math.min(1, (value - min) / (max - min))) : 0.5;
  return <Svg width="100%" height={dimensions.visualHeight} viewBox="0 0 120 40" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
    <Line x1={6} y1={20} x2={114} y2={20} stroke={colors.surfaceMuted} strokeWidth={8} strokeLinecap="round" />
    <Line x1={6} y1={20} x2={6 + fraction * 108} y2={20} stroke={color} strokeWidth={8} strokeLinecap="round" />
    <Circle cx={6 + fraction * 108} cy={20} r={5} fill={color} stroke={colors.surface} strokeWidth={2} />
  </Svg>;
}
