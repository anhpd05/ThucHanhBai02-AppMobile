import React, {type ReactNode} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {colors, dimensions, iconSize, space, type} from '../../theme/tokens';
import {Icon, type IconName} from './Icon';
export function StateView({title, message, icon, danger = false, children}: {title: string; message: string; icon: IconName; danger?: boolean; children: ReactNode}) {
  return <ScrollView contentContainerStyle={styles.scroll}><View style={styles.content}>
    <Icon name={icon} size={iconSize.lg} color={danger ? colors.danger : colors.textSecondary} />
    <Text accessibilityRole="header" maxFontSizeMultiplier={dimensions.fontScale} style={[styles.title, danger && styles.danger]}>{title}</Text>
    <Text maxFontSizeMultiplier={dimensions.fontScale} style={styles.message}>{message}</Text>
    <View style={styles.actions}>{children}</View>
  </View></ScrollView>;
}
const styles = StyleSheet.create({
  scroll: {flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: space.lg},
  content: {width: '100%', maxWidth: dimensions.stateWidth, alignItems: 'center', gap: space.md},
  title: {...type.title, color: colors.text, textAlign: 'center'}, danger: {color: colors.danger},
  message: {...type.body, color: colors.textSecondary, textAlign: 'center'}, actions: {alignSelf: 'stretch', gap: space.sm, marginTop: space.xs},
});
