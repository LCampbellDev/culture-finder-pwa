import { createApiUrl, requestJson } from "./api-client";

const USERNAME_REQUIRED_MESSAGE = "Enter a demo username";
const USER_PROFILE_CONFIGURATION_ERROR_MESSAGE = "Demo profiles are not available right now";
const PROFILE_ERROR_MESSAGE =
  "We could not create or continue with the demo profile. Check your connection and try again";

export async function createOrContinueDemoProfile(username) {
  const profileUrl = createProfileUrl(username);

  const data = await requestJson(
    profileUrl,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.trim(),
      }),
    },
    PROFILE_ERROR_MESSAGE,
  );

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
}

function createProfileUrl(username) {
  if (typeof username !== "string" || !username.trim()) {
    throw new Error(USERNAME_REQUIRED_MESSAGE);
  }

  return createApiUrl(
    "/users",
    USER_PROFILE_CONFIGURATION_ERROR_MESSAGE,
  );
}