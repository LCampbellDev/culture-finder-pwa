import {
  maxLength,
  nonEmptyText,
  noUnsupportedUnicodeCharacters,
} from "./text-validation-rules";

import { validateTextInput } from "./validate-text-input";

// Keep aligned with the backend/database username length constraint
export const MAX_USERNAME_LENGTH = 50;

const usernameRules = [
  nonEmptyText("Enter a demo username"),
  maxLength(
    MAX_USERNAME_LENGTH,
    "Demo username must be 50 characters or fewer",
  ),
  noUnsupportedUnicodeCharacters(
    "Demo username contains unsupported characters",
  ),
];

export function validateUsername(username) {
  return validateTextInput(username, usernameRules);
}
