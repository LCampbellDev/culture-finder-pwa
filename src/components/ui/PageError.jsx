"use client";

import { useEffect, useRef } from "react";
import styles from "./Feedback.module.css";

export default function PageError({ message }) {
  const errorRef = useRef(null);

  useEffect(() => {
    if (message) {
      errorRef.current?.focus();
    }
  }, [message]);

  if (!message) {
    return null;
  }

  return (
    <p className={styles.error} role="alert" tabIndex="-1" ref={errorRef}>
      <strong>Error:</strong> {message}
    </p>
  );
}
