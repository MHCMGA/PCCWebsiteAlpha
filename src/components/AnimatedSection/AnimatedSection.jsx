import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export default function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    // Safety net: always reveal after 700ms regardless
    const t = setTimeout(() => setShow(true), 700);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out will-change-transform',
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
