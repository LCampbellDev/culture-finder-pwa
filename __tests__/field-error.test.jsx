import { render, screen} from "@testing-library/react";
import FieldError from "../src/components/forms/FieldError";

describe("FieldError", () => {
  it("renders nothing when there is no error message", () => {
    const { container } = render(<FieldError id="example-error" message="" />);

    expect(container).toBeEmptyDOMElement();
  });

it("renders a labelled error without making it a focus target", () => {
    render(
      <FieldError
        id="example-error"
        message="Enter the required information"
      />,
    );

    const error = screen.getByText(/enter the required information/i);

    expect(error).toHaveAttribute("id", "example-error");
    expect(error).toHaveTextContent("Error: Enter the required information");
    expect(error).not.toHaveAttribute("role", "alert");
    expect(error).not.toHaveAttribute("tabindex");
    expect(error).not.toHaveFocus();
  });
});

