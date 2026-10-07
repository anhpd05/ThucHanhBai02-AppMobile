import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {colors, dimensions, radius, space, touch, type} from '../../theme/tokens';
export function Button({title, onPress, variant = 'primary', disabled = false}: {title: string; onPress: () => void; variant?: 'primary' | 'secondary'; disabled?: boolean}) {
  return <Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{disabled}} disabled={disabled} onPress={onPress} android_ripple={{color: colors.surfaceMuted}} style={({pressed}) => [styles.button, variant === 'primary' ? styles.primary : styles.secondary, pressed && styles.pressed, disabled && styles.disabled]}>
    {({pressed}) => <Text maxFontSizeMultiplier={dimensions.fontScale} style={[styles.label, variant === 'primary' && !pressed && !disabled ? styles.primaryText : styles.secondaryText]}>{title}</Text>}
  </Pressable>;
}
const styles = StyleSheet.create({
  button: {minHeight: touch.min, paddingHorizontal: space.md, paddingVertical: space.sm, borderRadius: radius.sm, borderWidth: dimensions.border, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'},
  primary: {backgroundColor: colors.accent, borderColor: colors.accent}, secondary: {backgroundColor: colors.surface, borderColor: colors.border},
  pressed: {backgroundColor: colors.surfaceMuted}, disabled: {backgroundColor: colors.surfaceMuted, borderColor: colors.border},
  label: {...type.bodyStrong, textAlign: 'center'}, primaryText: {color: colors.onAccent}, secondaryText: {color: colors.accent},
});
