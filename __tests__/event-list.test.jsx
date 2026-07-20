import { render, screen } from "@testing-library/react";
import EventList from "../src/components/events/EventList";

const events = [
  {
    event_id: 1,
    event_name: "Leeds Jazz Evening",
    event_date: "2026-08-14",
    event_time: "19:30:00",
    city: "Leeds",
  },
  {
    event_id: 2,
    event_name: "Leeds Film Festival",
    event_date: "2026-09-02",
    event_time: "18:00:00",
    city: "Leeds",
  },
];

describe("EventList", () => {
  it("renders events as a named list", () => {
    render(<EventList events={events} />);

    expect(
      screen.getByRole("region", { name: /event results/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);

    expect(
      screen.getByRole("heading", { name: "Leeds Jazz Evening" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Leeds Film Festival" }),
    ).toBeInTheDocument();
  });

  it("renders nothing when there are no events", () => {
    const { container } = render(<EventList events={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when events are unavailable", () => {
    const { container } = render(<EventList />);

    expect(container).toBeEmptyDOMElement();
  });
});
