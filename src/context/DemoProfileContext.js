"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const DEMO_PROFILE_STORAGE_KEY = "culture-finder-demo-profile";

const DemoProfileContext = createContext(null);

function containsUnsupportedCharacters(value) {
  return [...value].some(
    (character) => character !== " " && /[\p{C}\p{Z}]/u.test(character),
  );
}

function isValidDemoProfile(profile) {
  return (
    profile !== null &&
    typeof profile === "object" &&
    Number.isInteger(profile.userId) &&
    profile.userId > 0 &&
    typeof profile.username === "string" &&
    profile.username.length > 0 &&
    profile.username.length <= 50 &&
    profile.username === profile.username.trim() &&
    !containsUnsupportedCharacters(profile.username)
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
