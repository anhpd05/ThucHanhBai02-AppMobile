import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import Svg, {Circle, Polyline} from 'react-native-svg';
import {colors, dimensions, iconSize, layout, radius, space, touch, type} from '../../theme/tokens';
import type {HourlyPoint} from '../../types/weather';
import {formatHour, formatTemp} from '../../utils/format';
import {weatherCode} from '../../utils/weatherCode';
import {WeatherIcon} from './WeatherIcon';
const chartTop = type.caption.lineHeight * dimensions.fontScale * 2 + space.xs + iconSize.md + space.xs;
export function HourlyForecast({items, onPressItem, now}: {items: HourlyPoint[]; onPressItem: (index: number) => void; now?: string}) {
  const hours = items.slice(0, 24);
  const low = Math.min(...hours.map(item => item.temperature));
  const high = Math.max(...hours.map(item => item.temperature));
  const points = hours.map((item, index) => ({x: (index + 0.5) * layout.hourColumnWidth, y: high === low ? space.xl / 2 : space.xxs + (high - item.temperature) / (high - low) * (space.xl - space.xs)}));
  return <ScrollView horizontal showsHorizontalScrollIndicator accessibilityLabel="Dự báo theo giờ, vuốt ngang để xem thêm">
    <View style={styles.strip}>
      {hours.map((item, index) => {
        const current = now !== undefined && item.time.slice(0, 13) === now.slice(0, 13);
        const hour = current ? 'Bây giờ' : formatHour(item.time);
        const condition = weatherCode(item.weatherCode, item.isDay);
        return <Pressable key={item.time} accessibilityRole="button" accessibilityLabel={`${hour}, ${condition.label}, ${formatTemp(item.temperature)}, khả năng mưa ${item.precipitationProbability} phần trăm`} accessibilityHint="Mở chi tiết dự báo giờ này" accessibilityState={{selected: current}} onPress={() => onPressItem(index)} android_ripple={{color: colors.surfaceMuted}} style={({pressed}) => [styles.column, (pressed || current) && styles.selected]}>
          <Text maxFontSizeMultiplier={dimensions.fontScale} style={[styles.hour, current && styles.current]}>{hour}</Text>
          <WeatherIcon kind={condition.icon} isDay={item.isDay} />
          <View style={styles.chartSpace} />
          <Text maxFontSizeMultiplier={dimensions.fontScale} style={styles.temperature}>{formatTemp(item.temperature)}</Text>
          <Text maxFontSizeMultiplier={dimensions.fontScale} style={styles.rain}>{item.precipitationProbability}%</Text>
        </Pressable>;
      })}
      {hours.length > 0 ? <View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.chart}>
        <Svg width={hours.length * layout.hourColumnWidth} height={space.xl}>
          <Polyline points={points.map(point => `${point.x},${point.y}`).join(' ')} stroke={colors.temp} strokeWidth={dimensions.stroke} fill="none" strokeLinejoin="round" />
          {points.map((point, index) => <Circle key={hours[index].time} cx={point.x} cy={point.y} r={2.5} fill={colors.temp} />)}
        </Svg>
      </View> : null}
    </View>
  </ScrollView>;
}
const styles = StyleSheet.create({
  strip: {flexDirection: 'row', position: 'relative'}, column: {width: layout.hourColumnWidth, minHeight: touch.min, alignItems: 'center', gap: space.xs, borderRadius: radius.sm, paddingBottom: space.xs, overflow: 'hidden'},
  selected: {backgroundColor: colors.surfaceMuted}, hour: {...type.caption, color: colors.textSecondary, height: type.caption.lineHeight * dimensions.fontScale * 2, textAlign: 'center', textAlignVertical: 'center'},
  current: {fontWeight: type.bodyStrong.fontWeight, color: colors.text}, chartSpace: {height: space.xl}, chart: {position: 'absolute', top: chartTop, left: 0},
  temperature: {...type.bodyStrong, color: colors.text, fontVariant: ['tabular-nums']}, rain: {...type.caption, color: colors.rain, fontVariant: ['tabular-nums']},
});
