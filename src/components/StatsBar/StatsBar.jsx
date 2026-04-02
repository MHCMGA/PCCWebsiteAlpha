import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './StatsBar.module.css';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 50, suffix: '+', label: 'Years of Industry Experience' },
  { value: 3,  suffix: '',  label: 'Expert Consultants' },
  { value: 20, suffix: '+', label: 'Years in the Captive Market' },
];

function StatItem({ value, suffix, label, index }) {
  const numRef  = useRef(null);
  const itemRef = useRef(null);

  useEffect(() => {
    const numEl  = numRef.current;
    const itemEl = itemRef.current;
    if (!numEl || !itemEl) return;

    const counter = { val: 0 };

    const ctx = gsap.context(() => {
      // Slide the whole stat card up and fade in, staggered by index
      gsap.from(itemEl, {
        autoAlpha: 0,
        y: 24,
        duration: 0.6,
        delay: 0.1 + index * 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: itemEl,
          start: 'top 88%',
          once: true,
        },
      });

      // Count the number up once in view
      gsap.to(counter, {
        val: value,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: numEl,
          start: 'top 88%',
          once: true,
        },
        onUpdate: () => {
          numEl.textContent = Math.round(counter.val) + suffix;
        },
      });
    });

    return () => ctx.revert();
  }, [value, suffix, index]);

  return (
    <div className={styles.stat} ref={itemRef}>
      <span className={styles.statNum} ref={numRef} aria-live="polite">
        0{suffix}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

export default function StatsBar() {
  return (
    <div className={styles.bar} aria-label="Key statistics">
      <div className={`container ${styles.inner}`}>
        {stats.map((s, i) => (
          <StatItem
            key={s.label}
            value={s.value}
            suffix={s.suffix}
            label={s.label}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
