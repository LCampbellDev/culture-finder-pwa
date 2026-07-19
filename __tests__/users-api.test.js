import { createOrContinueDemoProfile } from "../src/lib/api/users";

const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

describe("demo profile API", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = "http://127.0.0.1:5000";
    global.fetch = jest.fn();
  });

  afterAll(() => {
    if (originalApiUrl === undefined) {
      delete process.env.NEXT_PUBLIC_API_URL;
    } else {
      process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
    }
  });

  it("creates or continues a demo profile", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        user_id: 7,
        username: "demo-reviewer",
      }),
    });

    await expect(
      createOrContinueDemoProfile("demo-reviewer"),
    ).resolves.toEqual({
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
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        user_id: 7,
        username: "demo-reviewer",
      }),
    });

    await createOrContinueDemoProfile("  demo-reviewer  ");

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
    await expect(
      createOrContinueDemoProfile("   "),
    ).rejects.toThrow("Enter a demo username");

    expect(fetch).not.toHaveBeenCalled();
  });

  it("reports missing API configuration", async () => {
    delete process.env.NEXT_PUBLIC_API_URL;

    await expect(
      createOrContinueDemoProfile("demo-reviewer"),
    ).rejects.toThrow(
      "Demo profiles are not available right now",
    );

    expect(fetch).not.toHaveBeenCalled();
  });

  it("reports an unsuccessful response", async () => {
    fetch.mockResolvedValue({
      ok: false,
    });

    await expect(
      createOrContinueDemoProfile("demo-reviewer"),
    ).rejects.toThrow(
      "We could not create or continue with the demo profile",
    );
  });

  it("reports an invalid response", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        username: "demo-reviewer",
      }),
    });

    await expect(
      createOrContinueDemoProfile("demo-reviewer"),
    ).rejects.toThrow(
      "We could not create or continue with the demo profile",
    );
  });

  it("reports a connection failure", async () => {
    fetch.mockRejectedValue(new Error("Network failure"));

    await expect(
      createOrContinueDemoProfile("demo-reviewer"),
    ).rejects.toThrow(
      "We could not create or continue with the demo profile",
    );
  });
});

