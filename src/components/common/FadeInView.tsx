import React, {type ReactNode, useEffect, useRef} from 'react';
import {Animated, Easing} from 'react-native';
import {motion, space} from '../../theme/tokens';
import {useReducedMotion} from './useReducedMotion';
export function FadeInView({children}: {children: ReactNode}) {
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(1)).current;
  const entered = useRef(false);
  useEffect(() => {
    if (reduced) { progress.stopAnimation(); progress.setValue(1); return; }
    if (entered.current) { return; }
    entered.current = true;
    progress.setValue(0);
    const animation = Animated.timing(progress, {toValue: 1, duration: motion.base, easing: Easing.out(Easing.cubic), useNativeDriver: true});
    animation.start();
    return () => animation.stop();
  }, [progress, reduced]);
  return <Animated.View style={{opacity: progress, transform: [{translateY: progress.interpolate({inputRange: [0, 1], outputRange: [space.xs, 0]})}]}}>{children}</Animated.View>;
}
