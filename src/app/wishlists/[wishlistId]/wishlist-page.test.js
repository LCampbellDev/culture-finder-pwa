import { render, screen, waitFor } from "@testing-library/react";
import WishlistPageClient from "./WishlistPageClient";
import { useDemoProfile } from "../../../context/DemoProfileContext";
import {
  getUserWishlists,
  getWishlistEvents,
} from "../../../lib/api/wishlists";

jest.mock("../../../context/DemoProfileContext", () => ({
  useDemoProfile: jest.fn(),
}));

jest.mock("../../../lib/api/wishlists", () => ({
  getUserWishlists: jest.fn(),
  getWishlistEvents: jest.fn(),
}));

describe("Wishlist page", () => {
  beforeEach(() => {
    useDemoProfile.mockReturnValue({
      profile: {
        userId: 2,
        username: "Demo explorer",
      },
      isProfileReady: true,
    });

    getUserWishlists.mockResolvedValue([
      {
        wishlist_id: 5,
        user_id: 2,
        wishlist_title: "Summer events",
      },
    ]);

    getWishlistEvents.mockResolvedValue([]);
  });

  
    it("renders the selected wishlist title", async () => {
        // Arrange
        const wishlistId = "5";

        // Act
        render(<WishlistPageClient wishlistId={wishlistId} />);

        // Assert
        expect(
            await screen.findByRole("heading", {
            level: 1,
            name: "Summer events",
            }),
        ).toBeInTheDocument();

        await waitFor(() => {
            expect(getWishlistEvents).toHaveBeenCalledWith(5);
    });
});

    it("shows a message when the wishlist has no saved events", async () => {
        // Arrange
        const wishlistId = "5";

        // Act
        render(<WishlistPageClient wishlistId={wishlistId} />);

        // Assert
        expect(
            await screen.findByText(/this wishlist does not have any saved events yet/i),
        ).toBeInTheDocument();
    });

    it("renders events saved to the wishlist", async () => {
        // Arrange
        const wishlistId = "5";

        getWishlistEvents.mockResolvedValue([
            {
            wishlist_event_id: 8,
            event_name: "Leeds Jazz Evening",
            event_date: "2026-09-20",
            event_time: "19:30:00",
            venue_name: "Leeds Town Hall",
            city: "Leeds",
            category: "Music",
            status: "Wishlist",
            },
        ]);

        // Act
        render(<WishlistPageClient wishlistId={wishlistId} />);

        // Assert
        expect(
            await screen.findByRole("heading", {
            name: "Leeds Jazz Evening",
            }),
        ).toBeInTheDocument();
    });
});
