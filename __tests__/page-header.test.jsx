import { render, screen } from "@testing-library/react";
import PageHeader from "../src/components/ui/PageHeader";

describe("PageHeader", () => {
  it("renders the page title as a level-one heading", () => {
    render(<PageHeader title="Search events" />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Search events",
      }),
    ).toBeInTheDocument();
  });

  it("renders an optional description", () => {
    render(
      <PageHeader
        title="Search events"
        description="Search for events near you"
      />,
    );

    expect(screen.getByText("Search for events near you")).toBeInTheDocument();
  });

  it("does not render an empty paragraph without a description", () => {
    const { container } = render(<PageHeader title="Search events" />);

    expect(container.querySelector("p")).not.toBeInTheDocument();
  });
});

