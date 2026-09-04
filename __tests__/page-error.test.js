import { render, screen, waitFor } from "@testing-library/react";
import PageError from "../src/components/ui/PageError";

describe("PageError", () => {
  it("renders nothing when there is no error message", () => {
    const { container } = render(<PageError message="" />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders a labelled page error and moves focus to it", async () => {
    const { rerender } = render(<PageError message="" />);

    rerender(<PageError message="We could not complete the request" />);

    const error = screen.getByRole("alert");

    expect(error).toHaveTextContent("Error: We could not complete the request");
    expect(error).toHaveAttribute("tabindex", "-1");

    await waitFor(() => {
      expect(error).toHaveFocus();
    });
  });
});
