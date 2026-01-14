import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FAQ from '../pages/FAQ';

describe('FAQ', () => {
    it('renders FAQ title and sections', () => {
        render(
            <MemoryRouter>
                <FAQ />
            </MemoryRouter>
        );

        expect(screen.getByText('FAQ')).toBeInTheDocument();
        expect(screen.getByText('For Job Seekers')).toBeInTheDocument();
        expect(screen.getByText('For Recruiters')).toBeInTheDocument();
    });
});
