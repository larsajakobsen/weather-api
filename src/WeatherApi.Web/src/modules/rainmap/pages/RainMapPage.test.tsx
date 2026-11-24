import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { routes } from "../../../app/router";

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

function mockGeolocationSuccess() {
  Object.defineProperty(navigator, "geolocation", {
    value: {
      getCurrentPosition: (success: PositionCallback) =>
        success({ coords: { latitude: 59.91, longitude: 10.75 } } as GeolocationPosition),
    },
    configurable: true,
  });
}

function mockGeolocationError() {
  Object.defineProperty(navigator, "geolocation", {
    value: {
      getCurrentPosition: (_success: PositionCallback, error: PositionErrorCallback) =>
        error({ code: 1, message: "denied" } as GeolocationPositionError),
    },
    configurable: true,
  });
}

function mockGeolocationNeverResolves() {
  Object.defineProperty(navigator, "geolocation", {
    value: {
      getCurrentPosition: () => {
        // Never calls back, simulating a pending prompt.
      },
    },
    configurable: true,
  });
}

function renderRainMapPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const router = createMemoryRouter(routes, { initialEntries: ["/regnkart"] });
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  // @ts-expect-error cleanup of a test-only property
  delete navigator.geolocation;
});

describe("RainMapPage", () => {
  it("shows a map centered on the user with current precipitation", async () => {
    mockGeolocationSuccess();
    mockFetchJson(fixture);

    renderRainMapPage();

    expect(await screen.findByRole("heading", { name: "Regnkart" })).toBeInTheDocument();
    const map = await screen.findByRole("img", { name: /nåværende nedbør/ });
    const radarTiles = within(map).getAllByTestId("radar-tile");
    expect(radarTiles).toHaveLength(9);
    expect(radarTiles.some((tile) => tile.getAttribute("src")?.includes("/v2/radar/b/256/7/67/37/"))).toBe(true);
  });

  it("shows a message instead of a map when the position is unavailable", async () => {
    mockGeolocationError();
    mockFetchJson(fixture);

    renderRainMapPage();

    expect(await screen.findByText("Vi fant ikke posisjonen din")).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: /nedbør/ })).not.toBeInTheDocument();
  });

  it("shows a message when there is no precipitation data", async () => {
    mockGeolocationSuccess();
    mockFetchJson({ host: "https://tilecache.rainviewer.com", radar: { past: [] } });

    renderRainMapPage();

    expect(await screen.findByText("Nedbørsdata er ikke tilgjengelig akkurat nå")).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: /nedbør/ })).not.toBeInTheDocument();
  });

  it("shows a message when the precipitation request fails", async () => {
    mockGeolocationSuccess();
    mockFetchJson({}, 500);

    renderRainMapPage();

    expect(await screen.findByText("Nedbørsdata er ikke tilgjengelig akkurat nå")).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: /nedbør/ })).not.toBeInTheDocument();
  });

  it("shows a loading state while waiting for the position", async () => {
    mockGeolocationNeverResolves();
    mockFetchJson(fixture);

    renderRainMapPage();

    expect(await screen.findByLabelText("Laster")).toBeInTheDocument();
  });
});
