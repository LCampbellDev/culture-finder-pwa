import {
  maxLength,
  noUnsupportedUnicodeCharacters,
  nonEmptyText,
} from "./text-validation-rules";

function createContext(value) {
  return {
    value,
    trimmedValue: value.trim(),
  };
}

describe("nonEmptyText", () => {
  const rule = nonEmptyText("Enter a value");

  it("returns an error for an empty value", () => {
    expect(rule(createContext(""))).toBe("Enter a value");
  });

  it("returns an error for whitespace-only input", () => {
    expect(rule(createContext("   "))).toBe("Enter a value");
  });

  it("returns null for a non-empty value", () => {
    expect(rule(createContext("Larna"))).toBeNull();
  });
});

describe("maxLength", () => {
  const rule = maxLength(5, "Value is too long");

  it("returns null when the value is below the maximum length", () => {
    expect(rule(createContext("Test"))).toBeNull();
  });

  it("returns null when the value is exactly the maximum length", () => {
    expect(rule(createContext("Tests"))).toBeNull();
  });

  it("returns an error when the value exceeds the maximum length", () => {
    expect(rule(createContext("Testing"))).toBe("Value is too long");
  });

  it("checks the trimmed value", () => {
    expect(rule(createContext("  Tests  "))).toBeNull();
  });

  it("throws when maximum length is invalid", () => {
    expect(() => maxLength(-1, "Invalid")).toThrow(TypeError);
  });
});

describe("noUnsupportedUnicodeCharacters", () => {
  const rule = noUnsupportedUnicodeCharacters(
    "Value contains unsupported characters",
  );

  it("allows ordinary text", () => {
    expect(rule(createContext("Summer events"))).toBeNull();
  });

  it("allows ordinary spaces", () => {
    expect(rule(createContext("Summer events"))).toBeNull();
  });

  it("allows accented characters", () => {
    expect(rule(createContext("Café français"))).toBeNull();
  });

  it("allows punctuation", () => {
    expect(rule(createContext("Music & Theatre!"))).toBeNull();
  });

  it("rejects a tab character", () => {
    expect(rule(createContext("Summer\tevents"))).toBe(
      "Value contains unsupported characters",
    );
  });

  it("rejects a newline character", () => {
    expect(rule(createContext("Summer\nevents"))).toBe(
      "Value contains unsupported characters",
    );
  });

  it("rejects a non-breaking space", () => {
    expect(rule(createContext("Summer\u00A0events"))).toBe(
      "Value contains unsupported characters",
    );
  });

  it("detects unsupported whitespace before trimming", () => {
    expect(rule(createContext("\u00A0Summer events"))).toBe(
      "Value contains unsupported characters",
    );
  });
});
