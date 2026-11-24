import { useQuery } from "@tanstack/react-query";
import { fetchLatestRadarFrame } from "./rainMapApi";

export function useLatestRadarFrame() {
  return useQuery({
    queryKey: ["rainmap", "latest-frame"],
    queryFn: ({ signal }) => fetchLatestRadarFrame(signal),
    staleTime: 5 * 60_000,
  });
}
