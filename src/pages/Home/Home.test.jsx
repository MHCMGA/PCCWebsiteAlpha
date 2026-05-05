import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './Home';

function renderRoute() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe('Home page', () => {
  it('renders the hero heading', () => {
    renderRoute();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Palmetto Consulting/i);
  });

  it('renders all four service cards', () => {
    renderRoute();
    expect(screen.getByText(/Insurance Company Design & Structure/i)).toBeInTheDocument();
    expect(screen.getByText(/Industry Relationships/i)).toBeInTheDocument();
    expect(screen.getByText(/Growth Management/i)).toBeInTheDocument();
    expect(screen.getByText(/One-Size Fits All/i)).toBeInTheDocument();
  });

  it('exposes the contact CTA links', () => {
    renderRoute();
    const ctas = screen.getAllByRole('link').filter((a) => a.getAttribute('href') === '/contact');
    expect(ctas.length).toBeGreaterThanOrEqual(2);
  });
});
