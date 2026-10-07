import React from 'react';
import Svg, {Circle} from 'react-native-svg';
import {colors, dimensions} from '../../../theme/tokens';
export function RingGauge({percent}: {percent: number}) {
  const fraction = Math.max(0, Math.min(100, percent)) / 100;
  const circumference = 2 * Math.PI * 16;
  return <Svg width="100%" height={dimensions.visualHeight} viewBox="0 0 120 40" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
    <Circle cx={60} cy={20} r={16} fill="none" stroke={colors.surfaceMuted} strokeWidth={5} />
    {fraction > 0 ? <Circle cx={60} cy={20} r={16} fill="none" stroke={colors.rain} strokeWidth={5} strokeDasharray={`${circumference * fraction} ${circumference}`} rotation={-90} origin="60, 20" /> : null}
  </Svg>;
}
