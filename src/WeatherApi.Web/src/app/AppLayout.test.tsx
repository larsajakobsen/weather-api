import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { routes } from "./router";

const fixture = {
  host: "https://tilecache.rainviewer.com",
  radar: {
    past: [{ time: 1700000600, path: "/v2/radar/b" }],
  },
};

afterEach(() => {
  vi.unstubAllGlobals();
  // @ts-expect-error cleanup of a test-only property
  delete navigator.geolocation;
});

describe("AppLayout", () => {
  it("shows the Regnkart menu item with no access restrictions", async () => {
    Object.defineProperty(navigator, "geolocation", {
      value: {
        getCurrentPosition: (success: PositionCallback) =>
          success({ coords: { latitude: 59.91, longitude: 10.75 } } as GeolocationPosition),
      },
      configurable: true,
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(fixture),
      }),
    );

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );

    const nav = screen.getByRole("navigation", { name: "Hovedmeny" });
    const link = within(nav).getByRole("link", { name: "Regnkart" });
    expect(link).toHaveAttribute("href", "/regnkart");

    expect(await screen.findByRole("heading", { name: "Regnkart" })).toBeInTheDocument();
  });
});
