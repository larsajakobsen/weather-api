import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RainMapPage from './RainMapPage';
import { useGeolocation } from '../../../shared/hooks/useGeolocation';
import { useCurrentPrecipitation } from '../api/precipitationApi';

vi.mock('../../../shared/hooks/useGeolocation');
vi.mock('../api/precipitationApi');

const mockedUseGeolocation = vi.mocked(useGeolocation);
const mockedUseCurrentPrecipitation = vi.mocked(useCurrentPrecipitation);

describe('RainMapPage', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('shows a map centred on the user with current precipitation when data is available', () => {
    mockedUseGeolocation.mockReturnValue({ status: 'success', latitude: 59.9139, longitude: 10.7522 });
    mockedUseCurrentPrecipitation.mockReturnValue({
      isPending: false,
      isError: false,
      isSuccess: true,
      data: {
        status: 'Ok',
        latitude: 59.9139,
        longitude: 10.7522,
        precipitationRateMillimetersPerHour: 1.2,
        isRaining: true,
        observedAt: '2026-11-20T12:00:00Z',
      },
    } as unknown as ReturnType<typeof useCurrentPrecipitation>);

    render(<RainMapPage />);

    expect(screen.getByRole('img', { name: /Det regner nå/i })).toBeInTheDocument();
  });

  it('shows a loading indicator while the position is being determined', () => {
    mockedUseGeolocation.mockReturnValue({ status: 'pending' });

    render(<RainMapPage />);

    expect(screen.getByRole('status')).toHaveTextContent(/finner posisjonen din/i);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('shows a clear message instead of a map when the position is unavailable', () => {
    mockedUseGeolocation.mockReturnValue({ status: 'unavailable' });

    render(<RainMapPage />);

    expect(screen.getByRole('alert')).toHaveTextContent(/kunne ikke bestemme posisjonen din/i);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('shows a loading indicator while precipitation data is being fetched', () => {
    mockedUseGeolocation.mockReturnValue({ status: 'success', latitude: 59.9139, longitude: 10.7522 });
    mockedUseCurrentPrecipitation.mockReturnValue({
      isPending: true,
      isError: false,
      isSuccess: false,
      data: undefined,
    } as unknown as ReturnType<typeof useCurrentPrecipitation>);

    render(<RainMapPage />);

    expect(screen.getByRole('status')).toHaveTextContent(/henter nedbørsdata/i);
  });

  it('shows a message when precipitation data cannot be loaded', () => {
    mockedUseGeolocation.mockReturnValue({ status: 'success', latitude: 59.9139, longitude: 10.7522 });
    mockedUseCurrentPrecipitation.mockReturnValue({
      isPending: false,
      isError: true,
      isSuccess: false,
      data: undefined,
    } as unknown as ReturnType<typeof useCurrentPrecipitation>);

    render(<RainMapPage />);

    expect(screen.getByRole('alert')).toHaveTextContent(/ikke tilgjengelig akkurat nå/i);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('shows a message instead of a map when no precipitation data exists for the area', () => {
    mockedUseGeolocation.mockReturnValue({ status: 'success', latitude: 59.9139, longitude: 10.7522 });
    mockedUseCurrentPrecipitation.mockReturnValue({
      isPending: false,
      isError: false,
      isSuccess: true,
      data: {
        status: 'NoData',
        latitude: 59.9139,
        longitude: 10.7522,
        precipitationRateMillimetersPerHour: null,
        isRaining: null,
        observedAt: null,
      },
    } as unknown as ReturnType<typeof useCurrentPrecipitation>);

    render(<RainMapPage />);

    expect(screen.getByRole('alert')).toHaveTextContent(/ingen nedbørsdata/i);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
