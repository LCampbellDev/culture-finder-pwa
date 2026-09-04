"use client";

import { useEffect, useState } from "react";
import EventList from "../../components/events/EventList";
import SearchForm from "../../components/forms/SearchForm";
import PageHeader from "../../components/ui/PageHeader";
import { searchEvents } from "../../lib/api/events";
import feedbackStyles from "../../components/ui/Feedback.module.css";
import PageError from "../../components/ui/PageError";
import SaveEventForm from "../../components/forms/SaveEventForm";
import { useDemoProfile } from "../../context/DemoProfileContext";
import { addEventToWishlist, getUserWishlists } from "../../lib/api/wishlists";

export default function SearchPageClient() {
  const { profile, isProfileReady } = useDemoProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [resultMessage, setResultMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [wishlists, setWishlists] = useState([]);
  const [areWishlistsLoading, setAreWishlistsLoading] = useState(false);
  const [wishlistLoadError, setWishlistLoadError] = useState("");
  const [savingEventId, setSavingEventId] = useState(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState("");
  const [saveErrorMessage, setSaveErrorMessage] = useState("");
  const [saveFeedbackEventId, setSaveFeedbackEventId] = useState(null);

  useEffect(() => {
    if (!isProfileReady || !profile) {
      return;
    }

    let isCurrent = true;

    async function loadWishlists() {
      setAreWishlistsLoading(true);
      setWishlistLoadError("");

      try {
        const result = await getUserWishlists(profile.userId);

        if (isCurrent) {
          setWishlists(result);
        }
      } catch (error) {
        if (isCurrent) {
          setWishlists([]);
          setWishlistLoadError(error.message);
        }
      } finally {
        if (isCurrent) {
          setAreWishlistsLoading(false);
        }
      }
    }

    loadWishlists();

    return () => {
      isCurrent = false;
    };
  }, [isProfileReady, profile]);

  async function handleSearch(city, category) {
    setIsLoading(true);
    setEvents([]);
    setResultMessage("");
    setErrorMessage("");

    try {
      const result = await searchEvents(city, category);

      setEvents(result.events);

      if (result.count === 0) {
        setResultMessage(
          `No events found in ${result.city}. Try another city or category.`,
        );
        return;
      }

      const eventLabel = result.count === 1 ? "event" : "events";

      setResultMessage(
        `Found ${result.count} ${eventLabel} in ${result.city}.`,
      );
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveToWishlist(wishlistId, eventId) {
    setSavingEventId(eventId);
    setSaveFeedbackEventId(eventId);
    setSaveSuccessMessage("");
    setSaveErrorMessage("");

    try {
      await addEventToWishlist(wishlistId, eventId);
      setSaveSuccessMessage("Event saved to your wishlist");
    } catch (error) {
      setSaveErrorMessage(error.message);
    } finally {
      setSavingEventId(null);
    }
  }

  const availableWishlists = isProfileReady && profile ? wishlists : [];

  return (
    <>
      <PageHeader
        title="Search events"
        description="Search for cultural events by city and optional category"
      />

      <SearchForm onSearch={handleSearch} isLoading={isLoading} />

      <div
        className={feedbackStyles.feedback}
        aria-live="polite"
        aria-atomic="true"
      >
        {isLoading && <p>Searching for events…</p>}
        {!isLoading && resultMessage && <p>{resultMessage}</p>}
      </div>

      <PageError message={errorMessage} />

      <EventList
        events={events}
        renderActions={(event) => (
          <SaveEventForm
            eventName={event.event_name}
            wishlists={availableWishlists}
            onSave={(wishlistId) =>
              handleSaveToWishlist(wishlistId, event.event_id)
            }
            isSaving={savingEventId === event.event_id}
            successMessage={
              saveFeedbackEventId === event.event_id ? saveSuccessMessage : ""
            }
            errorMessage={
              saveFeedbackEventId === event.event_id ? saveErrorMessage : ""
            }
          />
        )}
      />
    </>
  );
}
