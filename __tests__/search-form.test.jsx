import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchForm from "../src/components/forms/SearchForm";

describe("SearchForm", () => {
  it("renders the search fields and submit button", () => {
    render(<SearchForm onSearch={jest.fn()} />);

    expect(
      screen.getByRole("form", { name: /event search/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox", { name: /city or location/i }),
    ).toBeRequired();

    expect(
      screen.getByRole("combobox", { name: /category/i }),
    ).toHaveValue("");

    expect(
      screen.getByRole("button", { name: /search events/i }),
    ).toBeEnabled();
  });

  it("shows an error and focuses the city field when it is empty", async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();

    render(<SearchForm onSearch={onSearch} />);

    await user.click(
      screen.getByRole("button", { name: /search events/i }),
    );

    const cityInput = screen.getByRole("textbox", {
      name: /city or location/i,
    });

    expect(
      screen.getByRole("alert"),
    ).toHaveTextContent("Enter a city or location");

    expect(cityInput).toHaveAttribute("aria-invalid", "true");
    expect(cityInput).toHaveFocus();
    expect(onSearch).not.toHaveBeenCalled();
  });

  it("submits the trimmed city and selected category", async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();

    render(<SearchForm onSearch={onSearch} />);

    await user.type(
      screen.getByRole("textbox", { name: /city or location/i }),
      "  Leeds  ",
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: /category/i }),
      "Music",
    );

    await user.click(
      screen.getByRole("button", { name: /search events/i }),
    );

    expect(onSearch).toHaveBeenCalledWith("Leeds", "Music");
  });

  it("shows the loading state and disables repeat submission", () => {
    render(<SearchForm onSearch={jest.fn()} isLoading />);

    expect(
      screen.getByRole("button", { name: /searching/i }),
    ).toBeDisabled();
  });
});