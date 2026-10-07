import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Linking, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { DEFAULT_COORDS, REQUEST_TIMEOUT_MS } from '../constants';
import type { Coordinates } from '../types/weather';

export type LocationState = {
  status: 'idle' | 'requesting' | 'granted' | 'denied' | 'blocked' | 'error';
  coords: Coordinates | null;
  request: () => void;
  useDefault: () => void;
  openSettings: () => void;
};

type LocationSnapshot = Pick<LocationState, 'status' | 'coords'>;

const finePermission = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
const coarsePermission = PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION;

export function useLocation(): LocationState {
  const [state, setState] = useState<LocationSnapshot>({ status: 'idle', coords: null });
  const mounted = useRef(false);
  const operation = useRef(0);
  const inFlight = useRef(false);
  const blocked = useRef(false);
  const source = useRef<Coordinates['source']>('gps');
  const waitingForSettings = useRef(false);
  const gpsTimeout = useRef<number | undefined>(undefined);
  const statusRef = useRef(state.status);
  statusRef.current = state.status;

  const acquireLocation = useCallback((allowPrompt: boolean) => {
    if (!mounted.current || inFlight.current) {
      return;
    }
    const id = ++operation.current;
    inFlight.current = true;
    setState({ status: 'requesting', coords: null });
    const isCurrent = () => mounted.current && operation.current === id;
    const finish = (next: LocationSnapshot) => {
      if (!isCurrent()) {
        return;
      }
      operation.current += 1;
      inFlight.current = false;
      clearTimeout(gpsTimeout.current);
      gpsTimeout.current = undefined;
      setState(next);
    };

    const locate = async (): Promise<void> => {
      const [fineGranted, coarseGranted] = await Promise.all([
        PermissionsAndroid.check(finePermission),
        PermissionsAndroid.check(coarsePermission),
      ]);
      if (!isCurrent()) {
        return;
      }
      let granted = fineGranted || coarseGranted;
      if (!granted && allowPrompt && !blocked.current) {
        const result = await PermissionsAndroid.requestMultiple([
          finePermission,
          coarsePermission,
        ]);
        if (!isCurrent()) {
          return;
        }
        granted = result[finePermission] === PermissionsAndroid.RESULTS.GRANTED ||
          result[coarsePermission] === PermissionsAndroid.RESULTS.GRANTED;
        blocked.current = !granted && (
          result[finePermission] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
          result[coarsePermission] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
        );
      }
      if (!granted) {
        finish({ status: blocked.current ? 'blocked' : 'denied', coords: null });
        return;
      }
      blocked.current = false;
      Geolocation.setRNConfiguration({ skipPermissionRequests: true });
      gpsTimeout.current = setTimeout(() => {
        finish({ status: 'error', coords: null });
      }, REQUEST_TIMEOUT_MS);
      Geolocation.getCurrentPosition(
        position => {
          if (!isCurrent()) {
            return;
          }
          const { latitude, longitude } = position.coords;
          if (
            !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
            !Number.isFinite(longitude) || longitude < -180 || longitude > 180
          ) {
            finish({ status: 'error', coords: null });
            return;
          }
          finish({ status: 'granted', coords: { latitude, longitude, source: 'gps' } });
        },
        error => {
          finish({ status: error.code === 1 ? 'denied' : 'error', coords: null });
        },
        {
          enableHighAccuracy: false,
          timeout: REQUEST_TIMEOUT_MS,
          maximumAge: 10 * 60 * 1000,
        },
      );
    };

    locate().catch(() => {
      finish({ status: 'error', coords: null });
    });
  }, []);

  const request = useCallback(() => {
    source.current = 'gps';
    waitingForSettings.current = false;
    acquireLocation(true);
  }, [acquireLocation]);

  const useDefault = useCallback(() => {
    if (!mounted.current) {
      return;
    }
    operation.current += 1;
    inFlight.current = false;
    source.current = 'default';
    waitingForSettings.current = false;
    clearTimeout(gpsTimeout.current);
    gpsTimeout.current = undefined;
    setState({ status: 'granted', coords: DEFAULT_COORDS });
  }, []);

  const openSettings = useCallback(() => {
    if (!mounted.current) {
      return;
    }
    const id = ++operation.current;
    inFlight.current = false;
    clearTimeout(gpsTimeout.current);
    gpsTimeout.current = undefined;
    waitingForSettings.current = true;
    Linking.openSettings().catch(() => {
      if (!mounted.current || operation.current !== id) {
        return;
      }
      waitingForSettings.current = false;
      setState({ status: 'error', coords: null });
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    let previousState = AppState.currentState;
    const subscription = AppState.addEventListener('change', nextState => {
      const returning = nextState === 'active' && previousState !== 'active';
      previousState = nextState;
      if (!returning) {
        return;
      }
      if (waitingForSettings.current) {
        waitingForSettings.current = false;
        source.current = 'gps';
      }
      // Chỉ kiểm tra lại quyền khi trước đó bị từ chối hoặc lỗi GPS. Đã có vị trí thì
      // giữ nguyên toạ độ và không mở lại hộp thoại xin quyền.
      const recheck = statusRef.current === 'denied' ||
        statusRef.current === 'blocked' || statusRef.current === 'error';
      if (source.current === 'gps' && recheck) {
        acquireLocation(false);
      }
    });
    request();
    return () => {
      mounted.current = false;
      operation.current += 1;
      inFlight.current = false;
      clearTimeout(gpsTimeout.current);
      gpsTimeout.current = undefined;
      subscription.remove();
    };
  }, [acquireLocation, request]);

  return { ...state, request, useDefault, openSettings };
}
