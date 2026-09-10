import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DemoProfileForm from "./DemoProfileForm";

/*
Component tests cover:
- Form accessibility and required username field
- Empty input error, accessibility attributes and focus management
- Maximum username length validation
- Unsupported Unicode character validation
- Trimming before successful submission
- Disabled submission while loading
*/

describe("DemoProfileForm", () => {
  it("renders a named form with a required username field", () => {
    // Arrange
    render(<DemoProfileForm onProfileSubmit={jest.fn()} />);

    // Assert
    expect(
      screen.getByRole("form", { name: /demo profile/i }),
    ).toBeInTheDocument();

    const input = screen.getByRole("textbox", {
      name: /demo username/i,
    });

    expect(input).toBeRequired();
    expect(input).toHaveAttribute("maxlength", "50");
  });

  it("shows an error and focuses an empty username field", async () => {
    // Arrange
    const user = userEvent.setup();
    const onProfileSubmit = jest.fn();

    render(<DemoProfileForm onProfileSubmit={onProfileSubmit} />);

    // Act
    await user.click(
      screen.getByRole("button", {
        name: /create or continue with demo profile/i,
      }),
    );

    const input = screen.getByRole("textbox", {
      name: /demo username/i,
    });

    const error = screen.getByText(/enter a demo username/i);

    // Assert
    expect(error).toHaveTextContent("Error: Enter a demo username");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute(
      "aria-describedby",
      "demo-username-hint demo-username-error",
    );
    expect(input).toHaveFocus();
    expect(onProfileSubmit).not.toHaveBeenCalled();
  });

  it("rejects an overlong username", async () => {
    // Arrange
    const user = userEvent.setup();
    const onProfileSubmit = jest.fn();

    render(<DemoProfileForm onProfileSubmit={onProfileSubmit} />);

    const input = screen.getByRole("textbox", {
      name: /demo username/i,
    });

    fireEvent.change(input, {
      target: {
        value: "a".repeat(51),
      },
    });

    // Act
    await user.click(
      screen.getByRole("button", {
        name: /create or continue with demo profile/i,
      }),
    );

    // Assert
    expect(
      screen.getByText(/demo username must be 50 characters or fewer/i),
    ).toHaveTextContent("Error: Demo username must be 50 characters or fewer");

    expect(onProfileSubmit).not.toHaveBeenCalled();
  });

  it("rejects unsupported characters", async () => {
    // Arrange
    const user = userEvent.setup();
    const onProfileSubmit = jest.fn();

    render(<DemoProfileForm onProfileSubmit={onProfileSubmit} />);

    fireEvent.change(
      screen.getByRole("textbox", {
        name: /demo username/i,
      }),
      {
        target: {
          value: "demo\u200Busername",
        },
      },
    );

    // Act
    await user.click(
      screen.getByRole("button", {
        name: /create or continue with demo profile/i,
      }),
    );

    // Assert
    expect(
      screen.getByText(/demo username contains unsupported characters/i),
    ).toHaveTextContent("Error: Demo username contains unsupported characters");

    expect(onProfileSubmit).not.toHaveBeenCalled();
  });

  it("submits a trimmed valid username", async () => {
    // Arrange
    const user = userEvent.setup();
    const onProfileSubmit = jest.fn();

    render(<DemoProfileForm onProfileSubmit={onProfileSubmit} />);

    // Act
    await user.type(
      screen.getByRole("textbox", {
        name: /demo username/i,
      }),
      "  demo-reviewer  ",
    );

    await user.click(
      screen.getByRole("button", {
        name: /create or continue with demo profile/i,
      }),
    );

    // Assert
    expect(onProfileSubmit).toHaveBeenCalledWith("demo-reviewer");
  });

  it("disables repeat submission while loading", () => {
    // Arrange
    render(<DemoProfileForm onProfileSubmit={jest.fn()} isLoading />);

    // Assert
    expect(
      screen.getByRole("button", {
        name: /creating demo profile/i,
      }),
    ).toBeDisabled();
  });
});
