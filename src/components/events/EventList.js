import EventCard from "./EventCard";
import styles from "./EventList.module.css";

export default function EventList({ events }) {
  if (!Array.isArray(events) || events.length === 0) {
    return null;
  }

  return (
    <section aria-label="Event results">
      <ul className={styles.list}>
        {events.map((event) => (
          <li key={event.event_id ?? event.ticketmaster_event_id}>
            <EventCard event={event} />
          </li>
        ))}
      </ul>
    </section>
  );
}

