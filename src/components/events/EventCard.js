import styles from "./EventCard.module.css";

const monthNumbers = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

function createDate(year, month, day) {
  const numericYear = Number(year);
  const numericDay = Number(day);
  const date = new Date(Date.UTC(numericYear, month, numericDay));

  if (
    date.getUTCFullYear() !== numericYear ||
    date.getUTCMonth() !== month ||
    date.getUTCDate() !== numericDay
  ) {
    return null;
  }

  return date;
}

function formatDate(dateValue) {
  if (typeof dateValue !== "string") {
    return "To be confirmed";
  }

  const isoDateParts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateValue);
  const flaskDateParts =
    /^(?:[A-Za-z]{3},\s*)?(\d{1,2})\s([A-Za-z]{3})\s(\d{4})$/.exec(
      dateValue,
    );

  let date = null;

  if (isoDateParts) {
    const [, year, month, day] = isoDateParts;
    date = createDate(year, Number(month) - 1, day);
  } else if (flaskDateParts) {
    const [, day, monthName, year] = flaskDateParts;
    const month = monthNumbers[monthName.toLowerCase()];

    if (month !== undefined) {
      date = createDate(year, month, day);
    }
  }

  if (!date) {
    return "To be confirmed";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatTime(timeValue) {
  if (typeof timeValue !== "string") {
    return "To be confirmed";
  }

  const timeParts = /^(\d{2}):(\d{2})/.exec(timeValue);

  if (!timeParts) {
    return "To be confirmed";
  }

  return `${timeParts[1]}:${timeParts[2]}`;
}

function getSafeEventUrl(urlValue) {
  if (typeof urlValue !== "string") {
    return null;
  }

  try {
    const url = new URL(urlValue);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function hasAccessibilityInformation(value) {
  return (
    typeof value === "string" &&
    value.trim() &&
    value.trim().toLowerCase() !== "no specific details provided"
  );
}

export default function EventCard({ event }) {
  const eventName =
    typeof event.event_name === "string" && event.event_name.trim()
      ? event.event_name
      : "Event details unavailable";

  const location =
    [event.venue_name, event.city, event.country]
      .filter((value) => typeof value === "string" && value.trim())
      .join(", ") || "To be confirmed";

  const eventUrl = getSafeEventUrl(event.event_url);

  return (
    <article className={styles.card}>
      <h2 tabIndex="0">{eventName}</h2>

      <dl
        tabIndex={0}
        aria-label={`Event details for ${eventName}`}
      >
        {event.category && (
          <div>
            <dt>Category</dt>
            <dd>{event.category}</dd>
          </div>
        )}

        <div>
          <dt>Date</dt>
          <dd>{formatDate(event.event_date)}</dd>
        </div>

        <div>
          <dt>Time</dt>
          <dd>{formatTime(event.event_time)}</dd>
        </div>

        <div>
          <dt>Location</dt>
          <dd>{location}</dd>
        </div>

        {hasAccessibilityInformation(event.accessibility) && (
          <div>
            <dt>Accessibility information</dt>
            <dd>{event.accessibility}</dd>
          </div>
        )}
      </dl>

      {eventUrl && (
        <a
          href={eventUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          View and book tickets for {eventName} on Ticketmaster (opens in a new tab)
        </a>
      )}
    </article>
  );
}

