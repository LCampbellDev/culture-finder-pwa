// Shared HTTP request and JSON response handling
/*
- API URL construction
- Request and error handling
- JSON header creation
*/

// Build an API URL and handle missing or invalid API configuration

export function createApiUrl(path, configurationErrorMessage) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error(configurationErrorMessage);
  }

  try {
    return new URL(path, apiUrl).toString();
  } catch {
    throw new Error(configurationErrorMessage);
  }
}

// Make an HTTP request, check the response and parse the JSON body

export async function requestJson(url, options, errorMessage) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch {
    throw new Error(errorMessage);
  }
}

// Create standard headers for JSON API requests

export function createJsonHeaders({ includeContentType = false } = {}) {
  const headers = {
    Accept: "application/json",
  };

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}
