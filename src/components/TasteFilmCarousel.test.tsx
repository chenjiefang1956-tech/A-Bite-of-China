import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TasteFilmCarousel } from './TasteFilmCarousel';
import { getDefaultProvince } from '../domain/provinces';

describe('TasteFilmCarousel', () => {
  it('opens food details from a pointer tap on a card image', () => {
    const onSelectFood = vi.fn();
    render(<TasteFilmCarousel province={getDefaultProvince()} onSelectFood={onSelectFood} />);

    const card = screen.getAllByRole('button', { name: /麻婆豆腐/ })[0];
    fireEvent.pointerDown(card, { clientX: 100, pointerId: 1 });
    fireEvent.pointerUp(card, { clientX: 100, pointerId: 1 });

    expect(onSelectFood).toHaveBeenCalledWith(expect.objectContaining({ name: '麻婆豆腐' }));
  });
});
