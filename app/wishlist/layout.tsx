import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Your Wishlist | Silver Star",
  description: "View and manage your saved items. Hand-poured artisanal candles and premium luxury goods from Silver Star.",
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
