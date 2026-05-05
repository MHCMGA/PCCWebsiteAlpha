import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import Logo from '@/components/Logo/Logo';
import { Separator } from '@/components/ui/separator';
import { SITE } from '@/lib/site';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[var(--color-navy)] text-white">
      <div className="container-x grid gap-10 py-16 md:grid-cols-3 md:gap-12">
        <div>
          <Link to="/" className="inline-flex" aria-label="Palmetto Consulting of Columbia, Home">
            <Logo size={44} variant="light" />
          </Link>
          <p className="mt-4 text-sm leading-7 text-white/75">
            Independent insurance consultants, based in Columbia, SC since 1998.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-cyan)]">
            Navigation
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="text-white/85 hover:text-[var(--color-cyan)]">Home</Link></li>
            <li><Link to="/about" className="text-white/85 hover:text-[var(--color-cyan)]">About Us</Link></li>
            <li><Link to="/contact" className="text-white/85 hover:text-[var(--color-cyan)]">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-cyan)]">
            Contact
          </h3>
          <address className="not-italic space-y-3 text-sm leading-6 text-white/85">
            <p className="flex items-start gap-2">
              <MapPin size={18} className="mt-0.5 shrink-0 text-[var(--color-cyan)]" aria-hidden="true" />
              <span>1325 Park St. Suite 200<br />Columbia, SC 29201</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone size={18} className="shrink-0 text-[var(--color-cyan)]" aria-hidden="true" />
              <a href={`tel:${SITE.phoneE164}`} className="font-bold text-white hover:text-[var(--color-cyan)]">
                803-904-8461
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Mail size={18} className="shrink-0 text-[var(--color-cyan)]" aria-hidden="true" />
              <a href="mailto:info@palmettoconsulting.us" className="text-white/90 hover:text-[var(--color-cyan)]">
                info@palmettoconsulting.us
              </a>
            </p>
          </address>
        </div>
      </div>

      <Separator className="bg-white/10" />

      <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/60 md:flex-row">
        <p>&copy; {year} Palmetto Consulting of Columbia, LLC. All rights reserved.</p>
        <p>Independent Insurance Consultants in Columbia, SC</p>
      </div>
    </footer>
  );
}
