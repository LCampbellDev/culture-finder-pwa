/* Run selected validation rules on text input and return the validated value and first error */

/* OUTPUTS: 
Object containing the trimmed value and either the first validation error message or null */

/* ASSUMPTIONS: 
Each validation rule accepts { value, trimmedValue } and returns an error message or null */

/* LIMITATIONS: 
Stops at the first validation error and does not collect multiple errors 
Trimming is always applied to the returned value, so this helper is intended for text fields where surrounding whitespace is not meaningful */

export function validateTextInput(value, rules) {
  if (typeof value !== "string") {
    throw new TypeError("value must be a string");
  }

  if (!Array.isArray(rules)) {
    throw new TypeError("rules must be an array");
  }

/* Keep both values so rules can inspect raw input where trimming could hide invalid characters */
  const context = {
    value,
    trimmedValue: value.trim(),
  };

  for (const rule of rules) {
    const error = rule(context);

    if (error) {
      return {
        value: context.trimmedValue,
        error,
      };
    }
  }

  return {
    value: context.trimmedValue,
    error: null,
  };
}