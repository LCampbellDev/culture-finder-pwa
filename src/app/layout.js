import "./globals.css";
import Footer from "../components/layout/Footer";
import Header from "../components/layout/Header";
import styles from "../components/layout/AppShell.module.css";
import SkipLink from "../components/ui/SkipLink";

export const metadata = {
  title: {
    default: "Culture Finder",
    template: "%s | Culture Finder",
  },
  description: "Find and save local cultural events near you",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body>
        <SkipLink />
        <Header />

        <main
          id="main-content"
          className={`container ${styles.mainContent}`}
          tabIndex="-1"
        >
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
