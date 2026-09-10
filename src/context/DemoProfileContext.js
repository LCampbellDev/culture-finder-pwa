"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { validateUsername } from "../lib/validation/username-validation";

/*
Demo profile context:
- Restores and validates a demo profile from browser storage
- Provides the active profile and readiness state
- Saves and clears the demo profile
- Keeps the profile usable in memory if browser storage is unavailable
*/

export const DEMO_PROFILE_STORAGE_KEY = "culture-finder-demo-profile";

const DemoProfileContext = createContext(null);

/* Validate profile structure and require the stored username to already be trimmed */
function isValidDemoProfile(profile) {
  return (
    profile !== null &&
    typeof profile === "object" &&
    Number.isInteger(profile.userId) &&
    profile.userId > 0 &&
    typeof profile.username === "string" &&
    profile.username === profile.username.trim() &&
    !validateUsername(profile.username).error
  );
}

export function DemoProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [isProfileReady, setIsProfileReady] = useState(false);

  useEffect(() => {
    const restoreProfileTimer = window.setTimeout(() => {
      try {
        const storedProfile = window.localStorage.getItem(
          DEMO_PROFILE_STORAGE_KEY,
        );

        if (storedProfile) {
          const parsedProfile = JSON.parse(storedProfile);

          if (isValidDemoProfile(parsedProfile)) {
            setProfile(parsedProfile);
          } else {
            window.localStorage.removeItem(DEMO_PROFILE_STORAGE_KEY);
          }
        }
      } catch {
        // The app remains usable when browser storage is unavailable
      } finally {
        setIsProfileReady(true);
      }
    }, 0);

    return () => {
      window.clearTimeout(restoreProfileTimer);
    };
  }, []);

  function saveDemoProfile(nextProfile) {
    if (!isValidDemoProfile(nextProfile)) {
      throw new Error("Invalid demo profile");
    }

    setProfile(nextProfile);

    try {
      window.localStorage.setItem(
        DEMO_PROFILE_STORAGE_KEY,
        JSON.stringify(nextProfile),
      );
    } catch {
      // Keep the profile active for this visit if storage fails
    }
  }

  function clearDemoProfile() {
    setProfile(null);

    try {
      window.localStorage.removeItem(DEMO_PROFILE_STORAGE_KEY);
    } catch {
      // Clearing in-memory state still allows profile switching
    }
  }

  return (
    <DemoProfileContext.Provider
      value={{
        profile,
        isProfileReady,
        saveDemoProfile,
        clearDemoProfile,
      }}
    >
      {children}
    </DemoProfileContext.Provider>
  );
}

export function useDemoProfile() {
  const context = useContext(DemoProfileContext);

  if (!context) {
    throw new Error("useDemoProfile must be used within DemoProfileProvider");
  }

  return context;
}
