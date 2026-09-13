import { createApiUrl, createJsonHeaders, requestJson } from "./api-client";
import { createMockJsonResponse } from "./test-helpers/create-mock-json-response";

const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;
const originalFetch = global.fetch;
const CONFIGURATION_ERROR_MESSAGE = "Event search is unavailable";
const REQUEST_ERROR_MESSAGE = "Could not load data";

describe("createApiUrl", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = "http://127.0.0.1:5000";
  });

  afterAll(() => {
    if (originalApiUrl === undefined) {
      delete process.env.NEXT_PUBLIC_API_URL;
    } else {
      process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
    }
  });

  it("combines the configured API URL with the endpoint path", () => {
    const result = createApiUrl("/search-events", CONFIGURATION_ERROR_MESSAGE);

    expect(result).toBe("http://127.0.0.1:5000/search-events");
  });

  it("reports missing API configuration", () => {
    delete process.env.NEXT_PUBLIC_API_URL;

    expect(() =>
      createApiUrl("/search-events", CONFIGURATION_ERROR_MESSAGE),
    ).toThrow(CONFIGURATION_ERROR_MESSAGE);
  });

  it("reports invalid API configuration", () => {
    process.env.NEXT_PUBLIC_API_URL = "not a valid URL";

    expect(() =>
      createApiUrl("/search-events", CONFIGURATION_ERROR_MESSAGE),
    ).toThrow(CONFIGURATION_ERROR_MESSAGE);
  });
});

describe("createJsonHeaders", () => {
  it("creates JSON response headers by default", () => {
    expect(createJsonHeaders()).toEqual({
      Accept: "application/json",
    });
  });

  it("adds the content type for requests with a JSON body", () => {
    expect(createJsonHeaders({ includeContentType: true })).toEqual({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
  });
});

describe("requestJson", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("returns parsed JSON from a successful response", async () => {
    // Arrange
    const responseData = {
      city: "Leeds",
      events: [],
    };

    const options = {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    };

    fetch.mockResolvedValue(createMockJsonResponse(responseData));

    // Act
    const result = await requestJson(
      "http://127.0.0.1:5000/search-events",
      options,
      REQUEST_ERROR_MESSAGE,
    );

    // Assert
    expect(fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:5000/search-events",
      options,
    );
    expect(result).toEqual(responseData);
  });

  it("uses the supplied error message for an unsuccessful response", async () => {
    fetch.mockResolvedValue(
      createMockJsonResponse(null, {
        ok: false,
        status: 500,
      }),
    );

    await expect(
      requestJson("http://127.0.0.1:5000/events", {}, REQUEST_ERROR_MESSAGE),
    ).rejects.toThrow(REQUEST_ERROR_MESSAGE);
  });

  it("uses the supplied error message when the request fails", async () => {
    fetch.mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(
      requestJson("http://127.0.0.1:5000/events", {}, "Could not load data"),
    ).rejects.toThrow(REQUEST_ERROR_MESSAGE);
  });

  it("uses the supplied error message when JSON parsing fails", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockRejectedValue(new SyntaxError("Invalid JSON")),
    });

    await expect(
      requestJson("http://127.0.0.1:5000/events", {}, "Could not load data"),
    ).rejects.toThrow(REQUEST_ERROR_MESSAGE);
  });
});
