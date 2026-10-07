import {useEffect, useState} from 'react';
import {AccessibilityInfo} from 'react-native';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    let active = true;
    let receivedEvent = false;
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', value => {
      receivedEvent = true;
      if (active) { setReduced(value); }
    });
    AccessibilityInfo.isReduceMotionEnabled().then(value => {
      if (active && !receivedEvent) { setReduced(value); }
    }).catch(() => { });
    return () => { active = false; subscription.remove(); };
  }, []);
  return reduced;
}
