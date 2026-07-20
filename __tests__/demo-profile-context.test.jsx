import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  DEMO_PROFILE_STORAGE_KEY,
  DemoProfileProvider,
  useDemoProfile,
} from "../src/context/DemoProfileContext";

function ProfileTestControls() {
  const {
    profile,
    isProfileReady,
    saveDemoProfile,
    clearDemoProfile,
  } = useDemoProfile();

  if (!isProfileReady) {
    return <p>Loading profile</p>;
  }

  return (
    <>
      <p>
        {profile
          ? `Active profile: ${profile.username}`
          : "No active profile"}
      </p>

      <button
        type="button"
        onClick={() =>
          saveDemoProfile({
            userId: 7,
            username: "demo-reviewer",
          })
        }
      >
        Save profile
      </button>

      <button type="button" onClick={clearDemoProfile}>
        Clear profile
      </button>
    </>
  );
}

describe("DemoProfileProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("saves a demo profile in browser storage", async () => {
    const user = userEvent.setup();

    render(
      <DemoProfileProvider>
        <ProfileTestControls />
      </DemoProfileProvider>,
    );

    await screen.findByText("No active profile");

    await user.click(
      screen.getByRole("button", { name: /save profile/i }),
    );

    expect(
      screen.getByText("Active profile: demo-reviewer"),
    ).toBeInTheDocument();

    expect(
      JSON.parse(
        window.localStorage.getItem(
          DEMO_PROFILE_STORAGE_KEY,
        ),
      ),
    ).toEqual({
      userId: 7,
      username: "demo-reviewer",
    });
  });

  it("restores a valid stored demo profile", async () => {
    window.localStorage.setItem(
      DEMO_PROFILE_STORAGE_KEY,
      JSON.stringify({
        userId: 7,
        username: "demo-reviewer",
      }),
    );

    render(
      <DemoProfileProvider>
        <ProfileTestControls />
      </DemoProfileProvider>,
    );

    expect(
      await screen.findByText(
        "Active profile: demo-reviewer",
      ),
    ).toBeInTheDocument();
  });

  it("removes invalid stored profile data", async () => {
    window.localStorage.setItem(
      DEMO_PROFILE_STORAGE_KEY,
      JSON.stringify({
        userId: "not-a-number",
        username: "demo-reviewer",
      }),
    );

    render(
      <DemoProfileProvider>
        <ProfileTestControls />
      </DemoProfileProvider>,
    );

    expect(
      await screen.findByText("No active profile"),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        window.localStorage.getItem(
          DEMO_PROFILE_STORAGE_KEY,
        ),
      ).toBeNull();
    });
  });

  it("clears the active and stored profile", async () => {
    const user = userEvent.setup();

    window.localStorage.setItem(
      DEMO_PROFILE_STORAGE_KEY,
      JSON.stringify({
        userId: 7,
        username: "demo-reviewer",
      }),
    );

    render(
      <DemoProfileProvider>
        <ProfileTestControls />
      </DemoProfileProvider>,
    );

    await screen.findByText("Active profile: demo-reviewer");

    await user.click(
      screen.getByRole("button", { name: /clear profile/i }),
    );

    expect(
      screen.getByText("No active profile"),
    ).toBeInTheDocument();

    expect(
      window.localStorage.getItem(
        DEMO_PROFILE_STORAGE_KEY,
      ),
    ).toBeNull();
  });
});

