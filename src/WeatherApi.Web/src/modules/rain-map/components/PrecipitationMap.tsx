const TILE_SIZE = 256;
const ZOOM = 12;
const GRID_SIZE = 3;

interface PrecipitationMapProps {
  latitude: number;
  longitude: number;
  isRaining: boolean;
  precipitationRateMillimetersPerHour: number;
}

function longitudeToTileX(longitude: number, zoom: number): number {
  return ((longitude + 180) / 360) * 2 ** zoom;
}

function latitudeToTileY(latitude: number, zoom: number): number {
  const latitudeRadians = (latitude * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(latitudeRadians) + 1 / Math.cos(latitudeRadians)) / Math.PI) / 2) * 2 ** zoom;
}

export function PrecipitationMap({
  latitude,
  longitude,
  isRaining,
  precipitationRateMillimetersPerHour,
}: PrecipitationMapProps) {
  const fractionalX = longitudeToTileX(longitude, ZOOM);
  const fractionalY = latitudeToTileY(latitude, ZOOM);
  const topLeftTileX = Math.floor(fractionalX) - 1;
  const topLeftTileY = Math.floor(fractionalY) - 1;

  const tiles = [];
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      tiles.push({ tileX: topLeftTileX + col, tileY: topLeftTileY + row, row, col });
    }
  }

  const markerLeft = (fractionalX - topLeftTileX) * TILE_SIZE;
  const markerTop = (fractionalY - topLeftTileY) * TILE_SIZE;

  const markerLabel = isRaining
    ? `Det regner nå, ${precipitationRateMillimetersPerHour} mm/t`
    : 'Det regner ikke akkurat nå';

  return (
    <div
      className="precipitation-map"
      role="img"
      aria-label={`Kart over nedbør for ditt område. ${markerLabel}.`}
      style={{
        position: 'relative',
        width: GRID_SIZE * TILE_SIZE,
        height: GRID_SIZE * TILE_SIZE,
        overflow: 'hidden',
      }}
    >
      {tiles.map(({ tileX, tileY, row, col }) => (
        <img
          key={`${tileX}-${tileY}`}
          src={`https://tile.openstreetmap.org/${ZOOM}/${tileX}/${tileY}.png`}
          alt=""
          width={TILE_SIZE}
          height={TILE_SIZE}
          style={{ position: 'absolute', left: col * TILE_SIZE, top: row * TILE_SIZE }}
        />
      ))}
      <span
        className={`precipitation-marker ${isRaining ? 'precipitation-marker--rain' : 'precipitation-marker--dry'}`}
        style={{
          position: 'absolute',
          left: markerLeft,
          top: markerTop,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
}
