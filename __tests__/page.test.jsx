import { render, screen } from "@testing-library/react";
import Home from "../src/app/page";

describe("Home", () => {
  it("renders the default home page heading", () => {
    render(<Home />);

    const heading = screen.getByRole("heading", {
      name: /to get started, edit the page\.js file/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
