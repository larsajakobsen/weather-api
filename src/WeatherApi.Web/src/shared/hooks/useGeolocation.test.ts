import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGeolocation } from './useGeolocation';

function stubGeolocation(geolocation: Partial<Geolocation>) {
  Object.defineProperty(window.navigator, 'geolocation', {
    value: geolocation,
    configurable: true,
  });
}

describe('useGeolocation', () => {
  afterEach(() => {
    delete (window.navigator as unknown as { geolocation?: unknown }).geolocation;
  });

  it('returns the user position when geolocation succeeds', async () => {
    stubGeolocation({
      getCurrentPosition: vi.fn((success) => {
        success({
          coords: { latitude: 59.9139, longitude: 10.7522 },
        } as GeolocationPosition);
      }),
    });

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => expect(result.current.status).toBe('success'));
    expect(result.current).toEqual({ status: 'success', latitude: 59.9139, longitude: 10.7522 });
  });

  it('returns unavailable when the user denies the permission', async () => {
    stubGeolocation({
      getCurrentPosition: vi.fn((_success, error) => {
        error?.({ code: 1, message: 'User denied Geolocation' } as GeolocationPositionError);
      }),
    });

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => expect(result.current.status).toBe('unavailable'));
  });

  it('returns unavailable when geolocation is not supported by the browser', async () => {
    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => expect(result.current.status).toBe('unavailable'));
  });
});
