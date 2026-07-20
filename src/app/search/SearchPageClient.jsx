"use client";

import { useState } from "react";
import EventList from "../../components/events/EventList";
import SearchForm from "../../components/forms/SearchForm";
import PageHeader from "../../components/ui/PageHeader";
import { searchEvents } from "../../lib/api/events";
import feedbackStyles from "../../components/ui/Feedback.module.css";

export default function SearchPageClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [resultMessage, setResultMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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

      {errorMessage && (
        <p className={feedbackStyles.error} role="alert">
          {errorMessage}
        </p>
      )}

      <EventList events={events} />
    </>
  );
}
