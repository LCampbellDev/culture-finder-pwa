import styles from "./PageHeader.module.css";

export default function PageHeader({ title, description }) {
  return (
    <header className={styles.pageHeader}>
      <h1>{title}</h1>
      {description && (
        <p className={styles.description}>{description}</p>
      )}
    </header>
  );
}
