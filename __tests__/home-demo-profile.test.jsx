import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePageClient from "../src/app/HomePageClient";
import {
  DEMO_PROFILE_STORAGE_KEY,
  DemoProfileProvider,
} from "../src/context/DemoProfileContext";
import { createOrContinueDemoProfile } from "../src/lib/api/users";

jest.mock("../src/lib/api/users", () => ({
  createOrContinueDemoProfile: jest.fn(),
}));

function renderHomePage() {
  return render(
    <DemoProfileProvider>
      <HomePageClient />
    </DemoProfileProvider>,
  );
}

describe("HomePageClient demo profile", () => {
  beforeEach(() => {
    window.localStorage.clear();
    createOrContinueDemoProfile.mockReset();
  });

  it("explains the demo profile security limitations", () => {
    renderHomePage();

    const heading = screen.getByRole("heading", {
      level: 2,
      name: /create a demo profile/i,
    });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveAttribute("tabindex", "0");

    expect(
      screen.getByText(/does not use passwords, authentication/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/do not enter personal or sensitive information/i),
    ).toBeInTheDocument();
  });

  it("creates and stores a demo profile", async () => {
    const user = userEvent.setup();

    createOrContinueDemoProfile.mockResolvedValue({
      userId: 7,
      username: "demo-reviewer",
    });

    renderHomePage();

    const input = await screen.findByRole("textbox", {
      name: /demo username/i,
    });

    await user.type(input, "demo-reviewer");

    await user.click(
      screen.getByRole("button", {
        name: /create or continue with demo profile/i,
      }),
    );

    expect(createOrContinueDemoProfile).toHaveBeenCalledWith("demo-reviewer");

    expect(
      await screen.findByText(
        /demo profile "demo-reviewer" is active on this browser/i,
      ),
    ).toBeInTheDocument();

    expect(
      JSON.parse(window.localStorage.getItem(DEMO_PROFILE_STORAGE_KEY)),
    ).toEqual({
      userId: 7,
      username: "demo-reviewer",
    });
  });

  it("restores and clears a saved demo profile", async () => {
    const user = userEvent.setup();

    window.localStorage.setItem(
      DEMO_PROFILE_STORAGE_KEY,
      JSON.stringify({
        userId: 7,
        username: "demo-reviewer",
      }),
    );

    renderHomePage();

    expect(
      await screen.findByText(
        /demo profile "demo-reviewer" is active on this browser/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("textbox", {
        name: /demo username/i,
      }),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: /change demo profile/i,
      }),
    );

    expect(
      await screen.findByRole("textbox", {
        name: /demo username/i,
      }),
    ).toBeInTheDocument();

    expect(window.localStorage.getItem(DEMO_PROFILE_STORAGE_KEY)).toBeNull();
  });

  it("shows an accessible error when profile creation fails", async () => {
    const user = userEvent.setup();

    createOrContinueDemoProfile.mockRejectedValue(
      new Error(
        "We could not create or continue with the demo profile. Check your connection and try again",
      ),
    );

    renderHomePage();

    const input = await screen.findByRole("textbox", {
      name: /demo username/i,
    });

    await user.type(input, "demo-reviewer");

    await user.click(
      screen.getByRole("button", {
        name: /create or continue with demo profile/i,
      }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "We could not create or continue with the demo profile",
    );
  });
});
