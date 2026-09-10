"use client";

import FieldError from "./FieldError";
import styles from "./Form.module.css";
import { useEffect, useRef, useState } from "react";
import {
  MAX_USERNAME_LENGTH,
  validateUsername,
} from "../../lib/validation/username-validation";

import { validateTextInput } from "../../lib/validation/validate-text-input";

/*
Demo profile form:
- Validates and submits a username
- Manages validation errors and focus
- Disables submission while the profile is being created
*/

const MAX_USERNAME_LENGTH = 50;



export default function DemoProfileForm({
  onProfileSubmit,
  isLoading = false,
}) {
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const usernameInputRef = useRef(null);

  useEffect(() => {
    if (usernameError) {
      usernameInputRef.current?.focus();
    }
  }, [usernameError]);

  async function handleSubmit(event) {
    event.preventDefault();

    const usernameValidation = validateUsername(username);

    if (usernameValidation.error) {
      showError(usernameValidation.error);
      return;
    }

        setUsernameError("");
        await onProfileSubmit(usernameValidation.value);
      }

  function showError(message) {
    setUsernameError(message);
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

        <FieldError id="demo-username-error" message={usernameError} />

        <input
          ref={usernameInputRef}
          className={styles.control}
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
      </div>

      <button className={styles.button} type="submit" disabled={isLoading}>
        {isLoading
          ? "Creating demo profile…"
          : "Create or continue with demo profile"}
      </button>
    </form>
  );
}
