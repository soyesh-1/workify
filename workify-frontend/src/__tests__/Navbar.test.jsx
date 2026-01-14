import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';

describe('Navbar', () => {
    it('renders brand and navigation links', () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        expect(screen.getByText('Workify')).toBeInTheDocument();
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Browse Jobs')).toBeInTheDocument();
        expect(screen.getByText('Training')).toBeInTheDocument();
        expect(screen.getByText('About')).toBeInTheDocument();
    });
});
