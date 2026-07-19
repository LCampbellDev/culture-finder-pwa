const USERNAME_REQUIRED_MESSAGE = "Enter a demo username";
const CONFIGURATION_ERROR_MESSAGE =
  "Demo profiles are not available right now";
const PROFILE_ERROR_MESSAGE =
  "We could not create or continue with the demo profile. Check your connection and try again";

export async function createOrContinueDemoProfile(username) {
  const profileUrl = createProfileUrl(username);

  try {
    const response = await fetch(profileUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error(PROFILE_ERROR_MESSAGE);
    }

    const data = await response.json();

    if (
      typeof data.user_id !== "number" ||
      typeof data.username !== "string" ||
      !data.username.trim()
    ) {
      throw new Error(PROFILE_ERROR_MESSAGE);
    }

    return {
      userId: data.user_id,
      username: data.username,
    };
  } catch {
    throw new Error(PROFILE_ERROR_MESSAGE);
  }
}

function createProfileUrl(username) {
  if (typeof username !== "string" || !username.trim()) {
    throw new Error(USERNAME_REQUIRED_MESSAGE);
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error(CONFIGURATION_ERROR_MESSAGE);
  }

  try {
    return new URL("/users", apiUrl).toString();
  } catch {
    throw new Error(CONFIGURATION_ERROR_MESSAGE);
  }
}
