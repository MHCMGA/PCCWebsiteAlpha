import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Buildings, ChartLineUp, Handshake, Target } from '@phosphor-icons/react';
import CTAButton from '../../components/CTAButton/CTAButton';
import ServiceCard from '../../components/ServiceCard/ServiceCard';
import AnimatedSection from '../../components/AnimatedSection/AnimatedSection';
import StatsBar from '../../components/StatsBar/StatsBar';
import styles from './Home.module.css';

const services = [
  {
    icon: <Buildings size={32} weight="duotone" aria-hidden="true" />,
    title: 'Insurance Company Design & Structure',
    body: 'Whether you need a captive to insure your commercially un-insurable risks, are an agency seeking a reinsurance vehicle, or want to build a new commercial carrier from the ground up - we can help.',
  },
  {
    icon: <Handshake size={32} weight="duotone" aria-hidden="true" />,
    title: 'Industry Relationships',
    body: "Does your carrier need additional products or distribution alternatives to your current agency force? Our deep ties to the insurance community and relationships with MGAs, other carriers, and service providers allow us to bring our clients solutions to the problems that we can't solve ourselves.",
  },
  {
    icon: <ChartLineUp size={32} weight="duotone" aria-hidden="true" />,
    title: 'Growth Management',
    body: 'Even for profitable insurance companies, growth can present a host of challenges and complexities. We can assist with reinsurance structure, rating agency relationships, and the regulatory challenges that rapid growth can bring.',
  },
  {
    icon: <Target size={32} weight="duotone" aria-hidden="true" />,
    title: 'Deliberately Not "One-Size Fits All"',
    body: 'Unlike large firms, we are not beholden to outside ownership, Wall Street, or sales targets. We are relationship-builders as much as we are insurance-company-builders. Sometimes the right solution is to do nothing at all - and we are always okay with that.',
  },
];

export default function Home() {
  const heroContentRef = useRef(null);

  // GSAP stagger entrance for hero elements on page load
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-hero-el]', {
        autoAlpha: 0,
        y: 22,
        duration: 0.75,
        stagger: 0.16,
        ease: 'power2.out',
        delay: 0.2,
      });
    }, heroContentRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={`container ${styles.heroContent}`} ref={heroContentRef}>
          <p className={styles.heroEyebrow} data-hero-el="">
            Independent Insurance Consultants
          </p>
          <h1 className={styles.heroHeading} data-hero-el="">
            Palmetto Consulting<br />of Columbia
          </h1>
          <p className={styles.heroSub} data-hero-el="">
            Focused on the intersection of captive insurance<br />
            and the traditional insurance marketplace.
          </p>
          <div data-hero-el="">
            <CTAButton label="Let's Work Together" to="/contact" variant="primary" />
          </div>
        </div>
      </section>

      <StatsBar />

      <section className={`section ${styles.message}`}>
        <div className="container">
          <AnimatedSection>
            <div className={styles.messageInner}>
              <p className={styles.messageText}>
                Palmetto remains uniquely focused on the intersection of captive insurance and the traditional
                insurance marketplace - primarily on those opportunities where our backgrounds can add the
                most value to our clients and partners.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className={`section ${styles.services}`}>
        <div className="container">
          <AnimatedSection>
            <p className={styles.servicesEyebrow}>What We Do</p>
            <h2 className={styles.servicesHeading}>Our Services</h2>
          </AnimatedSection>
          <div className={styles.grid}>
            {services.map((s, i) => (
              <AnimatedSection key={s.title} delay={i * 100}>
                <ServiceCard title={s.title} body={s.body} icon={s.icon} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className="container">
          <AnimatedSection>
            <h2 className={styles.ctaHeading}>
              Your goals are individual.<br />We believe captive insurance should be too.
            </h2>
            <CTAButton label="Take the Next Step" to="/contact" variant="outline" />
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
