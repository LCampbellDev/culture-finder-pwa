import {
  WISHLIST_STATUSES,
  addEventToWishlist,
  createWishlist,
  deleteWishlist,
  getUserWishlists,
  getWishlistEvents,
  removeEventFromWishlist,
  updateWishlistEventStatus,
} from "../src/lib/api/wishlists";

function createJsonResponse(data, { ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    json: jest.fn().mockResolvedValue(data),
  };
}

describe("wishlist API client", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = "http://127.0.0.1:5000";
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("exports the statuses accepted by the backend", () => {
    expect(WISHLIST_STATUSES).toEqual(["Wishlist", "Booked", "Not Interested"]);
  });

  it("retrieves the active demo profile wishlists", async () => {
    const wishlists = [
      {
        wishlist_id: 4,
        user_id: 2,
        wishlist_title: "Summer events",
      },
    ];

    fetch.mockResolvedValue(createJsonResponse(wishlists));

    await expect(getUserWishlists(2)).resolves.toEqual(wishlists);

    expect(fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:5000/users/2/wishlists",
      expect.objectContaining({
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      }),
    );
  });

  it("creates a named wishlist with a trimmed title", async () => {
    const createdWishlist = {
      wishlist_id: 5,
      user_id: 2,
      wishlist_title: "Theatre trips",
    };

    fetch.mockResolvedValue(
      createJsonResponse(createdWishlist, { status: 201 }),
    );

    await expect(createWishlist(2, "  Theatre trips  ")).resolves.toEqual(
      createdWishlist,
    );

    expect(fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:5000/wishlists",
      expect.objectContaining({
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: 2,
          wishlist_title: "Theatre trips",
        }),
      }),
    );
  });

  it("retrieves wishlist events with optional filtering and sorting", async () => {
    const events = [
      {
        wishlist_event_id: 8,
        event_name: "Leeds Jazz Evening",
        status: "Wishlist",
      },
    ];

    fetch.mockResolvedValue(createJsonResponse(events));

    await expect(
      getWishlistEvents(5, {
        category: "Music",
        sortByDate: true,
      }),
    ).resolves.toEqual(events);

    expect(fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:5000/wishlists/5/events?category=music&sort_by_date=true",
      expect.objectContaining({
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      }),
    );
  });

  it("adds one searched event to a wishlist", async () => {
    const savedEvent = {
      wishlist_event_id: 8,
      wishlist_id: 5,
      event_id: 12,
    };

    fetch.mockResolvedValue(createJsonResponse(savedEvent, { status: 201 }));

    await expect(addEventToWishlist(5, 12)).resolves.toEqual(savedEvent);

    expect(fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:5000/wishlists/5/events",
      expect.objectContaining({
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: 12,
        }),
      }),
    );
  });

  it("updates a saved event to an allowed status", async () => {
    const updateResult = {
      message: "Event status updated successfully",
      wishlist_event_id: 8,
      new_status: "Booked",
    };

    fetch.mockResolvedValue(createJsonResponse(updateResult));

    await expect(updateWishlistEventStatus(8, "Booked")).resolves.toEqual(
      updateResult,
    );

    expect(fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:5000/update-event-status",
      expect.objectContaining({
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wishlist_event_id: 8,
          status: "Booked",
        }),
      }),
    );
  });

  it("rejects an unsupported status before making a request", async () => {
    await expect(updateWishlistEventStatus(8, "Maybe")).rejects.toThrow(
      /valid event status/i,
    );

    expect(fetch).not.toHaveBeenCalled();
  });

  it("removes one event from its wishlist", async () => {
    const removalResult = {
      message: "Wishlist item deleted successfully",
      user_id: 2,
      wishlist_id: 5,
      wishlist_event_id: 8,
    };

    fetch.mockResolvedValue(createJsonResponse(removalResult));

    await expect(removeEventFromWishlist(2, 5, 8)).resolves.toEqual(
      removalResult,
    );

    expect(fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:5000/users/2/wishlists/5/events/8",
      expect.objectContaining({
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      }),
    );
  });

  it("deletes a wishlist belonging to the demo profile", async () => {
    const deletionResult = {
      message: "Wishlist deleted successfully",
      user_id: 2,
      wishlist_id: 5,
    };

    fetch.mockResolvedValue(createJsonResponse(deletionResult));

    await expect(deleteWishlist(2, 5)).resolves.toEqual(deletionResult);

    expect(fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:5000/users/2/wishlists/5",
      expect.objectContaining({
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      }),
    );
  });

  it("rejects invalid identifiers before making a request", async () => {
    await expect(getUserWishlists(0)).rejects.toThrow(/valid demo profile/i);

    await expect(addEventToWishlist(5, -1)).rejects.toThrow(/valid event/i);

    expect(fetch).not.toHaveBeenCalled();
  });

  it("returns a friendly error when the API request fails", async () => {
    fetch.mockResolvedValue(
      createJsonResponse(
        {
          error: "Database execution error",
          details: "internal database information",
        },
        {
          ok: false,
          status: 500,
        },
      ),
    );

    await expect(getUserWishlists(2)).rejects.toThrow(
      /could not load your wishlists/i,
    );
  });
});
