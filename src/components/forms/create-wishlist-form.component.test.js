import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateWishlistForm from "./CreateWishlistForm";

/*
Component tests cover:
- Form accessibility and required wishlist name field
- Empty input error, accessibility attributes and focus management
- Maximum wishlist title length validation
- Unsupported Unicode character validation
- Trimming before successful submission
- Clears the wishlist name after successful creation
- Disabled submission while loading
*/

describe("CreateWishlistForm", () => {
  it("renders the required wishlist-name field and submit button", () => {
    // Arrange
    render(<CreateWishlistForm onWishlistSubmit={jest.fn()} />);

    // Assert
    expect(
      screen.getByRole("form", { name: /create wishlist/i }),
    ).toBeInTheDocument();

    const input = screen.getByRole("textbox", {
      name: /wishlist name/i,
    });

    expect(input).toBeRequired();
    expect(input).toHaveAttribute("maxlength", "255");

    expect(
      screen.getByRole("button", { name: /create wishlist/i }),
    ).toBeInTheDocument();
  });

  it("shows an error and focuses the empty wishlist-name field", async () => {
    // Arrange
    const user = userEvent.setup();

    render(<CreateWishlistForm onWishlistSubmit={jest.fn()} />);

    const input = screen.getByRole("textbox", {
      name: /wishlist name/i,
    });

    // Act
    await user.click(
      screen.getByRole("button", {
        name: /create wishlist/i,
      }),
    );

    // Assert
    const error = screen.getByText(/enter a wishlist name/i);

    expect(error).toHaveTextContent("Error: Enter a wishlist name");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute(
      "aria-describedby",
      "wishlist-title-hint wishlist-title-error",
    );
    expect(input).toHaveFocus();
  });

  it("rejects a wishlist name longer than 255 characters", async () => {
    // Arrange
    const user = userEvent.setup();

    render(<CreateWishlistForm onWishlistSubmit={jest.fn()} />);

    const input = screen.getByRole("textbox", {
      name: /wishlist name/i,
    });

    fireEvent.change(input, {
      target: {
        value: "x".repeat(256),
      },
    });

    // Act
    await user.click(screen.getByRole("button", { name: /create wishlist/i }));

    const error = screen.getByText(
      /wishlist name must be 255 characters or fewer/i,
    );

    // Assert
    expect(error).toHaveTextContent(
      "Error: Wishlist name must be 255 characters or fewer",
    );
    expect(input).toHaveFocus();
  });

  it("rejects unsupported characters", async () => {
    // Arrange
    const user = userEvent.setup();

    render(<CreateWishlistForm onWishlistSubmit={jest.fn()} />);

    const input = screen.getByRole("textbox", {
      name: /wishlist name/i,
    });

    // Act
    await user.type(input, "Music\u0007events");

    await user.click(
      screen.getByRole("button", {
        name: /create wishlist/i,
      }),
    );

    const error = screen.getByText(
      /wishlist name contains unsupported characters/i,
    );

    // Assert
    expect(error).toHaveTextContent(
      "Error: Wishlist name contains unsupported characters",
    );
    expect(input).toHaveFocus();
  });

  it("submits a trimmed wishlist name", async () => {
  // Arrange
  const user = userEvent.setup();
  const onWishlistSubmit = jest.fn().mockResolvedValue(undefined);

  render(<CreateWishlistForm onWishlistSubmit={onWishlistSubmit} />);

  // Act
  await user.type(
    screen.getByRole("textbox", {
      name: /wishlist name/i,
    }),
    "  Theatre trips  ",
  );

  await user.click(
    screen.getByRole("button", {
      name: /create wishlist/i,
    }),
  );

  // Assert
  expect(onWishlistSubmit).toHaveBeenCalledWith("Theatre trips");
});

it("clears the wishlist name after successful creation", async () => {
  // Arrange
  const user = userEvent.setup();
  const onWishlistSubmit = jest.fn().mockResolvedValue(true);

  render(<CreateWishlistForm onWishlistSubmit={onWishlistSubmit} />);

    const input = screen.getByRole("textbox", {
    name: /wishlist name/i,
  });

  // Act
  await user.type(input, "Theatre trips");

  await user.click(
    screen.getByRole("button", {
      name: /create wishlist/i,
    }),
  );

  // Assert
  expect(input).toHaveValue("");
});

  it("shows a loading state and prevents repeat submission", () => {
    //Arrange
    render(<CreateWishlistForm onWishlistSubmit={jest.fn()} isLoading />);

    // Assert
    expect(
      screen.getByRole("button", {
        name: /creating wishlist/i,
      }),
    ).toBeDisabled();
  });
});
