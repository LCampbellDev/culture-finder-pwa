"use client";

import { useState } from "react";
import DemoProfileForm from "../components/forms/DemoProfileForm";
import FeedbackStyles from "../components/ui/Feedback.module.css";
import PageHeader from "../components/ui/PageHeader";
import { createOrContinueDemoProfile } from "../lib/api/users";
import pageStyles from "./HomePageClient.module.css";

export default function HomePageClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeProfile, setActiveProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleProfileSubmit(username) {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const profile =
        await createOrContinueDemoProfile(username);

      setActiveProfile(profile);
    } catch (error) {
      setActiveProfile(null);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
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
          Choose a demo username to create wishlists and save
          events. Wishlist data may remain in the demo database
          between visits.
        </p>

        <p className={pageStyles.securityNotice}>
          This MVP does not use passwords, authentication or private
          accounts. Anyone who enters the same username may be able
          to view or change its wishlists. Use a fictional nickname
          and do not enter personal or sensitive information.
        </p>

        <p>Demo data may be reset or deleted.</p>

        <DemoProfileForm
          onProfileSubmit={handleProfileSubmit}
          isLoading={isLoading}
        />

        <div
          className={`${FeedbackStyles.feedback} ${FeedbackStyles.success}`}
          aria-live="polite"
          aria-atomic="true"
        >
          {activeProfile && (
            <p>
              Demo profile “{activeProfile.username}” is active for
              this visit
            </p>
          )}
        </div>

        {errorMessage && (
          <p className={FeedbackStyles.error} role="alert">
            {errorMessage}
          </p>
        )}
      </section>
    </>
  );
}

