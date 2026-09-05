import { fireEvent, render, screen } from "@testing-library/react";
import UpdateEventStatusForm from "./UpdateEventStatusForm";

it("displays the current status and available status options", () => {
  // Arrange
  render(
    <UpdateEventStatusForm
      wishlistEventId={8}
      eventName="Leeds Jazz Evening"
      currentStatus="Wishlist"
      onStatusUpdate={jest.fn()}
      isUpdating={false}
      errorMessage=""
      successMessage=""
    />,
  );

  // Act
  const statusSelect = screen.getByLabelText("Status");

  // Assert
  expect(statusSelect).toHaveValue("Wishlist");
  expect(screen.getByRole("option", { name: "Wishlist" })).toBeInTheDocument();
  expect(screen.getByRole("option", { name: "Booked" })).toBeInTheDocument();
  expect(
    screen.getByRole("option", { name: "Not Interested" }),
  ).toBeInTheDocument();
});

it("submits the selected status", () => {
  // Arrange
  const onStatusUpdate = jest.fn();

  render(
    <UpdateEventStatusForm
      wishlistEventId={8}
      eventName="Leeds Jazz Evening"
      currentStatus="Wishlist"
      onStatusUpdate={onStatusUpdate}
      isUpdating={false}
      errorMessage=""
      successMessage=""
    />,
  );

  // Act
  fireEvent.change(screen.getByLabelText("Status"), {
    target: { value: "Booked" },
  });

  fireEvent.click(screen.getByRole("button", { name: "Update status" }));

  // Assert
  expect(onStatusUpdate).toHaveBeenCalledWith(8, "Booked");
});

it("disables the status controls while updating", () => {
  // Arrange
  render(
    <UpdateEventStatusForm
      wishlistEventId={8}
      eventName="Leeds Jazz Evening"
      currentStatus="Wishlist"
      onStatusUpdate={jest.fn()}
      isUpdating={true}
      errorMessage=""
      successMessage=""
    />,
  );

  // Act
  const statusSelect = screen.getByLabelText("Status");
  const updateButton = screen.getByRole("button", { name: "Updating…" });

  // Assert
  expect(statusSelect).toBeDisabled();
  expect(updateButton).toBeDisabled();
});

it("displays an error message", () => {
  // Arrange
  render(
    <UpdateEventStatusForm
      wishlistEventId={8}
      eventName="Leeds Jazz Evening"
      currentStatus="Wishlist"
      onStatusUpdate={jest.fn()}
      isUpdating={false}
      errorMessage="Could not update event status"
      successMessage=""
    />,
  );

  // Act
  const errorMessage = screen.getByRole("alert");

  // Assert
  expect(errorMessage).toHaveTextContent("Could not update event status");
});

it("displays a success message", () => {
  // Arrange
  render(
    <UpdateEventStatusForm
      wishlistEventId={8}
      eventName="Leeds Jazz Evening"
      currentStatus="Booked"
      onStatusUpdate={jest.fn()}
      isUpdating={false}
      errorMessage=""
      successMessage="Status updated to Booked"
    />,
  );

  // Act
  const successMessage = screen.getByRole("status");

  // Assert
  expect(successMessage).toHaveTextContent("Status updated to Booked");
});
