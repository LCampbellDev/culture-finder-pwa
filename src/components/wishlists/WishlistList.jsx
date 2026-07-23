import styles from "./WishlistList.module.css";

export default function WishlistList({ wishlists }) {
  if (!Array.isArray(wishlists) || wishlists.length === 0) {
    return (
      <p className={styles.emptyMessage}>You do not have any wishlists yet</p>
    );
  }

  return (
    <ul className={styles.list} aria-label="Saved wishlists">
      {wishlists.map((wishlist) => (
        <li className={styles.item} key={wishlist.wishlist_id}>
          <article>
            <h3>{wishlist.wishlist_title}</h3>
          </article>
        </li>
      ))}
    </ul>
  );
}
