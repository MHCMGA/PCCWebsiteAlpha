import { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { List } from '@phosphor-icons/react';
import Logo from '@/components/Logo/Logo';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const links = [
  { to: '/',        label: 'Home',     end: true },
  { to: '/about',   label: 'About Us' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 h-16 w-full border-b border-[var(--color-border-soft)] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container-x flex h-full items-center justify-between">
        <Link to="/" className="shrink-0" aria-label="Palmetto Consulting of Columbia, Home">
          <Logo size={36} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2" aria-label="Main">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  'relative px-4 py-2 text-sm font-bold uppercase tracking-[0.1em] text-[var(--color-navy)] transition-colors hover:text-[var(--color-teal)]',
                  isActive && 'text-[var(--color-teal)] after:absolute after:left-4 after:right-4 after:bottom-0 after:h-[2px] after:bg-[var(--color-teal)]'
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile sheet */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-sm text-[var(--color-navy)] hover:bg-[var(--color-bg)]"
              aria-label="Open menu"
            >
              <List size={24} weight="bold" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[78vw] max-w-sm bg-white p-0">
            <div className="flex h-16 items-center px-6 border-b border-[var(--color-border-soft)]">
              <Logo size={32} />
            </div>
            <nav className="flex flex-col gap-1 p-4" aria-label="Mobile">
              {links.map((l) => {
                const active =
                  l.end ? location.pathname === l.to : location.pathname.startsWith(l.to);
                return (
                  <SheetClose asChild key={l.to}>
                    <Link
                      to={l.to}
                      className={cn(
                        'rounded-sm px-4 py-3 text-base font-bold uppercase tracking-[0.1em] text-[var(--color-navy)] hover:bg-[var(--color-bg)]',
                        active && 'bg-[var(--color-bg)] text-[var(--color-teal)]'
                      )}
                    >
                      {l.label}
                    </Link>
                  </SheetClose>
                );
              })}
              <SheetClose asChild>
                <Button asChild className="mt-4 w-full">
                  <Link to="/contact">Get in Touch</Link>
                </Button>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
