import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './Layout';

describe('Layout', () => {
  it('shows the Regnkart menu item without any access restriction', () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <Layout />,
          children: [{ index: true, element: <p>Hjem</p> }],
        },
      ],
      { initialEntries: ['/'] },
    );

    render(<RouterProvider router={router} />);

    const link = screen.getByRole('link', { name: 'Regnkart' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/regnkart');
  });
});
