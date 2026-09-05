"use client";
import { useState } from "react";
import { WISHLIST_STATUSES } from "../../lib/api/wishlists";

export default function UpdateEventStatusForm({
  wishlistEventId,
  eventName,
  currentStatus,
  onStatusUpdate,
  isUpdating,
  errorMessage,
  successMessage,
}) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  function handleSubmit(event) {
    event.preventDefault();

    onStatusUpdate(wishlistEventId, selectedStatus);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor={`status-${wishlistEventId}`}>Status</label>

      <select
        id={`status-${wishlistEventId}`}
        value={selectedStatus}
        onChange={(event) => setSelectedStatus(event.target.value)}
        disabled={isUpdating}
      >
        {WISHLIST_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <button type="submit" disabled={isUpdating}>
        {isUpdating ? "Updating…" : "Update status"}
      </button>
      {errorMessage && <p role="alert">{errorMessage}</p>}

      {successMessage && <p role="status">{successMessage}</p>}
    </form>
  );
}
