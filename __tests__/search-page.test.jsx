import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchPageClient from "../src/app/search/SearchPageClient";
import { searchEvents } from "../src/lib/api/events";

jest.mock("../src/lib/api/events", () => ({
  searchEvents: jest.fn(),
}));

describe("SearchPageClient", () => {
  beforeEach(() => {
    searchEvents.mockReset();
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
});
