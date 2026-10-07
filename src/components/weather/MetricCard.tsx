import React, {type ReactNode} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, dimensions, iconSize, radius, space, type} from '../../theme/tokens';
import {Icon, type IconName} from '../common/Icon';
export function MetricCard({title, value, unit, caption, icon, children}: {title: string; value: string; unit: string; caption: string; icon: IconName; children: ReactNode}) {
  return <View accessible accessibilityLabel={`${title}: ${value} ${unit}. ${caption}`} style={styles.card}>
    <View style={styles.header}><Icon name={icon} size={iconSize.xs} /><Text maxFontSizeMultiplier={dimensions.fontScale} style={styles.title}>{title}</Text></View>
    <View style={styles.reading}><Text maxFontSizeMultiplier={dimensions.fontScale} adjustsFontSizeToFit numberOfLines={1} style={styles.value}>{value}</Text><Text maxFontSizeMultiplier={dimensions.fontScale} style={styles.unit}>{unit}</Text></View>
    <View style={styles.visual}>{children}</View>
    <Text maxFontSizeMultiplier={dimensions.fontScale} style={styles.caption}>{caption}</Text>
  </View>;
}
const styles = StyleSheet.create({
  card: {flex: 1, borderWidth: dimensions.border, borderColor: colors.border, borderRadius: radius.md, backgroundColor: colors.surface, padding: space.sm, gap: space.xs},
  header: {flexDirection: 'row', gap: space.xxs, alignItems: 'center'}, title: {...type.body, color: colors.textSecondary, flex: 1},
  reading: {flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', gap: space.xxs}, value: {...type.metric, color: colors.text, flexShrink: 1, fontVariant: ['tabular-nums']},
  unit: {...type.caption, color: colors.textSecondary}, visual: {height: dimensions.visualHeight}, caption: {...type.caption, color: colors.textSecondary},
});
