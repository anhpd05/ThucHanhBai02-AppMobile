import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, StyleSheet, Text, View} from 'react-native';
import {colors, dimensions, heroTint, iconSize, motion, radius, space, type} from '../../theme/tokens';
import type {IconKind, SkyTheme} from '../../types/weather';
import {useReducedMotion} from '../common/useReducedMotion';
import {WeatherIcon} from './WeatherIcon';

export function HeroCard({temperature, label, subtitle, icon, isDay, theme}: {temperature: string; label: string; subtitle?: string; icon: IconKind; isDay: boolean; theme: SkyTheme}) {
  const reduced = useReducedMotion();
  const opacity = useRef(new Animated.Value(1)).current;
  const [layers, setLayers] = useState({previous: theme, current: theme});
  useEffect(() => {
    if (layers.current !== theme) {
      opacity.stopAnimation();
      opacity.setValue(reduced ? 1 : 0);
      setLayers({previous: layers.current, current: theme});
      return;
    }
    if (reduced) { opacity.stopAnimation(); opacity.setValue(1); return; }
    const animation = Animated.timing(opacity, {toValue: 1, duration: motion.slow, easing: Easing.out(Easing.cubic), useNativeDriver: true});
    animation.start();
    return () => animation.stop();
  }, [layers, opacity, reduced, theme]);
  return <View style={styles.hero}>
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, {backgroundColor: heroTint[layers.previous]}]} />
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, {backgroundColor: heroTint[layers.current], opacity}]} />
    <View style={styles.top}>
      <Text maxFontSizeMultiplier={dimensions.displayScale} numberOfLines={1} adjustsFontSizeToFit style={[styles.temperature, temperature.length > 5 && styles.range]}>{temperature}</Text>
      <WeatherIcon kind={icon} isDay={isDay} size={iconSize.hero} />
    </View>
    <Text accessibilityRole="header" maxFontSizeMultiplier={dimensions.fontScale} style={styles.label}>{label}</Text>
    {subtitle ? <Text maxFontSizeMultiplier={dimensions.fontScale} style={styles.subtitle}>{subtitle}</Text> : null}
  </View>;
}
const styles = StyleSheet.create({
  hero: {borderRadius: radius.md, padding: space.lg, overflow: 'hidden', gap: space.xs},
  top: {flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: space.xs},
  temperature: {...type.display, color: colors.text, fontVariant: ['tabular-nums'], flexShrink: 1},
  range: {width: '100%'}, label: {...type.title, color: colors.text}, subtitle: {...type.body, color: colors.textSecondary},
});
