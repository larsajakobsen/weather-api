import { useGeolocation } from '../../../shared/hooks/useGeolocation';
import { useCurrentPrecipitation } from '../api/precipitationApi';
import { PrecipitationMap } from '../components/PrecipitationMap';

export default function RainMapPage() {
  const position = useGeolocation();
  const hasPosition = position.status === 'success';

  const precipitationQuery = useCurrentPrecipitation(
    hasPosition ? position.latitude : 0,
    hasPosition ? position.longitude : 0,
    hasPosition,
  );

  return (
    <section aria-labelledby="rain-map-heading">
      <h1 id="rain-map-heading">Regnkart</h1>

      {position.status === 'pending' && <p role="status">Finner posisjonen din…</p>}

      {position.status === 'unavailable' && (
        <p role="alert">
          Vi kunne ikke bestemme posisjonen din. Slå på posisjonstjenester for å se regnkartet for ditt område.
        </p>
      )}

      {hasPosition && precipitationQuery.isPending && <p role="status">Henter nedbørsdata…</p>}

      {hasPosition && precipitationQuery.isError && <p role="alert">Nedbørsdata er ikke tilgjengelig akkurat nå.</p>}

      {hasPosition && precipitationQuery.isSuccess && precipitationQuery.data.status === 'NoData' && (
        <p role="alert">Det finnes ingen nedbørsdata for ditt område akkurat nå.</p>
      )}

      {hasPosition && precipitationQuery.isSuccess && precipitationQuery.data.status === 'Ok' && (
        <PrecipitationMap
          latitude={position.latitude}
          longitude={position.longitude}
          isRaining={precipitationQuery.data.isRaining ?? false}
          precipitationRateMillimetersPerHour={precipitationQuery.data.precipitationRateMillimetersPerHour ?? 0}
        />
      )}
    </section>
  );
}
