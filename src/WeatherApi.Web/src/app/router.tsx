import { createBrowserRouter, Navigate, type RouteObject } from "react-router-dom";
import { rainMapRoutes } from "../modules/rainmap/routes";
import { AppLayout } from "./AppLayout";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />,
    children: [{ index: true, element: <Navigate to="/regnkart" replace /> }, ...rainMapRoutes],
  },
];

export const router = createBrowserRouter(routes);
