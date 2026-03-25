import { Link } from 'react-router-dom';
import styles from './CTAButton.module.css';

export default function CTAButton({ label, to, variant = 'primary' }) {
  return (
    <Link to={to} className={`${styles.btn} ${styles[variant]}`}>
      {label}
    </Link>
  );
}
