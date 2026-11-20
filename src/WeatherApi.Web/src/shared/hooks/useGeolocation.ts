import { useEffect, useState } from 'react';

export type GeolocationState =
  | { status: 'pending' }
  | { status: 'success'; latitude: number; longitude: number }
  | { status: 'unavailable' };

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({ status: 'pending' });

  useEffect(() => {
    if (!('geolocation' in navigator)) {
      setState({ status: 'unavailable' });
      return;
    }

    let cancelled = false;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (cancelled) {
          return;
        }
        setState({
          status: 'success',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        if (cancelled) {
          return;
        }
        setState({ status: 'unavailable' });
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
