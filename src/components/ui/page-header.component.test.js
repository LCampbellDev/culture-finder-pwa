import { render, screen } from "@testing-library/react";
import PageHeader from "./PageHeader";

describe("PageHeader", () => {
  it("renders the page title as a level-one heading", () => {
    // Arrange
    render(<PageHeader title="Search events" />);

    // Assert
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Search events",
      }),
    ).toBeInTheDocument();
  });

  it("renders an optional description", () => {
    // Arrange
    render(
      <PageHeader
        title="Search events"
        description="Search for events near you"
      />,
    );

    // Assert
    expect(screen.getByText("Search for events near you")).toBeInTheDocument();
  });

  it("does not render an empty paragraph without a description", () => {
    // Arrange
    const { container } = render(<PageHeader title="Search events" />);

    // Assert
    expect(container.querySelector("p")).not.toBeInTheDocument();
  });
});
