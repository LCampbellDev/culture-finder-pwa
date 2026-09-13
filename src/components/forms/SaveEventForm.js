"use client";

import { useEffect, useId, useRef, useState } from "react";
import FieldError from "./FieldError";
import styles from "./Form.module.css";
import feedbackStyles from "../ui/Feedback.module.css";

/*
Save event form:

- Lets users choose a wishlist and save an event
- Handles wishlist availability, validation and accessible feedback
*/

export default function SaveEventForm({
  eventName,
  wishlists,
  onSave,
  isSaving = false,
  successMessage = "",
  errorMessage = "",
  areWishlistsLoading = false,
  wishlistLoadError = "",
}) {
  const [selectedWishlistId, setSelectedWishlistId] = useState("");
  const [wishlistError, setWishlistError] = useState("");
  const wishlistSelectRef = useRef(null);
  const fieldId = useId();

  const selectId = `${fieldId}-wishlist`;
  const hintId = `${fieldId}-wishlist-hint`;
  const errorId = `${fieldId}-wishlist-error`;
  const hasNoWishlists =
    !areWishlistsLoading && !wishlistLoadError && wishlists.length === 0;
  const areWishlistControlsDisabled =
    isSaving ||
    areWishlistsLoading ||
    Boolean(wishlistLoadError) ||
    hasNoWishlists;

  useEffect(() => {
    if (wishlistError) {
      wishlistSelectRef.current?.focus();
    }
  }, [wishlistError]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedWishlistId) {
      setWishlistError("Choose a wishlist");
      return;
    }

    setWishlistError("");
    await onSave(Number(selectedWishlistId));
  }

  function handleWishlistChange(event) {
    setSelectedWishlistId(event.target.value);

    if (wishlistError) {
      setWishlistError("");
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      aria-label={`Save ${eventName} to a wishlist`}
      noValidate
    >
      <div className={styles.field}>
        <label className={styles.label} htmlFor={selectId}>
          Wishlist
          <span className="visually-hidden"> for {eventName}</span>
        </label>

        <p className={styles.hint} id={hintId}>
          Choose where to save this event
        </p>

        <FieldError id={errorId} message={wishlistError} />

        {wishlistLoadError && (
          <p className={feedbackStyles.error} role="alert">
            <strong>Error:</strong> {wishlistLoadError}
          </p>
        )}

        {hasNoWishlists && <p>You don&apos;t have any wishlists yet</p>}

        <select
          ref={wishlistSelectRef}
          className={styles.control}
          id={selectId}
          name="wishlistId"
          value={selectedWishlistId}
          onChange={handleWishlistChange}
          aria-describedby={wishlistError ? `${hintId} ${errorId}` : hintId}
          aria-invalid={wishlistError ? "true" : undefined}
          disabled={areWishlistControlsDisabled}
          required
        >
          <option value="">
            {areWishlistsLoading ? "Loading wishlists…" : "Choose a wishlist"}
          </option>

          {wishlists.map((wishlist) => (
            <option key={wishlist.wishlist_id} value={wishlist.wishlist_id}>
              {wishlist.wishlist_title}
            </option>
          ))}
        </select>
      </div>

      <button
        className={styles.button}
        type="submit"
        disabled={areWishlistControlsDisabled}
        aria-label={
          isSaving
            ? `Saving to wishlist: ${eventName}`
            : `Save to wishlist: ${eventName}`
        }
      >
        {isSaving ? "Saving…" : "Save to wishlist"}
      </button>
      <div className={feedbackStyles.feedback} role="status" aria-atomic="true">
        {successMessage && (
          <p className={feedbackStyles.success}>{successMessage}</p>
        )}
      </div>

      {errorMessage && (
        <p className={feedbackStyles.error} role="alert">
          <strong>Error:</strong> {errorMessage}
        </p>
      )}
    </form>
  );
}
