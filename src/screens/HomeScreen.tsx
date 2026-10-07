import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useWeatherContext } from '../context/WeatherContext';
import { Card } from '../components/common/Card';
import { LoadingView } from '../components/common/LoadingView';
import { ErrorView } from '../components/common/ErrorView';
import { EmptyView } from '../components/common/EmptyView';
import { PermissionView } from '../components/common/PermissionView';
import { FadeInView } from '../components/common/FadeInView';
import { CurrentWeather } from '../components/weather/CurrentWeather';
import { HourlyForecast } from '../components/weather/HourlyForecast';
import { DailyForecast } from '../components/weather/DailyForecast';
import { MetricGrid } from '../components/weather/MetricGrid';
import { colors, gutterFor, layout, space, type } from '../theme/tokens';
import { buildCurrentMetrics } from '../utils/metrics';
import { formatHour } from '../utils/format';

export function HomeScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  const { location, weather } = useWeatherContext();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const data = weather.data;
  let content: React.ReactNode;
  if (!location.coords && (location.status === 'denied' || location.status === 'blocked' || location.status === 'error')) {
    content = <PermissionView status={location.status} onRequest={location.request} onDefault={location.useDefault} onSettings={location.openSettings} />;
  } else if (weather.status === 'error') {
    content = <ErrorView message={weather.error?.message ?? 'Không tải được dữ liệu.'} onRetry={weather.refresh} />;
  } else if (weather.status === 'empty') {
    content = <EmptyView onRetry={weather.refresh} />;
  } else if (!data || !weather.place || !data.daily[0]) {
    content = <LoadingView />;
  } else {
    content = (
      <FadeInView>
        <View style={styles.sections}>
          <CurrentWeather current={data.current} day={data.daily[0]} place={weather.place} isDefault={location.coords?.source === 'default'} />
          <Card title="24 giờ tới">
            <HourlyForecast items={data.next24} now={data.current.time} onPressItem={index => navigation.navigate('Detail', { kind: 'hour', index: data.hourly.findIndex(hour => hour.time === data.next24[index].time) })} />
          </Card>
          <Card title="7 ngày tới">
            <DailyForecast items={data.daily} today={data.current.time.slice(0, 10)} onPressItem={index => navigation.navigate('Detail', { kind: 'day', index })} />
          </Card>
          <Text style={styles.section} maxFontSizeMultiplier={1.4}>Chỉ số hiện tại</Text>
          <MetricGrid items={buildCurrentMetrics(data.current, data.daily[0])} />
          <Text style={styles.source} maxFontSizeMultiplier={1.4}>Dữ liệu: Open-Meteo · cập nhật {formatHour(data.current.time)}</Text>
        </View>
      </FadeInView>
    );
  }
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingHorizontal: gutterFor(width), paddingBottom: insets.bottom + space.lg }]} refreshControl={location.coords ? <RefreshControl refreshing={weather.refreshing} onRefresh={weather.refresh} colors={[colors.accent]} /> : undefined}>
        <View style={styles.content}>{content}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, paddingTop: space.md, alignItems: 'center' },
  content: { width: '100%', maxWidth: layout.maxContentWidth, flexGrow: 1 },
  sections: { gap: space.md },
  section: { ...type.section, color: colors.textSecondary },
  source: { ...type.caption, color: colors.textMuted, textAlign: 'center' },
});
