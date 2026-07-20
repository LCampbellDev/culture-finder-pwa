import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DemoProfileForm from "../src/components/forms/DemoProfileForm";

describe("DemoProfileForm", () => {
  it("renders a named form with a required username field", () => {
    render(<DemoProfileForm onProfileSubmit={jest.fn()} />);

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
    const user = userEvent.setup();
    const onProfileSubmit = jest.fn();

    render(<DemoProfileForm onProfileSubmit={onProfileSubmit} />);

    await user.click(
      screen.getByRole("button", {
        name: /create or continue with demo profile/i,
      }),
    );

    const input = screen.getByRole("textbox", {
      name: /demo username/i,
    });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter a demo username",
    );

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveFocus();
    expect(onProfileSubmit).not.toHaveBeenCalled();
  });

  it("rejects an overlong username", async () => {
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

    await user.click(
      screen.getByRole("button", {
        name: /create or continue with demo profile/i,
      }),
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Demo username must be 50 characters or fewer",
    );

    expect(onProfileSubmit).not.toHaveBeenCalled();
  });

  it("rejects unsupported characters", async () => {
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

    await user.click(
      screen.getByRole("button", {
        name: /create or continue with demo profile/i,
      }),
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Demo username contains unsupported characters",
    );

    expect(onProfileSubmit).not.toHaveBeenCalled();
  });

  it("submits a trimmed valid username", async () => {
    const user = userEvent.setup();
    const onProfileSubmit = jest.fn();

    render(<DemoProfileForm onProfileSubmit={onProfileSubmit} />);

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

    expect(onProfileSubmit).toHaveBeenCalledWith("demo-reviewer");
  });

  it("disables repeat submission while loading", () => {
    render(<DemoProfileForm onProfileSubmit={jest.fn()} isLoading />);

    expect(
      screen.getByRole("button", {
        name: /creating demo profile/i,
      }),
    ).toBeDisabled();
  });
});
