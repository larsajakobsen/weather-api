import { getJson } from "../../../shared/lib/apiClient";
import type { RadarFrame, RainViewerMaps } from "../types";

export const RAINVIEWER_MAPS_URL = "https://api.rainviewer.com/public/weather-maps.json";

export async function fetchLatestRadarFrame(signal?: AbortSignal): Promise<RadarFrame | null> {
  const maps = await getJson<RainViewerMaps>(RAINVIEWER_MAPS_URL, signal);
  const frames = maps.radar?.past ?? [];
  if (frames.length === 0) {
    return null;
  }
  const latest = frames[frames.length - 1];
  return {
    time: latest.time,
    tileUrlTemplate: `${maps.host}${latest.path}/256/{z}/{x}/{y}/2/1_1.png`,
  };
}
