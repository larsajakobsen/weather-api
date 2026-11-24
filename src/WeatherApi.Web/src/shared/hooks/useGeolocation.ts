import { useEffect, useState } from "react";

export type GeolocationState =
  | { status: "pending" }
  | { status: "success"; latitude: number; longitude: number }
  | { status: "unavailable" };

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({ status: "pending" });

  useEffect(() => {
    let active = true;

    if (!("geolocation" in navigator)) {
      setState({ status: "unavailable" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!active) {
          return;
        }
        setState({
          status: "success",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        if (!active) {
          return;
        }
        setState({ status: "unavailable" });
      },
      { timeout: 10000, maximumAge: 300000 },
    );

    return () => {
      active = false;
    };
  }, []);

  return state;
}
