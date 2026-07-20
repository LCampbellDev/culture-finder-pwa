import Link from "next/link";
import styles from "./AppShell.module.css";

export default function Navigation() {
  return (
    <nav aria-label="Main navigation">
      <ul className={styles.navList}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/search">Search</Link>
        </li>
        <li>
          <Link href="/wishlists">Wishlists</Link>
        </li>
      </ul>
    </nav>
  );
}