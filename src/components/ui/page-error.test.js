import { render, screen, waitFor } from "@testing-library/react";
import PageError from "./PageError";

describe("PageError", () => {
  it("renders nothing when there is no error message", () => {
    // Arrange
    const { container } = render(<PageError message="" />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a labelled page error and moves focus to it", async () => {
    // Arrange
    const { rerender } = render(<PageError message="" />);

    // Act
    rerender(<PageError message="We could not complete the request" />);

    const error = screen.getByRole("alert");

    // Assert
    expect(error).toHaveTextContent("Error: We could not complete the request");
    expect(error).toHaveAttribute("tabindex", "-1");

    await waitFor(() => {
      expect(error).toHaveFocus();
    });
  });
});
