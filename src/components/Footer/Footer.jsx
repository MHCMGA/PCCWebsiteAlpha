import { Link } from 'react-router-dom';
import Logo from '../Logo/Logo';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.col}>
          <Link to="/" className={styles.brand}>
            <Logo size={40} variant="light" />
          </Link>
          <p className={styles.tagline}>Independent Insurance Consultants</p>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colHeading}>Navigation</h4>
          <ul className={styles.navLinks}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colHeading}>Contact</h4>
          <address className={styles.address}>
            <p>1325 Park St. Suite 200</p>
            <p>Columbia, SC 29201</p>
            <p className={styles.phone}>
              <a href="tel:8039048461">803-904-8461</a>
            </p>
          </address>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Palmetto Consulting of Columbia, LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
