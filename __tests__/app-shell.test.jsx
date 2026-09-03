import { render, screen } from "@testing-library/react";
import Footer from "../src/components/layout/Footer";
import Header from "../src/components/layout/Header";
import SkipLink from "../src/components/ui/SkipLink";

describe("App shell", () => {
  it("renders a skip link to the main content", () => {
    render(<SkipLink />);

    const skipLink = screen.getByRole("link", {
      name: /skip to main content/i,
    });

    expect(skipLink).toHaveAttribute("href", "#main-content");
  });

  it("renders the site header and primary navigation", () => {
    render(<Header />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: /^main$/i }),
    ).toBeInTheDocument();
  });

  it("renders the site footer", () => {
    render(<Footer />);

    expect(screen.getByRole("contentinfo")).toHaveTextContent(
      /culture finder — find local cultural events/i,
    );
  });
});
