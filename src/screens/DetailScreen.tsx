import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useWeatherContext } from '../context/WeatherContext';
import { Card } from '../components/common/Card';
import { Icon } from '../components/common/Icon';
import { Button } from '../components/common/Button';
import { StateView } from '../components/common/StateView';
import { FadeInView } from '../components/common/FadeInView';
import { HeroCard } from '../components/weather/HeroCard';
import { HourlyForecast } from '../components/weather/HourlyForecast';
import { MetricGrid } from '../components/weather/MetricGrid';
import { colors, gutterFor, iconSize, layout, space, touch, type } from '../theme/tokens';
import { weatherCode } from '../utils/weatherCode';
import { formatDayMonth, formatHour, formatTemp, formatWeekday } from '../utils/format';
import { buildDayMetrics, buildHourMetrics } from '../utils/metrics';

export function DetailScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'Detail'>) {
  const { weather } = useWeatherContext();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const data = weather.data;
  const { kind, index } = route.params;
  const hour = kind === 'hour' ? data?.hourly[index] : undefined;
  const day = kind === 'day' ? data?.daily[index] : data?.daily.find(item => item.date === hour?.time.slice(0, 10));
  const selected = kind === 'hour' ? hour : day;
  const valid = Number.isInteger(index) && index >= 0 && data && selected;
  const heading = hour ? `${formatHour(hour.time)} · ${formatDayMonth(hour.time)}` : day ? `${formatWeekday(day.date)}, ${formatDayMonth(day.date)}` : 'Chi tiết dự báo';
  const code = weatherCode(selected?.weatherCode ?? -1, hour?.isDay ?? true);
  const hours = day && data ? data.hourly.filter(item => item.time.startsWith(day.date)) : [];
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingHorizontal: gutterFor(width), paddingBottom: insets.bottom + space.lg }]}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Pressable accessibilityRole="button" accessibilityLabel="Quay lại" onPress={navigation.goBack} android_ripple={{ color: colors.surfaceMuted }} style={styles.back}>
              <Icon name="back" size={iconSize.md} />
            </Pressable>
            <Text style={styles.heading} maxFontSizeMultiplier={1.4}>{heading}</Text>
          </View>
          {!valid ? (
            <StateView title="Không tìm thấy dự báo" message="Mục này không còn trong dữ liệu hiện có." icon="alert">
              <Button title="Quay lại" onPress={navigation.goBack} />
            </StateView>
          ) : (
            <FadeInView>
              <View style={styles.sections}>
                <HeroCard temperature={hour ? formatTemp(hour.temperature) : formatTemp(day!.temperatureMax)} label={code.label} subtitle={hour ? `${Math.round(hour.precipitationProbability)}% khả năng mưa · Cảm giác ${formatTemp(hour.apparentTemperature)}` : `Thấp ${formatTemp(day!.temperatureMin)} · ${Math.round(day!.precipitationProbability)}% khả năng mưa`} icon={code.icon} isDay={hour?.isDay ?? true} theme={code.theme} />
                {!hour && day ? (
                  <Card title="Mặt trời">
                    <View style={styles.sunRow}>
                      <View style={styles.sunItem}><Icon name="sunrise" size={iconSize.lg} /><Text style={styles.body} maxFontSizeMultiplier={1.4}>Mọc {formatHour(day.sunrise)}</Text></View>
                      <View style={styles.sunItem}><Icon name="sunset" size={iconSize.lg} /><Text style={styles.body} maxFontSizeMultiplier={1.4}>Lặn {formatHour(day.sunset)}</Text></View>
                    </View>
                  </Card>
                ) : null}
                <Text style={styles.section} maxFontSizeMultiplier={1.4}>{hour ? 'Chỉ số theo giờ' : 'Chỉ số trong ngày'}</Text>
                <MetricGrid items={hour ? buildHourMetrics(hour, day) : buildDayMetrics(day!, hours)} />
                {!hour ? <Card title="Theo giờ trong ngày"><HourlyForecast items={hours} onPressItem={hourIndex => navigation.push('Detail', { kind: 'hour', index: data.hourly.indexOf(hours[hourIndex]) })} /></Card> : null}
                <Text style={styles.source} maxFontSizeMultiplier={1.4}>Dữ liệu: Open-Meteo</Text>
              </View>
            </FadeInView>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, alignItems: 'center', paddingTop: space.xs },
  content: { width: '100%', maxWidth: layout.maxContentWidth },
  header: { flexDirection: 'row', alignItems: 'center', gap: space.xs, marginBottom: space.md },
  back: { width: touch.min, height: touch.min, alignItems: 'center', justifyContent: 'center' },
  heading: { ...type.title, color: colors.text, flex: 1 },
  sections: { gap: space.md },
  section: { ...type.section, color: colors.textSecondary },
  sunRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md, justifyContent: 'space-between' },
  sunItem: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  body: { ...type.body, color: colors.text },
  source: { ...type.caption, color: colors.textMuted, textAlign: 'center' },
});
