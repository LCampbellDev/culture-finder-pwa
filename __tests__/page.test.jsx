import { render, screen } from "@testing-library/react";
import Home from "../src/app/page";

describe("Home", () => {
  it("renders the Culture Finder home page heading", () => {
    render(<Home />);

    const heading = screen.getByRole("heading", {
      name: /find cultural events near you/i,
    });

    expect(heading).toBeInTheDocument();
  });
});

