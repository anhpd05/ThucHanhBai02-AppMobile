import React, {type ReactNode} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, dimensions, radius, space, type} from '../../theme/tokens';
export function Card({children, title}: {children: ReactNode; title?: string}) {
  return <View style={styles.card}>{title ? <Text accessibilityRole="header" maxFontSizeMultiplier={dimensions.fontScale} style={styles.title}>{title}</Text> : null}{children}</View>;
}
const styles = StyleSheet.create({
  card: {backgroundColor: colors.surface, borderColor: colors.border, borderWidth: dimensions.border, borderRadius: radius.md, padding: space.md, gap: space.sm},
  title: {...type.section, color: colors.textSecondary},
});
