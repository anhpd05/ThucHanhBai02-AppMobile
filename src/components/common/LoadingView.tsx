import React, {useEffect, useRef} from 'react';
import {Animated, Easing, ScrollView, StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {colors, dimensions, gutterFor, layout, motion, radius, space, type} from '../../theme/tokens';
import {useReducedMotion} from './useReducedMotion';
export function LoadingView() {
  const {width} = useWindowDimensions();
  const reduced = useReducedMotion();
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (reduced) { opacity.setValue(1); return; }
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(opacity, {toValue: dimensions.skeletonOpacity, duration: motion.pulse, easing: Easing.out(Easing.cubic), useNativeDriver: true}),
      Animated.timing(opacity, {toValue: 1, duration: motion.pulse, easing: Easing.out(Easing.cubic), useNativeDriver: true}),
    ]));
    animation.start();
    return () => { animation.stop(); opacity.setValue(1); };
  }, [opacity, reduced]);
  return <ScrollView contentContainerStyle={[styles.scroll, {paddingHorizontal: gutterFor(width)}]}>
    <View style={styles.content} accessible accessibilityLabel="Đang tải dự báo thời tiết" accessibilityState={{busy: true}} accessibilityLiveRegion="polite">
      <Text maxFontSizeMultiplier={dimensions.fontScale} style={styles.label}>Đang tải dự báo thời tiết</Text>
      <Animated.View importantForAccessibility="no-hide-descendants" accessibilityElementsHidden style={[styles.blocks, {opacity}]}>
        <View style={[styles.block, styles.name]} /><View style={[styles.block, styles.caption]} />
        <View style={[styles.block, styles.hero]} /><View style={[styles.block, styles.hours]} />
        <View style={styles.days}>{[0, 1, 2].map(index => <View key={index} style={[styles.block, styles.day]} />)}</View>
      </Animated.View>
    </View>
  </ScrollView>;
}
const styles = StyleSheet.create({
  scroll: {paddingVertical: space.lg, alignItems: 'center'}, content: {width: '100%', maxWidth: layout.maxContentWidth, gap: space.md},
  label: {...type.body, color: colors.textSecondary}, blocks: {gap: space.md},
  block: {backgroundColor: colors.surfaceMuted, borderRadius: radius.sm}, name: {height: type.headline.lineHeight, width: '70%'}, caption: {height: type.caption.lineHeight, width: '40%'},
  hero: {height: type.display.lineHeight + space.xxl * 2, borderRadius: radius.md}, hours: {height: space.xxl * 3, borderRadius: radius.md},
  days: {gap: space.xs}, day: {height: layout.dayRowHeight},
});
