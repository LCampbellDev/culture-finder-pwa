import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchForm from "./SearchForm";

describe("SearchForm", () => {
  it("renders the search fields and submit button", () => {
    // Arrange
    render(<SearchForm onSearch={jest.fn()} />);

    // Assert
    expect(
      screen.getByRole("form", { name: /event search/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: /city or location/i }),
    ).toBeRequired();

    expect(screen.getByRole("combobox", { name: /category/i })).toHaveValue("");

    expect(
      screen.getByRole("button", { name: /search events/i }),
    ).toBeEnabled();
  });

  it("shows an error and focuses the empty city field", async () => {
    // Arrange
    const user = userEvent.setup();
    const onSearch = jest.fn();

    render(<SearchForm onSearch={onSearch} />);

    // Act
    await user.click(screen.getByRole("button", { name: /search events/i }));

    const cityInput = screen.getByRole("textbox", {
      name: /city or location/i,
    });

    const error = screen.getByText(/enter a city or location/i);

    // Assert
    expect(error).toHaveTextContent("Error: Enter a city or location");
    expect(cityInput).toHaveAttribute("aria-invalid", "true");
    expect(cityInput).toHaveAttribute(
      "aria-describedby",
      "city-hint city-error",
    );
    expect(cityInput).toHaveFocus();
    expect(onSearch).not.toHaveBeenCalled();

    /* TODO: split tab-order check into separate test */
    // Act
    await user.tab();

    // Assert
    expect(screen.getByRole("combobox", { name: /category/i })).toHaveFocus();
  });

  it("submits the trimmed city and selected category", async () => {
    // Arrange
    const user = userEvent.setup();
    const onSearch = jest.fn();

    render(<SearchForm onSearch={onSearch} />);

    // Act
    await user.type(
      screen.getByRole("textbox", { name: /city or location/i }),
      "  Leeds  ",
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: /category/i }),
      "Music",
    );

    await user.click(screen.getByRole("button", { name: /search events/i }));

    // Assert
    expect(onSearch).toHaveBeenCalledWith("Leeds", "Music");
  });

  it("shows the loading state and disables repeat submission", () => {
    // Arrange
    render(<SearchForm onSearch={jest.fn()} isLoading />);

    // Assert
    expect(screen.getByRole("button", { name: /searching/i })).toBeDisabled();
  });
});
