import React from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {colors, layout, metricColumnsFor, space} from '../../theme/tokens';
import type {MetricItem} from '../../types/weather';
import type {IconName} from '../common/Icon';
import {MetricCard} from './MetricCard';
import {LevelBar} from './visuals/LevelBar';
import {RingGauge} from './visuals/RingGauge';
import {UvBar} from './visuals/UvBar';
import {WindCompass} from './visuals/WindCompass';
const icons: Record<MetricItem['key'], IconName> = {temperature: 'gauge', humidity: 'droplet', windSpeed: 'wind', windDirection: 'pin', uv: 'sunrise', rain: 'droplet', pressure: 'gauge', visibility: 'eye'};
const levelColors: Partial<Record<MetricItem['key'], string>> = {temperature: colors.temp, rain: colors.rain};
function MetricVisual({item}: {item: MetricItem}) {
  const {visual} = item;
  switch (visual.type) {
    case 'ring': return <RingGauge percent={visual.percent} />;
    case 'compass': return <WindCompass direction={visual.degrees} />;
    case 'uv': return <UvBar index={visual.index} />;
    default: return <LevelBar min={visual.min} max={visual.max} value={visual.value} color={levelColors[item.key] ?? colors.dataNeutral} />;
  }
}
export function MetricGrid({items}: {items: MetricItem[]}) {
  const {width} = useWindowDimensions();
  const columns = metricColumnsFor(width);
  const rows: MetricItem[][] = [];
  for (let index = 0; index < items.length; index += columns) { rows.push(items.slice(index, index + columns)); }
  return <View style={styles.grid}>{rows.map((row, rowIndex) => <View style={styles.row} key={row[0].key}>
    {row.map(item => <View key={item.key} style={styles.cell}><MetricCard title={item.title} value={item.value} unit={item.unit} caption={item.caption} icon={icons[item.key]}>
      <MetricVisual item={item} />
    </MetricCard></View>)}
    {row.length < columns ? Array.from({length: columns - row.length}, (_, index) => <View key={`empty-${rowIndex}-${index}`} style={styles.cell} />) : null}
  </View>)}</View>;
}
const styles = StyleSheet.create({grid: {width: '100%', maxWidth: layout.maxContentWidth, alignSelf: 'center', gap: space.sm}, row: {flexDirection: 'row', gap: space.sm}, cell: {flex: 1, minWidth: 0}});
