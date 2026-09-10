import { render, screen } from "@testing-library/react";
import FieldError from "./FieldError";

describe("FieldError", () => {
  it("renders nothing when there is no error message", () => {
    // Arrange
    const { container } = render(<FieldError id="example-error" message="" />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a labelled error without making it a focus target", () => {
    // Arrange
    render(
      <FieldError
        id="example-error"
        message="Enter the required information"
      />,
    );

    const error = screen.getByText(/enter the required information/i);

    // Assert
    expect(error).toHaveAttribute("id", "example-error");
    expect(error).toHaveTextContent("Error: Enter the required information");
    expect(error).not.toHaveAttribute("role", "alert");
    expect(error).not.toHaveAttribute("tabindex");
    expect(error).not.toHaveFocus();
  });
});
