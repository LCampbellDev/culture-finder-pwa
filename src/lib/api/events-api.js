import { createApiUrl } from "./api-client";

const CITY_REQUIRED_MESSAGE = "Enter a city or location";
const EVENTS_CONFIGURATION_ERROR_MESSAGE = "Event search is not available right now";
const SEARCH_ERROR_MESSAGE =
  "We could not search for events. Check your connection and try again";

export async function searchEvents(city, category) {
  const searchUrl = createSearchUrl(city, category);

  try {
    const response = await fetch(searchUrl, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(SEARCH_ERROR_MESSAGE);
    }

    const data = await response.json();

    // Validate the response fields this client relies on.
    // Individual event objects are currently trusted to match the backend contract.

    if (
      typeof data.city !== "string" ||
      typeof data.count !== "number" ||
      !Array.isArray(data.events)
    ) {
      throw new Error(SEARCH_ERROR_MESSAGE);
    }

    return {
      city: data.city,
      count: data.count,
      events: data.events,
    };
  } catch {
    throw new Error(SEARCH_ERROR_MESSAGE);
  }
}


function createSearchUrl(city, category) {
  // Only input type and a non-empty value are validated here;
  // location validity is handled by the backend/event API.
  if (typeof city !== "string" || !city.trim()) {
    throw new Error(CITY_REQUIRED_MESSAGE);
  }

  const searchUrl = new URL(
    createApiUrl(
      "/search-events",
      EVENTS_CONFIGURATION_ERROR_MESSAGE,
    ),
  );

  searchUrl.searchParams.set("city", city.trim());

  /* Omit the optional category parameter when no usable value is provided. */
  /* TODO: Delete .trim().toLowerCase(), when have reviewed value normalisation in SearchForm */
  if (typeof category === "string" && category.trim()) {
    searchUrl.searchParams.set("category", category.trim().toLowerCase());
  }

  return searchUrl.toString();
}

