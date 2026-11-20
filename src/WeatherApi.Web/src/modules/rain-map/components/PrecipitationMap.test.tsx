import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PrecipitationMap } from './PrecipitationMap';

describe('PrecipitationMap', () => {
  it('renders a 3x3 grid of map tiles centred on the given coordinates', () => {
    const { container } = render(
      <PrecipitationMap
        latitude={59.9139}
        longitude={10.7522}
        isRaining
        precipitationRateMillimetersPerHour={1.2}
      />,
    );

    expect(container.querySelectorAll('img')).toHaveLength(9);
  });

  it('marks current precipitation as raining in the accessible label', () => {
    render(
      <PrecipitationMap
        latitude={59.9139}
        longitude={10.7522}
        isRaining
        precipitationRateMillimetersPerHour={1.2}
      />,
    );

    expect(screen.getByRole('img', { name: /Det regner nå/i })).toBeInTheDocument();
  });

  it('marks current precipitation as dry in the accessible label', () => {
    render(
      <PrecipitationMap
        latitude={59.9139}
        longitude={10.7522}
        isRaining={false}
        precipitationRateMillimetersPerHour={0}
      />,
    );

    expect(screen.getByRole('img', { name: /Det regner ikke akkurat nå/i })).toBeInTheDocument();
  });
});
