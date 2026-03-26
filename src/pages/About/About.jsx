import { Briefcase, ClipboardText } from '@phosphor-icons/react';
import AnimatedSection from '../../components/AnimatedSection/AnimatedSection';
import CTAButton from '../../components/CTAButton/CTAButton';
import styles from './About.module.css';

const team = [
  {
    name: 'John A. Weitzel',
    role: 'Founder & Principal',
    bio: 'John founded Palmetto Consulting of Columbia in 1998 following a nearly 50-year career in the insurance industry, primarily serving as Chief Financial Officer. His deep expertise in both the captive and traditional insurance marketplace forms the cornerstone of the firm.',
  },
  {
    name: 'Matthew A. Holycross, CPA',
    role: 'Member',
    bio: "Matthew joined Palmetto in 2015, bringing a background in traditional Property & Casualty carrier management as well as extensive experience in the Alternative Risk and Captive market. His perspectives have expanded the firm's capabilities and value to clients.",
  },
  {
    name: 'Michael D. Hunter, CPA',
    role: 'Member',
    bio: "Michael joined Palmetto in 2020. He brings significant experience as an external audit manager for a national accounting firm and as the CFO of multiple AM-Best Rated Property and Casualty insurers, further strengthening the team's financial leadership.",
  },
];

export default function About() {
  return (
    <>
      <section className={styles.banner}>
        <div className={styles.bannerOverlay} />
        <div className={`container ${styles.bannerContent}`}>
          <AnimatedSection>
            <p className={styles.bannerEyebrow}>Our Story</p>
            <h1 className={styles.bannerHeading}>About Us</h1>
          </AnimatedSection>
        </div>
      </section>

      <section className={`section ${styles.history}`}>
        <div className="container">
          <div className={styles.twoCol}>
            <AnimatedSection className={styles.historyLeft}>
              <p className={styles.eyebrow}>Founded 1998</p>
              <h2 className={styles.sectionHeading}>Who We Are</h2>
            </AnimatedSection>
            <AnimatedSection className={styles.historyRight} delay={100}>
              <p>
                Palmetto Consulting of Columbia, LLC was founded in 1998 by John A. Weitzel, an insurance
                executive whose career spanned nearly 50 years working for, or consulting with, insurance
                companies - primarily as a Chief Financial Officer.
              </p>
              <p>
                Since 2003, Palmetto&apos;s services have been focused almost exclusively on the captive insurance
                industry. Clients have included prospective and established captive insurance companies and
                captive managers.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className={`section ${styles.whatWeDo}`}>
        <div className="container">
          <AnimatedSection>
            <p className={styles.eyebrow}>Our Expertise</p>
            <h2 className={styles.sectionHeading}>What We Do</h2>
          </AnimatedSection>
          <div className={styles.doGrid}>
            <AnimatedSection delay={100}>
              <div className={styles.doCard}>
                <div className={styles.doIcon}>
                  <ClipboardText size={32} weight="duotone" aria-hidden="true" />
                </div>
                <h3>Controllership Services</h3>
                <p>
                  Palmetto fills a void in the marketplace based on the premise that many captive managers
                  provide adequate service fulfilling the Controllership function - including general ledger
                  maintenance, cash receipt and disbursement operations, financial statement presentation,
                  and regulatory reporting.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <div className={styles.doCard}>
                <div className={styles.doIcon}>
                  <Briefcase size={32} weight="duotone" aria-hidden="true" />
                </div>
                <h3>Full CFO Services</h3>
                <p>
                  Relatively few captive managers provide the full menu of Chief Financial Officer functions.
                  Palmetto specializes in Treasury, Investment monitoring, Tax planning, Budget analysis,
                  Reinsurance negotiations, Rating agency relationships, and Internal audit - delivering a
                  proactive approach that advances clients from compliance to best practices.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className={`section ${styles.approach}`}>
        <div className="container">
          <AnimatedSection>
            <div className={styles.approachInner}>
              <p className={styles.eyebrowLight}>How We Work</p>
              <h2 className={styles.approachHeading}>From Compliance to Best Practices</h2>
              <p className={styles.approachText}>
                Palmetto assists clients in assembling teams of top-notch insurance management, underwriting,
                claims, investment management, actuary, audit, and legal experts during the formation stage
                of a new captive. We are uniquely equipped to serve as a client&apos;s captive manager or guide
                a selected captive manager - assuring the team selects appropriate domiciles, develops
                business plans, projects financial results, and walks a captive application to regulators
                from submission to approval.
              </p>
              <p className={styles.approachText}>
                Once a client is fully operational, we act as team captain to ensure all team members are
                achieving their individual benchmarks and properly contributing toward the collective success
                of the client. Long-term relationships with regulators, based on mutual respect, facilitate
                this process.
              </p>
              <p className={styles.approachQuote}>
                &quot;There is a reason we do not advertise - all our business is generated by referral.&quot;
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className={`section ${styles.team}`}>
        <div className="container">
          <AnimatedSection>
            <p className={styles.eyebrow}>The People Behind Palmetto</p>
            <h2 className={styles.sectionHeading}>Our Team</h2>
          </AnimatedSection>
          <div className={styles.teamGrid}>
            {team.map((member, i) => (
              <AnimatedSection key={member.name} delay={i * 120}>
                <div className={styles.teamCard}>
                  <div className={styles.teamAvatar}>
                    {member.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <h3 className={styles.teamName}>{member.name}</h3>
                  <p className={styles.teamRole}>{member.role}</p>
                  <p className={styles.teamBio}>{member.bio}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className="container">
          <AnimatedSection>
            <h2 className={styles.ctaHeading}>Ready to work with Palmetto?</h2>
            <CTAButton label="Get in Touch" to="/contact" variant="outline" />
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
