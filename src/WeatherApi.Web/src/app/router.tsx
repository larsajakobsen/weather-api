import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from './Layout';
import { rainMapRoutes } from '../modules/rain-map/routes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [{ index: true, element: <Navigate to="/regnkart" replace /> }, ...rainMapRoutes],
  },
]);
