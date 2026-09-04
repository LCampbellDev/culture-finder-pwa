import { render, screen, within } from "@testing-library/react";
import WishlistList from "../src/components/wishlists/WishlistList";

const wishlists = [
  {
    wishlist_id: 4,
    user_id: 2,
    wishlist_title: "Summer events",
  },
  {
    wishlist_id: 5,
    user_id: 2,
    wishlist_title: "Theatre trips",
  },
];

describe("WishlistList", () => {
  it("renders an empty state when there are no wishlists", () => {
    render(<WishlistList wishlists={[]} />);

    expect(
      screen.getByText(/you do not have any wishlists yet/i),
    ).toBeInTheDocument();

    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("handles a missing wishlist collection safely", () => {
    render(<WishlistList />);

    expect(
      screen.getByText(/you do not have any wishlists yet/i),
    ).toBeInTheDocument();
  });

  it("renders the saved wishlists as a semantic list", () => {
    render(<WishlistList wishlists={wishlists} />);

    const list = screen.getByRole("list", {
      name: /saved wishlists/i,
    });

    const items = within(list).getAllByRole("listitem");

    expect(items).toHaveLength(2);

    expect(
      within(items[0]).getByRole("heading", {
        level: 3,
        name: "Summer events",
      }),
    ).toBeInTheDocument();

    expect(
      within(items[1]).getByRole("heading", {
        level: 3,
        name: "Theatre trips",
      }),
    ).toBeInTheDocument();
  });

  it("displays long wishlist names without changing their content", () => {
    const longTitle = "Accessible theatre and music events ".repeat(6).trim();

    render(
      <WishlistList
        wishlists={[
          {
            wishlist_id: 6,
            user_id: 2,
            wishlist_title: longTitle,
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", {
        level: 3,
        name: longTitle,
      }),
    ).toBeInTheDocument();
  });
});
