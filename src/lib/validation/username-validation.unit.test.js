import { MAX_USERNAME_LENGTH, validateUsername } from "./username-validation";

describe("username validation", () => {
  it("accepts a valid username", () => {
    // Act
    const result = validateUsername("demo-reviewer");

    // Assert
    expect(result).toEqual({
      value: "demo-reviewer",
      error: null,
    });
  });

  it("trims surrounding whitespace", () => {
    // Act
    const result = validateUsername("  demo-reviewer  ");

    // Assert
    expect(result).toEqual({
      value: "demo-reviewer",
      error: null,
    });
  });

  it("rejects an empty username", () => {
    // Act
    const result = validateUsername("   ");

    // Assert
    expect(result.error).toBe("Enter a demo username");
  });

  it("rejects a username longer than the maximum length", () => {
    // Arrange
    const username = "a".repeat(MAX_USERNAME_LENGTH + 1);

    // Act
    const result = validateUsername(username);

    // Assert
    expect(result.error).toBe("Demo username must be 50 characters or fewer");
  });

  it("rejects unsupported Unicode characters", () => {
    // Act
    const result = validateUsername("demo\treviewer");

    // Assert
    expect(result.error).toBe("Demo username contains unsupported characters");
  });
});

describe("username validation", () => {
  it("accepts a valid username", () => {
    // Act
    const result = validateUsername("demo-reviewer");

    // Assert
    expect(result).toEqual({
      value: "demo-reviewer",
      error: null,
    });
  });

  it("trims surrounding whitespace", () => {
    // Act
    const result = validateUsername("  demo-reviewer  ");

    // Assert
    expect(result).toEqual({
      value: "demo-reviewer",
      error: null,
    });
  });

  it("rejects an empty username", () => {
    // Act
    const result = validateUsername("   ");

    // Assert
    expect(result.error).toBe("Enter a demo username");
  });

  it("rejects a username longer than the maximum length", () => {
    // Arrange
    const username = "a".repeat(MAX_USERNAME_LENGTH + 1);

    // Act
    const result = validateUsername(username);

    // Assert
    expect(result.error).toBe("Demo username must be 50 characters or fewer");
  });

  it("rejects unsupported Unicode characters", () => {
    // Act
    const result = validateUsername("demo\treviewer");

    // Assert
    expect(result.error).toBe("Demo username contains unsupported characters");
  });
});
