const CITY_REQUIRED_MESSAGE = "Enter a city or location";
const CONFIGURATION_ERROR_MESSAGE = "Event search is not available right now";
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
  if (typeof city !== "string" || !city.trim()) {
    throw new Error(CITY_REQUIRED_MESSAGE);
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error(CONFIGURATION_ERROR_MESSAGE);
  }

  let searchUrl;

  try {
    searchUrl = new URL("/search-events", apiUrl);
  } catch {
    throw new Error(CONFIGURATION_ERROR_MESSAGE);
  }

  searchUrl.searchParams.set("city", city.trim());

  if (typeof category === "string" && category.trim()) {
    searchUrl.searchParams.set("category", category.trim().toLowerCase());
  }

  return searchUrl.toString();
}
