import WishlistPageClient from "./WishlistPageClient";

export default async function WishlistPage({ params }) {
  const { wishlistId } = await params;

  return <WishlistPageClient wishlistId={wishlistId} />;
}
