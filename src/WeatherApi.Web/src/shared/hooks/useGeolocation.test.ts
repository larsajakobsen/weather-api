import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useGeolocation } from "./useGeolocation";

afterEach(() => {
  // @ts-expect-error cleanup of a test-only property
  delete navigator.geolocation;
});

describe("useGeolocation", () => {
  it("resolves to success with the current coordinates", async () => {
    Object.defineProperty(navigator, "geolocation", {
      value: {
        getCurrentPosition: (success: PositionCallback) =>
          success({ coords: { latitude: 59.91, longitude: 10.75 } } as GeolocationPosition),
      },
      configurable: true,
    });

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(result.current).toEqual({ status: "success", latitude: 59.91, longitude: 10.75 });
  });

  it("resolves to unavailable when the browser denies the request", async () => {
    Object.defineProperty(navigator, "geolocation", {
      value: {
        getCurrentPosition: (_success: PositionCallback, error: PositionErrorCallback) =>
          error({ code: 1, message: "denied" } as GeolocationPositionError),
      },
      configurable: true,
    });

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => expect(result.current.status).toBe("unavailable"));
  });

  it("resolves to unavailable when geolocation is not supported", async () => {
    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => expect(result.current.status).toBe("unavailable"));
  });
});
