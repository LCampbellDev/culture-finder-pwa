"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CreateWishlistForm from "../../components/forms/CreateWishlistForm";
import WishlistList from "../../components/wishlists/WishlistList";
import feedbackStyles from "../../components/ui/Feedback.module.css";
import PageHeader from "../../components/ui/PageHeader";
import { useDemoProfile } from "../../context/DemoProfileContext";
import { createWishlist, getUserWishlists } from "../../lib/api/wishlists";
import styles from "./WishlistsPageClient.module.css";

export default function WishlistsPageClient() {
  const { profile, isProfileReady } = useDemoProfile();

  const [wishlists, setWishlists] = useState([]);
  const [isLoadingWishlists, setIsLoadingWishlists] = useState(true);
  const [isCreatingWishlist, setIsCreatingWishlist] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [creationError, setCreationError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const successMessageRef = useRef(null);

  useEffect(() => {
    if (!isProfileReady || !profile) {
      return undefined;
    }

    let isCancelled = false;

    async function loadWishlists() {
      try {
        const loadedWishlists = await getUserWishlists(profile.userId);

        if (!isCancelled) {
          setWishlists(loadedWishlists);
          setLoadError("");
        }
      } catch (error) {
        if (!isCancelled) {
          setWishlists([]);
          setLoadError(error.message);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingWishlists(false);
        }
      }
    }

    loadWishlists();

    return () => {
      isCancelled = true;
    };
  }, [isProfileReady, profile]);

  useEffect(() => {
    if (successMessage) {
      successMessageRef.current?.focus();
    }
  }, [successMessage]);

  async function handleWishlistSubmit(wishlistTitle) {
    setIsCreatingWishlist(true);
    setCreationError("");
    setSuccessMessage("");

    try {
      const createdWishlist = await createWishlist(
        profile.userId,
        wishlistTitle,
      );

      setWishlists((currentWishlists) => [
        ...currentWishlists,
        createdWishlist,
      ]);

      setSuccessMessage(`Wishlist "${createdWishlist.wishlist_title}" created`);

      return true;
    } catch (error) {
      setCreationError(error.message);
      return false;
    } finally {
      setIsCreatingWishlist(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Your wishlists"
        description="Create wishlists and manage the cultural events you want to remember"
      />

      {!isProfileReady && (
        <div
          className={feedbackStyles.feedback}
          aria-live="polite"
          aria-atomic="true"
        >
          <p>Checking for a saved demo profile…</p>
        </div>
      )}

      {isProfileReady && !profile && (
        <section
          className={styles.section}
          aria-labelledby="demo-profile-required-heading"
        >
          <h2 id="demo-profile-required-heading">
            Choose a demo profile first
          </h2>

          <p>A demo profile is needed to create and manage wishlists</p>

          <Link href="/">Choose a demo profile</Link>
        </section>
      )}

      {isProfileReady && profile && (
        <>
          <section
            className={styles.section}
            aria-labelledby="create-wishlist-heading"
          >
            <h2 id="create-wishlist-heading">Create a wishlist</h2>

            <p>
              The new wishlist will belong to demo profile{" "}
              <strong>{profile.username}</strong>
            </p>

            <CreateWishlistForm
              onWishlistSubmit={handleWishlistSubmit}
              isLoading={isCreatingWishlist}
            />

            <div
              className={`${feedbackStyles.feedback} ${feedbackStyles.success}`}
              role="status"
              aria-atomic="true"
            >
              {successMessage && (
                <p ref={successMessageRef} tabIndex="-1">
                  {successMessage}
                </p>
              )}
            </div>

            {creationError && (
              <p className={feedbackStyles.error} role="alert">
                {creationError}
              </p>
            )}
          </section>

          <section
            className={styles.section}
            aria-labelledby="saved-wishlists-heading"
          >
            <h2 id="saved-wishlists-heading">Saved wishlists</h2>

            {isLoadingWishlists && (
              <div
                className={feedbackStyles.feedback}
                aria-live="polite"
                aria-atomic="true"
              >
                <p>Loading wishlists…</p>
              </div>
            )}

            {!isLoadingWishlists && loadError && (
              <p className={feedbackStyles.error} role="alert">
                {loadError}
              </p>
            )}

            {!isLoadingWishlists && !loadError && (
              <WishlistList wishlists={wishlists} />
            )}
          </section>
        </>
      )}
    </>
  );
}
