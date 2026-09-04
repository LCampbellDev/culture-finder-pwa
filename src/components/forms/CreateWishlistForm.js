"use client";

import { useEffect, useRef, useState } from "react";
import FieldError from "./FieldError";
import styles from "./Form.module.css";

const MAX_WISHLIST_TITLE_LENGTH = 255;

function containsUnsupportedCharacters(value) {
  return [...value].some(
    (character) => character !== " " && /[\p{C}\p{Z}]/u.test(character),
  );
}

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

    const trimmedTitle = wishlistTitle.trim();

    if (!trimmedTitle) {
      showError("Enter a wishlist name");
      return;
    }

    if (trimmedTitle.length > MAX_WISHLIST_TITLE_LENGTH) {
      showError("Wishlist name must be 255 characters or fewer");
      return;
    }

    if (containsUnsupportedCharacters(trimmedTitle)) {
      showError("Wishlist name contains unsupported characters");
      return;
    }

    setWishlistTitleError("");

    const wasCreated = await onWishlistSubmit(trimmedTitle);

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
