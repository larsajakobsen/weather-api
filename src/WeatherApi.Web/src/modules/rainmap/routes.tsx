import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const RainMapPage = lazy(() => import("./pages/RainMapPage"));

export const rainMapRoutes: RouteObject[] = [{ path: "regnkart", element: <RainMapPage /> }];
