import { render, screen } from "@testing-library/react";
import EventCard from "../src/components/events/EventCard";

const completeEvent = {
  event_id: 1,
  event_name: "Leeds Jazz Evening",
  event_date: "2026-08-14",
  event_time: "19:30:00",
  venue_name: "Leeds Town Hall",
  category: "Music",
  city: "Leeds",
  country: "Great Britain",
  event_url: "https://example.com/leeds-jazz",
  accessibility: "Wheelchair-accessible entrance",
};

describe("EventCard", () => {
 it("renders the available event information with semantic structure", () => {
  render(<EventCard event={completeEvent} />);

  const heading = screen.getByRole("heading", {
    level: 2,
    name: "Leeds Jazz Evening",
  });

  const details = screen.getByLabelText(
    "Event details for Leeds Jazz Evening",
  );

  expect(screen.getByRole("article")).toBeInTheDocument();

  expect(heading).toBeInTheDocument();
  expect(heading).toHaveAttribute("tabindex", "0");

  expect(details).toHaveAttribute("tabindex", "0");

  expect(screen.getByText("Music")).toBeInTheDocument();
  expect(screen.getByText("14 August 2026")).toBeInTheDocument();
  expect(screen.getByText("19:30")).toBeInTheDocument();

  expect(
    screen.getByText("Leeds Town Hall, Leeds, Great Britain"),
  ).toBeInTheDocument();

  expect(
    screen.getByText("Wheelchair-accessible entrance"),
  ).toBeInTheDocument();
});

  it("renders a safe external event link", () => {
    render(<EventCard event={completeEvent} />);

    const link = screen.getByRole("link", {
      name: /view and book tickets for Leeds Jazz Evening on Ticketmaster/i,
});

    expect(link).toHaveAttribute(
      "href",
      "https://example.com/leeds-jazz",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("handles missing event information safely", () => {
    render(<EventCard event={{}} />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Event details unavailable",
      }),
    ).toBeInTheDocument();

    expect(screen.getAllByText("To be confirmed")).toHaveLength(3);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("does not present the backend placeholder as accessibility information", () => {
    render(
      <EventCard
        event={{
          ...completeEvent,
          accessibility: "No specific details provided",
        }}
      />,
    );

    expect(
      screen.queryByText("Accessibility information"),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("No specific details provided"),
    ).not.toBeInTheDocument();
  });

  it("does not render unsafe event URLs", () => {
    render(
      <EventCard
        event={{
          ...completeEvent,
          event_url: "javascript:alert('unsafe')",
        }}
      />,
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});