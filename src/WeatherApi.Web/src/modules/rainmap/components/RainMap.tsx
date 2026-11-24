import { buildTileGrid, fillTemplate, lonLatToTile, MAP_ZOOM } from "./tileMath";

const OSM_TILE_TEMPLATE = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

type RainMapProps = {
  latitude: number;
  longitude: number;
  tileUrlTemplate: string;
};

export function RainMap({ latitude, longitude, tileUrlTemplate }: RainMapProps) {
  const center = lonLatToTile(longitude, latitude, MAP_ZOOM);
  const tiles = buildTileGrid(center, MAP_ZOOM);
  const markerLeft = ((1 + center.fracX) / 3) * 100;
  const markerTop = ((1 + center.fracY) / 3) * 100;

  return (
    <figure
      className="rain-map"
      role="img"
      aria-label="Kart over nåværende nedbør rundt din posisjon"
    >
      <div className="rain-map__grid">
        {tiles.map((tile) => (
          <div className="rain-map__cell" key={`${tile.row}-${tile.col}`}>
            <img className="rain-map__base" alt="" src={fillTemplate(OSM_TILE_TEMPLATE, MAP_ZOOM, tile.x, tile.y)} />
            <img
              className="rain-map__radar"
              alt=""
              data-testid="radar-tile"
              src={fillTemplate(tileUrlTemplate, MAP_ZOOM, tile.x, tile.y)}
            />
          </div>
        ))}
        <span className="rain-map__marker" style={{ left: `${markerLeft}%`, top: `${markerTop}%` }} />
      </div>
      <figcaption>Kartdata © OpenStreetMap-bidragsytere · Nedbør: RainViewer</figcaption>
    </figure>
  );
}
