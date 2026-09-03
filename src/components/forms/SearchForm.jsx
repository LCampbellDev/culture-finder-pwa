"use client";

import { useEffect, useRef, useState } from "react";
import FieldError from "./FieldError";
import styles from "./Form.module.css";

const categories = [
  "Arts & Theatre",
  "Music",
  "Sports",
  "Film",
  "Miscellaneous",
];

export default function SearchForm({ onSearch, isLoading = false }) {
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [cityError, setCityError] = useState("");

  const cityInputRef = useRef(null);

    useEffect(() => {
      if (cityError) {
        cityInputRef.current?.focus();
      }
    }, [cityError]);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedCity = city.trim();

    if (!trimmedCity) {
      setCityError("Enter a city or location");
      return;
    }

    setCityError("");
    await onSearch(trimmedCity, category);
  }

  function handleCityChange(event) {
    const nextCity = event.target.value;

    setCity(nextCity);

    if (cityError && nextCity.trim()) {
      setCityError("");
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      aria-label="Event search"
      noValidate
    >
      <div className={styles.field}>
        <label className={styles.label} htmlFor="city">
          City or location
          <span aria-hidden="true"> *</span>
        </label>

        <p className={styles.hint} id="city-hint">
          Enter a city in Great Britain
        </p>

        <FieldError id="city-error" message={cityError} />

        <input
          ref={cityInputRef}
          className={styles.control}
          id="city"
          name="city"
          type="text"
          value={city}
          onChange={handleCityChange}
          aria-describedby={cityError ? "city-hint city-error" : "city-hint"}
          aria-invalid={cityError ? "true" : undefined}
          required
          autoComplete="address-level2"
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="category">
          Category
        </label>

        <p className={styles.hint} id="category-hint">
          Optional
        </p>

        <select
          className={styles.control}
          id="category"
          name="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-describedby="category-hint"
        >
          <option value="">All categories</option>

          {categories.map((categoryName) => (
            <option key={categoryName} value={categoryName}>
              {categoryName}
            </option>
          ))}
        </select>
      </div>
      <button className={styles.button} type="submit" disabled={isLoading}>
        {isLoading ? "Searching…" : "Search events"}
      </button>
    </form>
  );
}
