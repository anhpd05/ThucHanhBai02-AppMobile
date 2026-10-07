import React from 'react';
import Svg, {Circle, G, Path, Text} from 'react-native-svg';
import {colors, dimensions, type} from '../../../theme/tokens';
export function WindCompass({direction}: {direction: number}) {
  const degrees = ((direction % 360) + 360) % 360;
  return <Svg width="100%" height={dimensions.visualHeight} viewBox="0 0 120 40" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
    <Circle cx={60} cy={20} r={17} fill="none" stroke={colors.border} strokeWidth={dimensions.stroke} />
    <Path d="M60 3v4 M60 33v4 M43 20h4 M73 20h4" stroke={colors.dataNeutral} strokeWidth={dimensions.stroke} />
    <Text x={85} y={type.caption.lineHeight} fill={colors.textSecondary} fontSize={type.caption.fontSize}>Bắc</Text>
    <G rotation={degrees} origin="60, 20"><Path d="M60 8 65 25 60 22 55 25Z" fill={colors.dataNeutral} stroke={colors.dataNeutral} strokeLinejoin="round" /></G>
    <Circle cx={60} cy={20} r={2} fill={colors.surface} />
  </Svg>;
}
