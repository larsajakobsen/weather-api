import type { UseQueryResult } from "@tanstack/react-query";
import type { GeolocationState } from "../../../shared/hooks/useGeolocation";
import { useGeolocation } from "../../../shared/hooks/useGeolocation";
import { useLatestRadarFrame } from "../api/useLatestRadarFrame";
import { Alert } from "../../../shared/components/ui/Alert";
import { PageHeader } from "../../../shared/components/ui/PageHeader";
import { Skeleton } from "../../../shared/components/ui/Skeleton";
import type { RadarFrame } from "../types";
import { RainMap } from "../components/RainMap";

function RainMapContent({
  geolocation,
  radarFrame,
}: {
  geolocation: GeolocationState;
  radarFrame: UseQueryResult<RadarFrame | null>;
}) {
  if (geolocation.status === "pending" || radarFrame.isPending) {
    return (
      <>
        <p>Laster regnkart …</p>
        <Skeleton />
      </>
    );
  }

  if (geolocation.status === "unavailable") {
    return (
      <Alert variant="warning" title="Vi fant ikke posisjonen din">
        Gi nettleseren tilgang til posisjonen din og last inn siden på nytt for å se regnkartet for
        området ditt.
      </Alert>
    );
  }

  if (radarFrame.isError || radarFrame.data === null) {
    return (
      <Alert variant="info" title="Nedbørsdata er ikke tilgjengelig akkurat nå">
        Prøv igjen om litt.
      </Alert>
    );
  }

  return (
    <>
      <p>Nedbør akkurat nå rundt der du er. Blått betyr regn.</p>
      <RainMap
        latitude={geolocation.latitude}
        longitude={geolocation.longitude}
        tileUrlTemplate={radarFrame.data.tileUrlTemplate}
      />
      <p className="rain-map__updated-at">
        Oppdatert kl.{" "}
        {new Date(radarFrame.data.time * 1000).toLocaleTimeString("nb-NO", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </>
  );
}

export default function RainMapPage() {
  const geolocation = useGeolocation();
  const radarFrame = useLatestRadarFrame();

  return (
    <>
      <PageHeader title="Regnkart" />
      <RainMapContent geolocation={geolocation} radarFrame={radarFrame} />
    </>
  );
}
