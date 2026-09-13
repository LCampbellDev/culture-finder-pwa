import { isUnicodeControlOrSeparator } from "./unicode-character-detection";

describe("isUnicodeControlOrSeparator", () => {
  it("returns false for an ordinary letter", () => {
    expect(isUnicodeControlOrSeparator("a")).toBe(false);
  });

  it("returns false for an accented letter", () => {
    expect(isUnicodeControlOrSeparator("é")).toBe(false);
  });

  it("returns false for punctuation", () => {
    expect(isUnicodeControlOrSeparator("!")).toBe(false);
  });

  it("returns true for an ordinary space", () => {
    expect(isUnicodeControlOrSeparator(" ")).toBe(true);
  });

  it("returns true for a tab character", () => {
    expect(isUnicodeControlOrSeparator("\t")).toBe(true);
  });

  it("returns true for a newline character", () => {
    expect(isUnicodeControlOrSeparator("\n")).toBe(true);
  });

  it("returns true for a non-breaking space", () => {
    expect(isUnicodeControlOrSeparator("\u00A0")).toBe(true);
  });

  it("throws when given more than one character", () => {
    expect(() => isUnicodeControlOrSeparator("ab")).toThrow(TypeError);
  });

  it("throws when given a non-string value", () => {
    expect(() => isUnicodeControlOrSeparator(123)).toThrow(TypeError);
  });
});
