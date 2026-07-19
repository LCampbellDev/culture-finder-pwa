import { searchEvents } from "../src/lib/api/events";

const API_URL = "http://127.0.0.1:5000";
const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;
const originalFetch = global.fetch;

describe("searchEvents", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = API_URL;
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;

    if (originalApiUrl) {
      process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
    } else {
      delete process.env.NEXT_PUBLIC_API_URL;
    }
  });

  it("requests events using the city and category", async () => {
    const apiResponse = {
      city: "Leeds",
      count: 1,
      events: [
        {
          event_id: 1,
          event_name: "Test event",
          city: "Leeds",
        },
      ],
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(apiResponse),
    });

    const result = await searchEvents(" Leeds ", " MUSIC ");

    const [requestUrl, requestOptions] = global.fetch.mock.calls[0];
    const parsedUrl = new URL(requestUrl);

    expect(parsedUrl.origin).toBe(API_URL);
    expect(parsedUrl.pathname).toBe("/search-events");
    expect(parsedUrl.searchParams.get("city")).toBe("Leeds");
    expect(parsedUrl.searchParams.get("category")).toBe("music");

    expect(requestOptions).toEqual({
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    expect(result).toEqual(apiResponse);
  });

  it("omits the category when one is not provided", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        city: "York",
        count: 0,
        events: [],
      }),
    });

    await searchEvents("York");

    const [requestUrl] = global.fetch.mock.calls[0];
    const parsedUrl = new URL(requestUrl);

    expect(parsedUrl.searchParams.get("city")).toBe("York");
    expect(parsedUrl.searchParams.has("category")).toBe(false);
  });

  it("rejects an empty city without making a request", async () => {
    await expect(searchEvents("   ")).rejects.toThrow(
      "Enter a city or location",
    );

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("reports unavailable configuration without making a request", async () => {
    delete process.env.NEXT_PUBLIC_API_URL;

    await expect(searchEvents("Leeds")).rejects.toThrow(
      "Event search is not available right now",
    );

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("returns a friendly message for an unsuccessful response", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(searchEvents("Leeds")).rejects.toThrow(
      "We could not search for events. Check your connection and try again",
    );
  });

  it("returns a friendly message when the request fails", async () => {
    global.fetch.mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(searchEvents("Leeds")).rejects.toThrow(
      "We could not search for events. Check your connection and try again",
    );
  });

  it("returns a friendly message for an unexpected response structure", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        results: [],
      }),
    });

    await expect(searchEvents("Leeds")).rejects.toThrow(
      "We could not search for events. Check your connection and try again",
    );
  });
});