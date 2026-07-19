import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePageClient from "../src/app/HomePageClient";
import { createOrContinueDemoProfile } from "../src/lib/api/users";

jest.mock("../src/lib/api/users", () => ({
  createOrContinueDemoProfile: jest.fn(),
}));

describe("HomePageClient demo profile", () => {
  beforeEach(() => {
    createOrContinueDemoProfile.mockReset();
  });

  it("explains the demo profile security limitations", () => {
  render(<HomePageClient />);

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
    screen.getByText(
      /do not enter personal or sensitive information/i,
    ),
  ).toBeInTheDocument();
});

  it("creates or continues with a demo profile", async () => {
    const user = userEvent.setup();

    createOrContinueDemoProfile.mockResolvedValue({
      userId: 7,
      username: "demo-reviewer",
    });

    render(<HomePageClient />);

    await user.type(
      screen.getByRole("textbox", {
        name: /demo username/i,
      }),
      "demo-reviewer",
    );

    await user.click(
      screen.getByRole("button", {
        name: /create or continue with demo profile/i,
      }),
    );

    expect(createOrContinueDemoProfile).toHaveBeenCalledWith(
      "demo-reviewer",
    );

    expect(
      await screen.findByText(
        /demo profile “demo-reviewer” is active for this visit/i,
      ),
    ).toBeInTheDocument();
  });

  it("shows an accessible error when profile creation fails", async () => {
    const user = userEvent.setup();

    createOrContinueDemoProfile.mockRejectedValue(
      new Error(
        "We could not create or continue with the demo profile. Check your connection and try again",
      ),
    );

    render(<HomePageClient />);

    await user.type(
      screen.getByRole("textbox", {
        name: /demo username/i,
      }),
      "demo-reviewer",
    );

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

