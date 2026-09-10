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



// requestJson(...)
/* async function requestJson(url, options, errorMessage) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch {
    throw new Error(errorMessage);
  }
} */

// createJsonHeaders(...)
/* function createJsonHeaders({ includeContentType = false } = {}) {
  const headers = {
    Accept: "application/json",
  };

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
} */