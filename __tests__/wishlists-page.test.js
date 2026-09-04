import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WishlistsPageClient from "../src/app/wishlists/WishlistsPageClient";
import { useDemoProfile } from "../src/context/DemoProfileContext";
import { createWishlist, getUserWishlists } from "../src/lib/api/wishlists";

jest.mock("../src/context/DemoProfileContext", () => ({
  useDemoProfile: jest.fn(),
}));

jest.mock("../src/lib/api/wishlists", () => ({
  createWishlist: jest.fn(),
  getUserWishlists: jest.fn(),
}));

const activeProfile = {
  userId: 2,
  username: "Demo explorer",
};

describe("WishlistsPageClient", () => {
  beforeEach(() => {
    useDemoProfile.mockReturnValue({
      profile: activeProfile,
      isProfileReady: true,
    });

    getUserWishlists.mockResolvedValue([]);
    createWishlist.mockReset();
  });

  it("shows a checking state while the demo profile is restored", () => {
    useDemoProfile.mockReturnValue({
      profile: null,
      isProfileReady: false,
    });

    render(<WishlistsPageClient />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Your wishlists",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/checking for a saved demo profile/i),
    ).toBeInTheDocument();

    expect(getUserWishlists).not.toHaveBeenCalled();
  });

  it("directs users to choose a demo profile when none is active", () => {
    useDemoProfile.mockReturnValue({
      profile: null,
      isProfileReady: true,
    });

    render(<WishlistsPageClient />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /choose a demo profile first/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /choose a demo profile/i,
      }),
    ).toHaveAttribute("href", "/");

    expect(getUserWishlists).not.toHaveBeenCalled();
  });

  it("loads and displays the active profile wishlists", async () => {
    getUserWishlists.mockResolvedValue([
      {
        wishlist_id: 4,
        user_id: 2,
        wishlist_title: "Summer events",
      },
    ]);

    render(<WishlistsPageClient />);

    expect(
      await screen.findByRole("heading", {
        level: 3,
        name: "Summer events",
      }),
    ).toBeInTheDocument();

    expect(getUserWishlists).toHaveBeenCalledWith(2);
  });

  it("displays an empty state when the profile has no wishlists", async () => {
    render(<WishlistsPageClient />);

    expect(
      await screen.findByText(/you do not have any wishlists yet/i),
    ).toBeInTheDocument();
  });

  it("shows an accessible error when wishlists cannot be loaded", async () => {
    getUserWishlists.mockRejectedValue(
      new Error(
        "We could not load your wishlists. Check your connection and try again",
      ),
    );

    render(<WishlistsPageClient />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /we could not load your wishlists/i,
    );
  });

  it("creates a wishlist and adds it to the displayed list", async () => {
    const user = userEvent.setup();

    createWishlist.mockResolvedValue({
      wishlist_id: 5,
      user_id: 2,
      wishlist_title: "Theatre trips",
    });

    render(<WishlistsPageClient />);

    await screen.findByText(/you do not have any wishlists yet/i);

    await user.type(
      screen.getByRole("textbox", {
        name: /wishlist name/i,
      }),
      "Theatre trips",
    );

    await user.click(
      screen.getByRole("button", {
        name: /create wishlist/i,
      }),
    );

    expect(createWishlist).toHaveBeenCalledWith(2, "Theatre trips");

    expect(
      await screen.findByRole("heading", {
        level: 3,
        name: "Theatre trips",
      }),
    ).toBeInTheDocument();

    const status = screen.getByRole("status");

    expect(status).toHaveTextContent(/wishlist "Theatre trips" created/i);

    expect(screen.getByText(/wishlist "Theatre trips" created/i)).toHaveFocus();
  });

  it("shows an accessible error when wishlist creation fails", async () => {
    const user = userEvent.setup();

    createWishlist.mockRejectedValue(
      new Error(
        "We could not create the wishlist. Check your connection and try again",
      ),
    );

    render(<WishlistsPageClient />);

    await screen.findByText(/you do not have any wishlists yet/i);

    await user.type(
      screen.getByRole("textbox", {
        name: /wishlist name/i,
      }),
      "Theatre trips",
    );

    await user.click(
      screen.getByRole("button", {
        name: /create wishlist/i,
      }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /we could not create the wishlist/i,
    );
  });
});
