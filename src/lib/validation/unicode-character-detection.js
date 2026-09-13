/* Helper function thatdetects Unicode control/separator characters and validates */

/* INPUTS: 
A single Unicode character as a string */

/* OUTPUTS: 
Boolean indicating whether the character is in Unicode category C or Z */

/* ASSUMPTIONS: 
Caller provides exactly one Unicode character 
Unicode categories C and Z identify the characters this helper is responsible for detecting */

/* LIMITATIONS: 
Detects Unicode categories only; does not decide whether a character is valid input */

/* Match Unicode "Other" (C) or "Separator" (Z) category characters */
const UNICODE_CONTROL_OR_SEPARATOR_PATTERN = /[\p{C}\p{Z}]/u;

/**
 * Identifies whether a single Unicode character belongs to the
 * Unicode "Other" (C) or "Separator" (Z) categories.
 */
export function isUnicodeControlOrSeparator(character) {
  if (typeof character !== "string" || [...character].length !== 1) {
    throw new TypeError("character must be a single Unicode character");
  }

  return UNICODE_CONTROL_OR_SEPARATOR_PATTERN.test(character);
}
