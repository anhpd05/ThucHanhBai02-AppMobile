import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Svg, {Line} from 'react-native-svg';
import {colors, dimensions, layout, radius, space, type} from '../../theme/tokens';
import type {DailyPoint} from '../../types/weather';
import {formatTemp, formatWeekday} from '../../utils/format';
import {weatherCode} from '../../utils/weatherCode';
import {WeatherIcon} from './WeatherIcon';
export function DailyForecast({items, onPressItem, today}: {items: DailyPoint[]; onPressItem: (index: number) => void; today?: string}) {
  const days = items.slice(0, 7);
  const low = Math.min(...days.map(day => day.temperatureMin));
  const high = Math.max(...days.map(day => day.temperatureMax));
  const span = high - low || 1;
  return <View>{days.map((day, index) => {
    const condition = weatherCode(day.weatherCode);
    const name = formatWeekday(day.date, today);
    const current = day.date === today;
    return <Pressable key={day.date} accessibilityRole="button" accessibilityLabel={`${name}, ${condition.label}, thấp ${formatTemp(day.temperatureMin)}, cao ${formatTemp(day.temperatureMax)}, khả năng mưa ${day.precipitationProbability} phần trăm`} accessibilityHint="Mở chi tiết dự báo ngày này" accessibilityState={{selected: current}} onPress={() => onPressItem(index)} android_ripple={{color: colors.surfaceMuted}} style={({pressed}) => [styles.row, index > 0 && styles.divider, pressed && styles.pressed]}>
      <View style={styles.summary}><WeatherIcon kind={condition.icon} /><View style={styles.description}>
        <Text maxFontSizeMultiplier={dimensions.fontScale} style={[styles.day, current && styles.today]}>{name}</Text>
        <Text maxFontSizeMultiplier={dimensions.fontScale} style={styles.condition}>{condition.label}</Text>
      </View><Text maxFontSizeMultiplier={dimensions.fontScale} style={styles.rain}>{day.precipitationProbability}%</Text></View>
      <View style={styles.temperatures}>
        <Text maxFontSizeMultiplier={dimensions.fontScale} style={styles.low}>Thấp {formatTemp(day.temperatureMin)}</Text>
        <View style={styles.range} accessible={false} importantForAccessibility="no-hide-descendants">
          <Svg width="100%" height={space.xs} viewBox="0 0 100 8" preserveAspectRatio="none">
            <Line x1={4} y1={4} x2={96} y2={4} stroke={colors.surfaceMuted} strokeWidth={8} strokeLinecap="round" />
            <Line x1={4 + (day.temperatureMin - low) / span * 92} y1={4} x2={4 + (day.temperatureMax - low) / span * 92} y2={4} stroke={colors.tempSoft} strokeWidth={8} strokeLinecap="round" />
          </Svg>
        </View>
        <Text maxFontSizeMultiplier={dimensions.fontScale} style={styles.high}>Cao {formatTemp(day.temperatureMax)}</Text>
      </View>
    </Pressable>;
  })}</View>;
}
const styles = StyleSheet.create({
  row: {minHeight: layout.dayRowHeight, paddingVertical: space.sm, gap: space.xs, borderRadius: radius.sm, overflow: 'hidden'}, divider: {borderTopWidth: dimensions.border, borderTopColor: colors.border}, pressed: {backgroundColor: colors.surfaceMuted},
  summary: {flexDirection: 'row', alignItems: 'center', gap: space.xs}, description: {flex: 1, gap: space.xxs},
  day: {...type.body, color: colors.text}, today: {fontWeight: type.bodyStrong.fontWeight}, condition: {...type.caption, color: colors.textSecondary}, rain: {...type.caption, color: colors.rain, fontVariant: ['tabular-nums']},
  temperatures: {flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space.xs}, low: {...type.caption, color: colors.textSecondary, fontVariant: ['tabular-nums']},
  high: {...type.caption, color: colors.temp, fontWeight: type.bodyStrong.fontWeight, fontVariant: ['tabular-nums']}, range: {flex: 1, minWidth: space.lg},
});
