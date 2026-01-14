import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Training from '../pages/Training';

describe('Training', () => {
    it('renders training heading and video cards', () => {
        render(
            <MemoryRouter>
                <Training />
            </MemoryRouter>
        );

        expect(screen.getByText('Training')).toBeInTheDocument();
        expect(screen.getByText(/Resume Building/)).toBeInTheDocument();
        expect(screen.getByText(/React JS Full Course/)).toBeInTheDocument();
    });
});
