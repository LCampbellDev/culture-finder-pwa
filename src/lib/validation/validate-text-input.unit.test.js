import { validateTextInput } from "./validate-text-input";

describe("validateTextInput", () => {
  it("returns the trimmed value when all rules pass", () => {
    const passingRule = jest.fn().mockReturnValue(null);

    const result = validateTextInput("  Summer events  ", [passingRule]);

    expect(result).toEqual({
      value: "Summer events",
      error: null,
    });
  });

  it("runs rules in order", () => {
    const firstRule = jest.fn().mockReturnValue(null);
    const secondRule = jest.fn().mockReturnValue("Validation failed");

    validateTextInput("Summer events", [firstRule, secondRule]);

    expect(firstRule).toHaveBeenCalledTimes(1);
    expect(secondRule).toHaveBeenCalledTimes(1);

    expect(firstRule.mock.invocationCallOrder[0]).toBeLessThan(
      secondRule.mock.invocationCallOrder[0],
    );
  });

  it("returns the first validation error", () => {
    const firstRule = jest.fn().mockReturnValue("First error");
    const secondRule = jest.fn().mockReturnValue("Second error");

    const result = validateTextInput("Summer events", [
      firstRule,
      secondRule,
    ]);

    expect(result).toEqual({
      value: "Summer events",
      error: "First error",
    });
  });

  it("stops running rules after the first failure", () => {
    const failingRule = jest.fn().mockReturnValue("Validation failed");
    const laterRule = jest.fn().mockReturnValue(null);

    validateTextInput("Summer events", [failingRule, laterRule]);

    expect(failingRule).toHaveBeenCalledTimes(1);
    expect(laterRule).not.toHaveBeenCalled();
  });

  it("works with no validation rules", () => {
    expect(validateTextInput("  Summer events  ", [])).toEqual({
      value: "Summer events",
      error: null,
    });
  });

  it("throws when value is not a string", () => {
    expect(() => validateTextInput(123, [])).toThrow(TypeError);
  });

  it("throws when rules is not an array", () => {
    expect(() => validateTextInput("Summer events", null)).toThrow(TypeError);
  });
});