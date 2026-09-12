import { createOrContinueDemoProfile } from "./users-api";
import { createMockJsonResponse } from "./test-helpers/create-mock-json-response";

const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;
const originalFetch = global.fetch;

describe("createOrContinueDemoProfile", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = "http://127.0.0.1:5000";
    global.fetch = jest.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
    
    if (originalApiUrl === undefined) {
      delete process.env.NEXT_PUBLIC_API_URL;
    } else {
      process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
    }
  });

  it("creates or continues a demo profile", async () => {
    // Arrange
    const apiResponse = {
      user_id: 7,
      username: "demo-reviewer",
    };

    fetch.mockResolvedValue(createMockJsonResponse(apiResponse));

    // Act
    const result = await createOrContinueDemoProfile("demo-reviewer");

    // Assert
    expect(result).toEqual({
      userId: 7,
      username: "demo-reviewer",
    });

    expect(fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:5000/users",
      expect.objectContaining({
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "demo-reviewer",
        }),
      }),
    );
  });

  it("trims the username before sending it", async () => {
    // Arrange
    const apiResponse = {
      user_id: 7,
      username: "demo-reviewer",
    };

    fetch.mockResolvedValue(createMockJsonResponse(apiResponse));

    // Act
    await createOrContinueDemoProfile("  demo-reviewer  ");

    // Assert
    expect(fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:5000/users",
      expect.objectContaining({
        body: JSON.stringify({
          username: "demo-reviewer",
        }),
      }),
    );
  });

  it("rejects an empty username without making a request", async () => {
    // Act & Assert (beforeEach handled Arrange)
    await expect(createOrContinueDemoProfile("   ")).rejects.toThrow(
      "Enter a demo username",
    );

    expect(fetch).not.toHaveBeenCalled();
  });

  it("reports missing API configuration", async () => {
    // Arrange
    delete process.env.NEXT_PUBLIC_API_URL;

    // Act & Assert
    await expect(createOrContinueDemoProfile("demo-reviewer")).rejects.toThrow(
      "Demo profiles are not available right now",
    );

    // Assert
    expect(fetch).not.toHaveBeenCalled();
  });

  it("reports an unsuccessful response", async () => {
    // Arrange
    fetch.mockResolvedValue(
      createMockJsonResponse(null, {
        ok: false,
        status: 500,
      }),
    );

    // Act & Assert
    await expect(createOrContinueDemoProfile("demo-reviewer")).rejects.toThrow(
      "We could not create or continue with the demo profile",
    );
  });

  it("reports an invalid response", async () => {
    // Arrange
    const apiResponse = {
      username: "demo-reviewer",
    };

    fetch.mockResolvedValue(createMockJsonResponse(apiResponse));

    // Act & Assert
    await expect(createOrContinueDemoProfile("demo-reviewer")).rejects.toThrow(
      "We could not create or continue with the demo profile",
    );
  });

  it("reports a connection failure", async () => {
    // Arrange
    fetch.mockRejectedValue(new Error("Network failure"));

    // Act & Assert
    await expect(createOrContinueDemoProfile("demo-reviewer")).rejects.toThrow(
      "We could not create or continue with the demo profile",
    );
  });
});
