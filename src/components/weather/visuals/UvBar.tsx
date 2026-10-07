import React from 'react';
import Svg, {Circle, Rect} from 'react-native-svg';
import {colors, dimensions, uvColors} from '../../../theme/tokens';
const segments = [uvColors.low, uvColors.moderate, uvColors.high, uvColors.veryHigh, uvColors.extreme];
export function UvBar({index}: {index: number}) {
  const value = Math.max(0, Math.min(12, index));
  const position = value < 3 ? value / 3 : value < 6 ? 1 + (value - 3) / 3 : value < 8 ? 2 + (value - 6) / 2 : value < 11 ? 3 + (value - 8) / 3 : 4 + (value - 11);
  return <Svg width="100%" height={dimensions.visualHeight} viewBox="0 0 120 40" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
    {segments.map((color, segment) => <Rect key={color} x={4 + segment * 23} y={19} width={20} height={8} rx={2} fill={color} />)}
    <Circle cx={4 + Math.min(position, 5) / 5 * 112} cy={12} r={4} fill={colors.text} />
  </Svg>;
}
