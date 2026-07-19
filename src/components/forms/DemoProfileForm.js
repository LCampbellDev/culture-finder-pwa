"use client";

import { useRef, useState } from "react";
import styles from "./Form.module.css";

const MAX_USERNAME_LENGTH = 50;

function containsUnsupportedCharacters(value) {
  return [...value].some(
    (character) =>
      character !== " " && /[\p{C}\p{Z}]/u.test(character),
  );
}

export default function DemoProfileForm({
  onProfileSubmit,
  isLoading = false,
}) {
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const usernameInputRef = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      showError("Enter a demo username");
      return;
    }

    if (trimmedUsername.length > MAX_USERNAME_LENGTH) {
      showError("Demo username must be 50 characters or fewer");
      return;
    }

    if (containsUnsupportedCharacters(trimmedUsername)) {
      showError("Demo username contains unsupported characters");
      return;
    }

    setUsernameError("");
    await onProfileSubmit(trimmedUsername);
  }

  function showError(message) {
    setUsernameError(message);
    usernameInputRef.current?.focus();
  }

  function handleUsernameChange(event) {
    setUsername(event.target.value);

    if (usernameError) {
      setUsernameError("");
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      aria-label="Demo profile"
      noValidate
    >
      <div className={styles.field}>
        <label className={styles.label} htmlFor="demo-username">
          Demo username
          <span aria-hidden="true"> *</span>
        </label>

        <p className={styles.hint} id="demo-username-hint">
          Use a fictional nickname that does not identify you, up to 50
          characters
        </p>

        <input
          className={styles.control}
          ref={usernameInputRef}
          id="demo-username"
          name="username"
          type="text"
          value={username}
          onChange={handleUsernameChange}
          maxLength={MAX_USERNAME_LENGTH}
          autoComplete="off"
          required
          aria-describedby={
            usernameError
              ? "demo-username-hint demo-username-error"
              : "demo-username-hint"
          }
          aria-invalid={usernameError ? "true" : undefined}
        />

        {usernameError && (
          <p
            className={styles.error}
            id="demo-username-error"
            role="alert"
          >
            {usernameError}
          </p>
        )}
      </div>

      <button
        className={styles.button}
        type="submit"
        disabled={isLoading}
      >
        {isLoading
          ? "Creating demo profile…"
          : "Create or continue with demo profile"}
      </button>
    </form>
  );
}

