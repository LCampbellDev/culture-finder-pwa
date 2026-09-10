"use client";

import { useEffect, useRef, useState } from "react";
import FieldError from "./FieldError";
import styles from "./Form.module.css";
import {
  maxLength,
  nonEmptyText,
  noUnsupportedUnicodeCharacters,
} from "../../lib/validation/text-validation-rules";

import { validateTextInput } from "../../lib/validation/validate-text-input";

/*
Create wishlist form:
- Validates and submits a wishlist name
- Manages validation errors and focus
- Clears the field after successful creation
- Disables submission while the wishlist is being created
*/

const MAX_WISHLIST_TITLE_LENGTH = 255;

const wishlistTitleRules = [
  nonEmptyText("Enter a wishlist name"),
  maxLength(
    MAX_WISHLIST_TITLE_LENGTH,
    "Wishlist name must be 255 characters or fewer",
  ),
  noUnsupportedUnicodeCharacters(
    "Wishlist name contains unsupported characters",
  ),
];

export default function CreateWishlistForm({
  onWishlistSubmit,
  isLoading = false,
}) {
  const wishlistTitleInputRef = useRef(null);
  const [wishlistTitle, setWishlistTitle] = useState("");
  const [wishlistTitleError, setWishlistTitleError] = useState("");

  useEffect(() => {
    if (wishlistTitleError) {
      wishlistTitleInputRef.current?.focus();
    }
  }, [wishlistTitleError]);

  async function handleSubmit(event) {
    event.preventDefault();

    const wishlistTitleValidation = validateTextInput(
      wishlistTitle,
      wishlistTitleRules,
    );

    if (wishlistTitleValidation.error) {
      showError(wishlistTitleValidation.error);
      return;
    }

    setWishlistTitleError("");

    const wasCreated = await onWishlistSubmit(wishlistTitleValidation.value);

    if (wasCreated) {
      setWishlistTitle("");
    }
  }

  function showError(message) {
    setWishlistTitleError(message);
  }

  function handleWishlistTitleChange(event) {
    setWishlistTitle(event.target.value);

    if (wishlistTitleError) {
      setWishlistTitleError("");
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      aria-label="Create wishlist"
      noValidate
    >
      <div className={styles.field}>
        <label className={styles.label} htmlFor="wishlist-title">
          Wishlist name
          <span aria-hidden="true"> *</span>
        </label>

        <p className={styles.hint} id="wishlist-title-hint">
          Use a descriptive name, up to 255 characters
        </p>

        <FieldError id="wishlist-title-error" message={wishlistTitleError} />

        <input
          ref={wishlistTitleInputRef}
          className={styles.control}
          id="wishlist-title"
          name="wishlistTitle"
          type="text"
          value={wishlistTitle}
          onChange={handleWishlistTitleChange}
          maxLength={MAX_WISHLIST_TITLE_LENGTH}
          autoComplete="off"
          required
          aria-describedby={
            wishlistTitleError
              ? "wishlist-title-hint wishlist-title-error"
              : "wishlist-title-hint"
          }
          aria-invalid={wishlistTitleError ? "true" : undefined}
        />
      </div>

      <button className={styles.button} type="submit" disabled={isLoading}>
        {isLoading ? "Creating wishlist…" : "Create wishlist"}
      </button>
    </form>
  );
}
