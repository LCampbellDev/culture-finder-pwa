"use client";

import { useEffect, useState } from "react";
import EventList from "../../../components/events/EventList";
import { useDemoProfile } from "../../../context/DemoProfileContext";
import {
  getUserWishlists,
  getWishlistEvents,
} from "../../../lib/api/wishlists";
import PageHeader from "../../../components/ui/PageHeader";

export default function WishlistPageClient({ wishlistId }) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { profile, isProfileReady } = useDemoProfile();
  const [wishlistTitle, setWishlistTitle] = useState("");

  useEffect(() => {
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

  return (
    <>
      <PageHeader
        title={wishlistTitle || "Wishlist"}
        description="Events saved to this wishlist"
      />

      {isLoading && <p>Loading wishlist events…</p>}
      {errorMessage && <p>{errorMessage}</p>}
      {!isLoading && !errorMessage && events.length === 0 && (
        <p>This wishlist does not have any saved events yet</p>
      )}
      {!isLoading && !errorMessage && events.length > 0 && (
        <EventList events={events} />
      )}
    </>
  );
}
