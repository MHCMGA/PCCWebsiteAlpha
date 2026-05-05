import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Contact from './Contact';

function renderRoute() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe('Contact page', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true }) })
    );
  });

  it('renders the contact form fields', () => {
    renderRoute();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
  });

  it('posts to /api/contact on submit', async () => {
    renderRoute();
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 't@example.com' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Hello' } });
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith('/api/contact', expect.objectContaining({ method: 'POST' }))
    );
  });
});
