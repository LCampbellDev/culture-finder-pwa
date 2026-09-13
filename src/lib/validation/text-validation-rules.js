/* 
Reusable, composable validation rules for text input
Rules use the trimmed value where surrounding whitespace should be ignored,
but can use the original value where trimming could hide invalid characters. */

import { isUnicodeControlOrSeparator } from "./unicode-character-detection";

export function nonEmptyText(message) {
  return ({ trimmedValue }) => {
    return trimmedValue.length === 0 ? message : null;
  };
}

export function maxLength(maximumLength, message) {
  if (!Number.isInteger(maximumLength) || maximumLength < 0) {
    throw new TypeError("maximumLength must be a non-negative integer");
  }

  return ({ trimmedValue }) => {
    return trimmedValue.length > maximumLength ? message : null;
  };
}

/* Return validation error for unsupported Unicode control or separator characters */
export function noUnsupportedUnicodeCharacters(message) {
  return ({ value }) => {
    const containsUnsupportedCharacter = [...value].some(
      (character) =>
        /*Allow ordinary spaces while rejecting other Unicode control or separator characters */
        character !== " " && isUnicodeControlOrSeparator(character),
    );

    return containsUnsupportedCharacter ? message : null;
  };
}
