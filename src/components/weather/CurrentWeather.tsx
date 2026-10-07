import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, dimensions, iconSize, radius, space, type} from '../../theme/tokens';
import type {CurrentWeather as CurrentWeatherData, DailyPoint, Place} from '../../types/weather';
import {formatHour, formatTemp} from '../../utils/format';
import {weatherCode} from '../../utils/weatherCode';
import {Icon} from '../common/Icon';
import {HeroCard} from './HeroCard';
export function CurrentWeather({current, day, place, isDefault}: {current: CurrentWeatherData; day: DailyPoint; place: Place; isDefault: boolean}) {
  const condition = weatherCode(current.weatherCode, current.isDay);
  const location = place.region && place.region !== place.name ? `${place.name}, ${place.region}` : place.name;
  return <View style={styles.section}>
    <View style={styles.heading}><Icon name="pin" size={iconSize.xs} /><Text maxFontSizeMultiplier={dimensions.fontScale} style={styles.location}>{location}</Text></View>
    {isDefault ? <View style={styles.chip}><Text maxFontSizeMultiplier={dimensions.fontScale} style={styles.caption}>Vị trí mặc định</Text></View> : null}
    <Text maxFontSizeMultiplier={dimensions.fontScale} style={styles.caption}>Cập nhật {formatHour(current.time)}</Text>
    <HeroCard temperature={formatTemp(current.temperature)} label={condition.label} subtitle={`Cao ${formatTemp(day.temperatureMax)} · Thấp ${formatTemp(day.temperatureMin)} · Cảm giác ${formatTemp(current.apparentTemperature)}`} icon={condition.icon} isDay={current.isDay} theme={condition.theme} />
  </View>;
}
const styles = StyleSheet.create({
  section: {gap: space.xs}, heading: {flexDirection: 'row', alignItems: 'center', gap: space.xs},
  location: {...type.headline, color: colors.text, flex: 1}, caption: {...type.caption, color: colors.textSecondary},
  chip: {alignSelf: 'flex-start', paddingHorizontal: space.xs, paddingVertical: space.xxs, borderRadius: radius.sm, backgroundColor: colors.surfaceMuted},
});
