import { render, screen } from "@testing-library/react";
import Home from "../src/app/page";
import { DemoProfileProvider } from "../src/context/DemoProfileContext";

describe("Home", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the Culture Finder home page heading", () => {
    render(
      <DemoProfileProvider>
        <Home />
      </DemoProfileProvider>,
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /find cultural events near you/i,
      }),
    ).toBeInTheDocument();
  });
});
