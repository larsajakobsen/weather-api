export const MAP_ZOOM = 7;

export type TileCoordinate = {
  x: number;
  y: number;
  fracX: number;
  fracY: number;
};

export type GridTile = {
  x: number;
  y: number;
  row: number;
  col: number;
};

export function lonLatToTile(lon: number, lat: number, z: number): TileCoordinate {
  const n = 2 ** z;
  const latRad = (lat * Math.PI) / 180;
  const fx = ((lon + 180) / 360) * n;
  const fy = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;
  const x = Math.floor(fx);
  const y = Math.floor(fy);
  return { x, y, fracX: fx - x, fracY: fy - y };
}

export function buildTileGrid(center: { x: number; y: number }, z: number): GridTile[] {
  const n = 2 ** z;
  const tiles: GridTile[] = [];
  for (let row = 0; row < 3; row += 1) {
    const y = center.y + (row - 1);
    if (y < 0 || y > n - 1) {
      continue;
    }
    for (let col = 0; col < 3; col += 1) {
      const rawX = center.x + (col - 1);
      const x = ((rawX % n) + n) % n;
      tiles.push({ x, y, row, col });
    }
  }
  return tiles;
}

export function fillTemplate(template: string, z: number, x: number, y: number): string {
  return template.replace("{z}", String(z)).replace("{x}", String(x)).replace("{y}", String(y));
}
