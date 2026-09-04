import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchPageClient from "./SearchPageClient";
import { searchEvents } from "../../lib/api/events";
import { useDemoProfile } from "../../context/DemoProfileContext";
import { addEventToWishlist, getUserWishlists } from "../../lib/api/wishlists";

jest.mock("../../lib/api/events", () => ({
  searchEvents: jest.fn(),
}));

jest.mock("../../context/DemoProfileContext", () => ({
  useDemoProfile: jest.fn(),
}));

jest.mock("../../lib/api/wishlists", () => ({
  addEventToWishlist: jest.fn(),
  getUserWishlists: jest.fn(),
}));

const activeProfile = {
  userId: 2,
  username: "Demo explorer",
};

const wishlists = [
  {
    wishlist_id: 5,
    wishlist_title: "Summer events",
  },
];

describe("SearchPageClient", () => {
  beforeEach(() => {
    searchEvents.mockReset();
    addEventToWishlist.mockReset();
    getUserWishlists.mockReset();

    useDemoProfile.mockReturnValue({
      profile: activeProfile,
      isProfileReady: true,
    });

    getUserWishlists.mockResolvedValue(wishlists);
  });

  it("searches using the submitted city and category", async () => {
    const user = userEvent.setup();

    searchEvents.mockResolvedValue({
      city: "Leeds",
      count: 2,
      events: [
        {
          event_id: 1,
          event_name: "Leeds Jazz Evening",
        },
        {
          event_id: 2,
          event_name: "Leeds Folk Festival",
        },
      ],
    });

    render(<SearchPageClient />);

    await user.type(
      screen.getByRole("textbox", { name: /city or location/i }),
      "Leeds",
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: /category/i }),
      "Music",
    );

    await user.click(screen.getByRole("button", { name: /search events/i }));

    expect(searchEvents).toHaveBeenCalledWith("Leeds", "Music");

    expect(
      await screen.findByText("Found 2 events in Leeds."),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("region", { name: /event results/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Leeds Jazz Evening",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Leeds Folk Festival",
      }),
    ).toBeInTheDocument();
  });

  it("shows a helpful message when no events are found", async () => {
    const user = userEvent.setup();

    searchEvents.mockResolvedValue({
      city: "York",
      count: 0,
      events: [],
    });

    render(<SearchPageClient />);

    await user.type(
      screen.getByRole("textbox", { name: /city or location/i }),
      "York",
    );

    await user.click(screen.getByRole("button", { name: /search events/i }));

    expect(
      await screen.findByText(
        "No events found in York. Try another city or category.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("region", { name: /event results/i }),
    ).not.toBeInTheDocument();
  });

  it("shows an accessible error when the search fails", async () => {
    const user = userEvent.setup();

    searchEvents.mockRejectedValue(
      new Error(
        "We could not search for events. Check your connection and try again",
      ),
    );

    render(<SearchPageClient />);

    await user.type(
      screen.getByRole("textbox", { name: /city or location/i }),
      "Leeds",
    );

    await user.click(screen.getByRole("button", { name: /search events/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "We could not search for events. Check your connection and try again",
    );

    expect(
      screen.queryByRole("region", { name: /event results/i }),
    ).not.toBeInTheDocument();
  });

  it("loads the active profile wishlists and renders a save form for each event", async () => {
    const user = userEvent.setup();

    searchEvents.mockResolvedValue({
      city: "Leeds",
      count: 1,
      events: [
        {
          event_id: 12,
          event_name: "Leeds Jazz Evening",
        },
      ],
    });

    render(<SearchPageClient />);

    await user.type(
      screen.getByRole("textbox", {
        name: /city or location/i,
      }),
      "Leeds",
    );

    await user.click(
      screen.getByRole("button", {
        name: /search events/i,
      }),
    );

    await waitFor(() => {
      expect(getUserWishlists).toHaveBeenCalledWith(2);
    });

    expect(
      await screen.findByRole("form", {
        name: /save Leeds Jazz Evening to a wishlist/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Summer events",
      }),
    ).toHaveValue("5");
  });

  it("saves an event to the selected wishlist", async () => {
    const user = userEvent.setup();

    searchEvents.mockResolvedValue({
      city: "Leeds",
      count: 1,
      events: [
        {
          event_id: 12,
          event_name: "Leeds Jazz Evening",
        },
      ],
    });

    addEventToWishlist.mockResolvedValue({
      wishlist_event_id: 20,
      wishlist_id: 5,
      event_id: 12,
    });

    render(<SearchPageClient />);

    await user.type(
      screen.getByRole("textbox", {
        name: /city or location/i,
      }),
      "Leeds",
    );

    await user.click(
      screen.getByRole("button", {
        name: /search events/i,
      }),
    );

    await screen.findByRole("form", {
      name: /save Leeds Jazz Evening to a wishlist/i,
    });

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: /wishlist for Leeds Jazz Evening/i,
      }),
      "5",
    );

    await user.click(
      screen.getByRole("button", {
        name: /save to wishlist: Leeds Jazz Evening/i,
      }),
    );

    await waitFor(() => {
      expect(addEventToWishlist).toHaveBeenCalledWith(5, 12);
    });
  });

  it("shows a success message after saving an event", async () => {
    const user = userEvent.setup();

    searchEvents.mockResolvedValue({
      city: "Leeds",
      count: 1,
      events: [
        {
          event_id: 12,
          event_name: "Leeds Jazz Evening",
        },
      ],
    });

    addEventToWishlist.mockResolvedValue({
      wishlist_event_id: 20,
      wishlist_id: 5,
      event_id: 12,
    });

    render(<SearchPageClient />);

    await user.type(
      screen.getByRole("textbox", {
        name: /city or location/i,
      }),
      "Leeds",
    );

    await user.click(
      screen.getByRole("button", {
        name: /search events/i,
      }),
    );

    await user.selectOptions(
      await screen.findByRole("combobox", {
        name: /wishlist for Leeds Jazz Evening/i,
      }),
      "5",
    );

    await user.click(
      screen.getByRole("button", {
        name: /save to wishlist: Leeds Jazz Evening/i,
      }),
    );

    expect(
      await screen.findByText("Event saved to your wishlist"),
    ).toBeInTheDocument();
  });

  it("shows an accessible error when saving an event fails", async () => {
    const user = userEvent.setup();

    searchEvents.mockResolvedValue({
      city: "Leeds",
      count: 1,
      events: [
        {
          event_id: 12,
          event_name: "Leeds Jazz Evening",
        },
      ],
    });

    addEventToWishlist.mockRejectedValue(
      new Error(
        "We could not save the event. Check your connection and try again",
      ),
    );

    render(<SearchPageClient />);

    await user.type(
      screen.getByRole("textbox", {
        name: /city or location/i,
      }),
      "Leeds",
    );

    await user.click(
      screen.getByRole("button", {
        name: /search events/i,
      }),
    );

    await user.selectOptions(
      await screen.findByRole("combobox", {
        name: /wishlist for Leeds Jazz Evening/i,
      }),
      "5",
    );

    await user.click(
      screen.getByRole("button", {
        name: /save to wishlist: Leeds Jazz Evening/i,
      }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "We could not save the event. Check your connection and try again",
    );
  });
});
