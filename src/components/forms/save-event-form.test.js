import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SaveEventForm from "./SaveEventForm";

const wishlists = [
  {
    wishlist_id: 5,
    wishlist_title: "Summer events",
  },
  {
    wishlist_id: 8,
    wishlist_title: "Music nights",
  },
];

describe("SaveEventForm", () => {
  it("renders the available wishlists", () => {
    render(
      <SaveEventForm
        eventName="Leeds Jazz Evening"
        wishlists={wishlists}
        onSave={jest.fn()}
      />,
    );

    expect(
      screen.getByRole("form", {
        name: /save Leeds Jazz Evening to a wishlist/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("combobox", {
        name: /wishlist for Leeds Jazz Evening/i,
      }),
    ).toHaveValue("");

    expect(
      screen.getByRole("option", {
        name: "Summer events",
      }),
    ).toHaveValue("5");

    expect(
      screen.getByRole("option", {
        name: "Music nights",
      }),
    ).toHaveValue("8");
  });

  it("shows an error and focuses the selector when no wishlist is chosen", async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();

    render(
      <SaveEventForm
        eventName="Leeds Jazz Evening"
        wishlists={wishlists}
        onSave={onSave}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: /save to wishlist: Leeds Jazz Evening/i,
      }),
    );

    const selector = screen.getByRole("combobox", {
      name: /wishlist for Leeds Jazz Evening/i,
    });

    const error = screen.getByText("Choose a wishlist", {
      selector: "p",
    });

    expect(error).toHaveTextContent("Error: Choose a wishlist");
    expect(selector).toHaveAttribute("aria-invalid", "true");
    expect(selector).toHaveFocus();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("submits the selected wishlist as a number", async () => {
    const user = userEvent.setup();
    const onSave = jest.fn().mockResolvedValue(undefined);

    render(
      <SaveEventForm
        eventName="Leeds Jazz Evening"
        wishlists={wishlists}
        onSave={onSave}
      />,
    );

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: /wishlist for Leeds Jazz Evening/i,
      }),
      "8",
    );

    await user.click(
      screen.getByRole("button", {
        name: /save to wishlist: Leeds Jazz Evening/i,
      }),
    );

    expect(onSave).toHaveBeenCalledWith(8);
  });

  it("disables repeat submission while saving", () => {
    render(
      <SaveEventForm
        eventName="Leeds Jazz Evening"
        wishlists={wishlists}
        onSave={jest.fn()}
        isSaving
      />,
    );

    expect(
      screen.getByRole("button", {
        name: /saving to wishlist: Leeds Jazz Evening/i,
      }),
    ).toBeDisabled();
  });

  it("announces a successful save without moving focus", () => {
    const { rerender } = render(
      <SaveEventForm
        eventName="Leeds Jazz Evening"
        wishlists={wishlists}
        onSave={jest.fn()}
      />,
    );

    const button = screen.getByRole("button", {
      name: /save to wishlist: Leeds Jazz Evening/i,
    });

    button.focus();

    rerender(
      <SaveEventForm
        eventName="Leeds Jazz Evening"
        wishlists={wishlists}
        onSave={jest.fn()}
        successMessage="Leeds Jazz Evening saved to Summer events"
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Leeds Jazz Evening saved to Summer events",
    );
    expect(button).toHaveFocus();
  });

  it("announces a save failure without moving focus", () => {
    const { rerender } = render(
      <SaveEventForm
        eventName="Leeds Jazz Evening"
        wishlists={wishlists}
        onSave={jest.fn()}
      />,
    );

    const button = screen.getByRole("button", {
      name: /save to wishlist: Leeds Jazz Evening/i,
    });

    button.focus();

    rerender(
      <SaveEventForm
        eventName="Leeds Jazz Evening"
        wishlists={wishlists}
        onSave={jest.fn()}
        errorMessage="We could not save the event. Try again"
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Error: We could not save the event. Try again",
    );
    expect(button).toHaveFocus();
  });
});
