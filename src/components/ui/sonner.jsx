import { Toaster as Sonner } from 'sonner';

export const Toaster = (props) => (
  <Sonner
    theme="light"
    position="top-right"
    richColors
    toastOptions={{
      classNames: {
        toast: 'border border-[var(--color-border-soft)] bg-white text-[var(--color-navy)]',
      },
    }}
    {...props}
  />
);
