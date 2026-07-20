"use client";

import { useState } from "react";
import DemoProfileForm from "../components/forms/DemoProfileForm";
import feedbackStyles from "../components/ui/Feedback.module.css";
import PageHeader from "../components/ui/PageHeader";
import { useDemoProfile } from "../context/DemoProfileContext";
import { createOrContinueDemoProfile } from "../lib/api/users";
import pageStyles from "./HomePageClient.module.css";

export default function HomePageClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { profile, isProfileReady, saveDemoProfile, clearDemoProfile } =
    useDemoProfile();

  async function handleProfileSubmit(username) {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const nextProfile = await createOrContinueDemoProfile(username);

      saveDemoProfile(nextProfile);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleChangeProfile() {
    clearDemoProfile();
    setErrorMessage("");
  }

  return (
    <>
      <PageHeader
        title="Find cultural events near you"
        description="Culture Finder helps you discover local events and save the ones you care about to a wishlist."
      />

      <section
        className={pageStyles.demoSection}
        aria-labelledby="demo-profile-heading"
      >
        <h2 id="demo-profile-heading" tabIndex={0}>
          Create a demo profile
        </h2>

        <p>
          Choose a demo username to create wishlists and save events. Your
          selected username will be remembered in this browser, and wishlist
          data may remain in the demo database between visits.
        </p>

        <p className={pageStyles.securityNotice}>
          This MVP does not use passwords, authentication or private accounts.
          Anyone who enters the same username may be able to view or change its
          wishlists. Use a fictional nickname and do not enter personal or
          sensitive information.
        </p>

        <p>Demo data may be reset or deleted.</p>

        {!isProfileReady && (
          <div className={feedbackStyles.feedback} aria-live="polite">
            <p>Checking for a saved demo profile…</p>
          </div>
        )}

        {isProfileReady && !profile && (
          <DemoProfileForm
            onProfileSubmit={handleProfileSubmit}
            isLoading={isLoading}
          />
        )}

        {isProfileReady && profile && (
          <>
            <div
              className={`${feedbackStyles.feedback} ${feedbackStyles.success}`}
              aria-live="polite"
              aria-atomic="true"
            >
              <p>
                Demo profile &quot;{profile.username}&quot; is active on this
                browser
              </p>
            </div>

            <button
              className={pageStyles.changeButton}
              type="button"
              onClick={handleChangeProfile}
            >
              Change demo profile
            </button>
          </>
        )}

        {errorMessage && (
          <p className={feedbackStyles.error} role="alert">
            {errorMessage}
          </p>
        )}
      </section>
    </>
  );
}
