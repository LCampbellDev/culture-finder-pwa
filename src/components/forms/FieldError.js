import styles from "./Form.module.css";

export default function FieldError({ id, message }) {
  if (!message) {
    return null;
  }

  return (
    <p className={styles.error} id={id}>
      <strong>Error:</strong> {message}
    </p>
  );
}
