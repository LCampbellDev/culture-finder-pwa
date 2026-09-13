"use client";

import { useEffect, useState } from "react";
import EventList from "../../../components/events/EventList";
import { useDemoProfile } from "../../../context/DemoProfileContext";
import {
  getUserWishlists,
  getWishlistEvents,
  updateWishlistEventStatus,
} from "../../../lib/api/wishlists-api";
import PageHeader from "../../../components/ui/PageHeader";
import UpdateEventStatusForm from "../../../components/forms/UpdateEventStatusForm";
import PageError from "../../../components/ui/PageError";
import Link from "next/link";

/*
Wishlist detail page orchestration for one wishlist:

- Loads the wishlist title and saved events
- Coordinates per-event status updates
- Presents loading, empty and error states
*/

export default function WishlistPageClient({ wishlistId }) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { profile, isProfileReady } = useDemoProfile();
  const [wishlistTitle, setWishlistTitle] = useState("");
  const [updatingEventId, setUpdatingEventId] = useState(null);
  const [statusErrorMessage, setStatusErrorMessage] = useState("");
  const [statusFeedbackEventId, setStatusFeedbackEventId] = useState(null);
  const [statusSuccessMessage, setStatusSuccessMessage] = useState("");

  useEffect(() => {
    if (!isProfileReady || !profile) {
      return;
    }

    let isCancelled = false;

    async function loadWishlistEvents() {
      try {
        // TODO: Replace this extra request with a dedicated Flask API endpoint
        // that retrieves a single wishlist by ID so wishlist name can be displayed
        const loadedWishlists = await getUserWishlists(profile.userId);

        // TODO: Consider extracting wishlist lookup into a helper and unit testing it
        const currentWishlist = loadedWishlists.find(
          (wishlist) => wishlist.wishlist_id === Number(wishlistId),
        );
        const loadedEvents = await getWishlistEvents(Number(wishlistId));

        if (!isCancelled) {
          setWishlistTitle(currentWishlist?.wishlist_title ?? "");
          setEvents(loadedEvents);
          setErrorMessage("");
        }
      } catch (error) {
        if (!isCancelled) {
          setEvents([]);
          setErrorMessage(error.message);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadWishlistEvents();

    return () => {
      isCancelled = true;
    };
  }, [wishlistId, isProfileReady, profile]);

  async function handleStatusUpdate(wishlistEventId, newStatus) {
    setUpdatingEventId(wishlistEventId);
    setStatusErrorMessage("");
    setStatusSuccessMessage("");
    setStatusFeedbackEventId(wishlistEventId);

    try {
      await updateWishlistEventStatus(wishlistEventId, newStatus);

      setEvents((currentEvents) =>
        currentEvents.map((event) =>
          event.wishlist_event_id === wishlistEventId
            ? { ...event, status: newStatus }
            : event,
        ),
      );

      setStatusSuccessMessage(`Status updated to ${newStatus}`);
    } catch (error) {
      setStatusErrorMessage(error.message);
    } finally {
      setUpdatingEventId(null);
    }
  }

  return (
    <>
      <PageHeader
        title={wishlistTitle || "Wishlist"}
        description="Events saved to this wishlist"
      />

      {!isProfileReady && <p>Checking for a saved demo profile…</p>}

      {isProfileReady && !profile && (
        <section aria-labelledby="demo-profile-required-heading">
          <h2 id="demo-profile-required-heading">
            Choose a demo profile first
          </h2>

          <p>A demo profile is needed to view wishlist events</p>

          <Link href="/">Choose a demo profile</Link>
        </section>
      )}

      {isProfileReady && profile && isLoading && (
        <p>Loading wishlist events…</p>
      )}

      {isProfileReady && profile && <PageError message={errorMessage} />}

      {isProfileReady &&
        profile &&
        !isLoading &&
        !errorMessage &&
        events.length === 0 && (
          <p>This wishlist does not have any saved events yet</p>
        )}

      {isProfileReady &&
        profile &&
        !isLoading &&
        !errorMessage &&
        events.length > 0 && (
          <EventList
            events={events}
            renderActions={(event) => (
              <UpdateEventStatusForm
                wishlistEventId={event.wishlist_event_id}
                eventName={event.event_name}
                currentStatus={event.status}
                onStatusUpdate={handleStatusUpdate}
                isUpdating={updatingEventId === event.wishlist_event_id}
                errorMessage={
                  statusFeedbackEventId === event.wishlist_event_id
                    ? statusErrorMessage
                    : ""
                }
                successMessage={
                  statusFeedbackEventId === event.wishlist_event_id
                    ? statusSuccessMessage
                    : ""
                }
              />
            )}
          />
        )}
    </>
  );
}
