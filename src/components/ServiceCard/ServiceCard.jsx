import styles from './ServiceCard.module.css';

export default function ServiceCard({ title, body, icon }) {
  return (
    <div className={styles.card}>
      {icon && <div className={styles.icon} aria-hidden="true">{icon}</div>}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.body}>{body}</p>
    </div>
  );
}
