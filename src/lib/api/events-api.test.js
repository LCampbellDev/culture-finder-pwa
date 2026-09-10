import { searchEvents } from "./events-api";
import { createMockJsonResponse } from "./test-helpers/create-mock-json-response";

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
    // Arrange 
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

    global.fetch.mockResolvedValue(createMockJsonResponse(apiResponse));

    // Act
    const result = await searchEvents(" Leeds ", " MUSIC ");

    // Assert
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
    // Arrange 
    // Configure fetch response
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        city: "York",
        count: 0,
        events: [],
      }),
    });

    // Act
    await searchEvents("York");

    // Assert
    const [requestUrl] = global.fetch.mock.calls[0];
    const parsedUrl = new URL(requestUrl);

    
    expect(parsedUrl.searchParams.get("city")).toBe("York");
    expect(parsedUrl.searchParams.has("category")).toBe(false);
  });

  it("rejects an empty city without making a request", async () => {
    // Act & Assert (beforeEach setup Arrange already)
    await expect(searchEvents("   ")).rejects.toThrow(
      "Enter a city or location",
    );

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("reports unavailable configuration without making a request", async () => {
    // Arrange
    // Configure unavailable API environment
    delete process.env.NEXT_PUBLIC_API_URL;

    // Act
    await expect(searchEvents("Leeds")).rejects.toThrow(
      "Event search is not available right now",
    );

    // Assert
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("returns a friendly message for an unsuccessful response", async () => {
    // Arrange
    // Configure failed API response
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    // Assert
    await expect(searchEvents("Leeds")).rejects.toThrow(
      "We could not search for events. Check your connection and try again",
    );
  });

  it("returns a friendly message when the request fails", async () => {
    // Arrange
    // Configure network failure
    global.fetch.mockRejectedValue(new TypeError("Failed to fetch"));

    // Assert
    await expect(searchEvents("Leeds")).rejects.toThrow(
      "We could not search for events. Check your connection and try again",
    );
  });

  it("returns a friendly message for an unexpected response structure", async () => {
    // Arrange
    // Configure successful API response with an unexpected structure
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        results: [],
      }),
    });

    // Assert
    await expect(searchEvents("Leeds")).rejects.toThrow(
      "We could not search for events. Check your connection and try again",
    );
  });
});
