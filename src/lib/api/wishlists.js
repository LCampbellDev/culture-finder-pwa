export const WISHLIST_STATUSES = ["Wishlist", "Booked", "Not Interested"];

const CONFIGURATION_ERROR_MESSAGE = "Wishlists are not available right now";

const LOAD_WISHLISTS_ERROR_MESSAGE =
  "We could not load your wishlists. Check your connection and try again";

const CREATE_WISHLIST_ERROR_MESSAGE =
  "We could not create the wishlist. Check your connection and try again";

const LOAD_EVENTS_ERROR_MESSAGE =
  "We could not load the wishlist events. Check your connection and try again";

const ADD_EVENT_ERROR_MESSAGE =
  "We could not save the event. Check your connection and try again";

const UPDATE_STATUS_ERROR_MESSAGE =
  "We could not update the event status. Check your connection and try again";

const REMOVE_EVENT_ERROR_MESSAGE =
  "We could not remove the event. Check your connection and try again";

const DELETE_WISHLIST_ERROR_MESSAGE =
  "We could not delete the wishlist. Check your connection and try again";

export async function getUserWishlists(userId) {
  requirePositiveInteger(userId, "A valid demo profile is required");

  const url = createApiUrl(`/users/${userId}/wishlists`);

  const data = await requestJson(
    url,
    {
      headers: createJsonHeaders(),
      cache: "no-store",
    },
    LOAD_WISHLISTS_ERROR_MESSAGE,
  );

  if (!Array.isArray(data)) {
    throw new Error(LOAD_WISHLISTS_ERROR_MESSAGE);
  }

  return data;
}

export async function createWishlist(userId, wishlistTitle) {
  requirePositiveInteger(userId, "A valid demo profile is required");

  if (typeof wishlistTitle !== "string" || !wishlistTitle.trim()) {
    throw new Error("Enter a wishlist name");
  }

  const trimmedTitle = wishlistTitle.trim();
  const url = createApiUrl("/wishlists");

  const data = await requestJson(
    url,
    {
      method: "POST",
      headers: createJsonHeaders({ includeContentType: true }),
      body: JSON.stringify({
        user_id: userId,
        wishlist_title: trimmedTitle,
      }),
    },
    CREATE_WISHLIST_ERROR_MESSAGE,
  );

  if (
    !isPositiveInteger(data?.wishlist_id) ||
    data.user_id !== userId ||
    typeof data.wishlist_title !== "string"
  ) {
    throw new Error(CREATE_WISHLIST_ERROR_MESSAGE);
  }

  return data;
}

export async function getWishlistEvents(
  wishlistId,
  { category, sortByDate = false } = {},
) {
  requirePositiveInteger(wishlistId, "A valid wishlist is required");

  const url = new URL(createApiUrl(`/wishlists/${wishlistId}/events`));

  if (typeof category === "string" && category.trim()) {
    url.searchParams.set("category", category.trim().toLowerCase());
  }

  if (sortByDate === true) {
    url.searchParams.set("sort_by_date", "true");
  }

  const data = await requestJson(
    url.toString(),
    {
      headers: createJsonHeaders(),
      cache: "no-store",
    },
    LOAD_EVENTS_ERROR_MESSAGE,
  );

  if (!Array.isArray(data)) {
    throw new Error(LOAD_EVENTS_ERROR_MESSAGE);
  }

  return data;
}

export async function addEventToWishlist(wishlistId, eventId) {
  requirePositiveInteger(wishlistId, "A valid wishlist is required");
  requirePositiveInteger(eventId, "A valid event is required");

  const url = createApiUrl(`/wishlists/${wishlistId}/events`);

  const data = await requestJson(
    url,
    {
      method: "POST",
      headers: createJsonHeaders({ includeContentType: true }),
      body: JSON.stringify({
        event_id: eventId,
      }),
    },
    ADD_EVENT_ERROR_MESSAGE,
  );

  if (
    !isPositiveInteger(data?.wishlist_event_id) ||
    data.wishlist_id !== wishlistId ||
    data.event_id !== eventId
  ) {
    throw new Error(ADD_EVENT_ERROR_MESSAGE);
  }

  return data;
}

export async function updateWishlistEventStatus(wishlistEventId, status) {
  requirePositiveInteger(wishlistEventId, "A valid saved event is required");

  if (!WISHLIST_STATUSES.includes(status)) {
    throw new Error("Choose a valid event status");
  }

  const url = createApiUrl("/update-event-status");

  const data = await requestJson(
    url,
    {
      method: "PUT",
      headers: createJsonHeaders({ includeContentType: true }),
      body: JSON.stringify({
        wishlist_event_id: wishlistEventId,
        status,
      }),
    },
    UPDATE_STATUS_ERROR_MESSAGE,
  );

  if (
    data?.wishlist_event_id !== wishlistEventId ||
    data.new_status !== status
  ) {
    throw new Error(UPDATE_STATUS_ERROR_MESSAGE);
  }

  return data;
}

export async function removeEventFromWishlist(
  userId,
  wishlistId,
  wishlistEventId,
) {
  requirePositiveInteger(userId, "A valid demo profile is required");
  requirePositiveInteger(wishlistId, "A valid wishlist is required");
  requirePositiveInteger(wishlistEventId, "A valid saved event is required");

  const url = createApiUrl(
    `/users/${userId}/wishlists/${wishlistId}/events/${wishlistEventId}`,
  );

  const data = await requestJson(
    url,
    {
      method: "DELETE",
      headers: createJsonHeaders(),
    },
    REMOVE_EVENT_ERROR_MESSAGE,
  );

  if (
    data?.user_id !== userId ||
    data.wishlist_id !== wishlistId ||
    data.wishlist_event_id !== wishlistEventId
  ) {
    throw new Error(REMOVE_EVENT_ERROR_MESSAGE);
  }

  return data;
}

export async function deleteWishlist(userId, wishlistId) {
  requirePositiveInteger(userId, "A valid demo profile is required");
  requirePositiveInteger(wishlistId, "A valid wishlist is required");

  const url = createApiUrl(`/users/${userId}/wishlists/${wishlistId}`);

  const data = await requestJson(
    url,
    {
      method: "DELETE",
      headers: createJsonHeaders(),
    },
    DELETE_WISHLIST_ERROR_MESSAGE,
  );

  if (data?.user_id !== userId || data.wishlist_id !== wishlistId) {
    throw new Error(DELETE_WISHLIST_ERROR_MESSAGE);
  }

  return data;
}

async function requestJson(url, options, errorMessage) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch {
    throw new Error(errorMessage);
  }
}

function createApiUrl(path) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error(CONFIGURATION_ERROR_MESSAGE);
  }

  try {
    return new URL(path, apiUrl).toString();
  } catch {
    throw new Error(CONFIGURATION_ERROR_MESSAGE);
  }
}

function createJsonHeaders({ includeContentType = false } = {}) {
  const headers = {
    Accept: "application/json",
  };

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

function requirePositiveInteger(value, message) {
  if (!isPositiveInteger(value)) {
    throw new Error(message);
  }
}

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}
