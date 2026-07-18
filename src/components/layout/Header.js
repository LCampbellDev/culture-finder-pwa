import Link from "next/link";
import Navigation from "./Navigation";
import styles from "./AppShell.module.css";

export default function Header() {
  return (
    <header className={styles.siteHeader}>
      <div className={`container ${styles.headerInner}`}>
        <Link className={styles.siteTitle} href="/">
          Culture Finder
        </Link>

        <Navigation />
      </div>
    </header>
  );
}