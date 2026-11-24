import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "../../../shared/lib/apiClient";
import { fetchLatestRadarFrame } from "./rainMapApi";

const fixture = {
  host: "https://tilecache.rainviewer.com",
  radar: {
    past: [
      { time: 1700000000, path: "/v2/radar/a" },
      { time: 1700000600, path: "/v2/radar/b" },
    ],
  },
};

function mockFetchJson(body: unknown, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(body),
    }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchLatestRadarFrame", () => {
  it("returns the latest radar frame with a tile url template", async () => {
    mockFetchJson(fixture);
    const frame = await fetchLatestRadarFrame();
    expect(frame).toEqual({
      time: 1700000600,
      tileUrlTemplate: "https://tilecache.rainviewer.com/v2/radar/b/256/{z}/{x}/{y}/2/1_1.png",
    });
  });

  it("returns null when there are no past frames", async () => {
    mockFetchJson({ host: "https://tilecache.rainviewer.com", radar: { past: [] } });
    const frame = await fetchLatestRadarFrame();
    expect(frame).toBeNull();
  });

  it("throws an ApiError when the request fails", async () => {
    mockFetchJson({}, 500);
    await expect(fetchLatestRadarFrame()).rejects.toBeInstanceOf(ApiError);
  });
});
