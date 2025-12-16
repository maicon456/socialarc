import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Arcnet Nostr-like DApp',
  description: 'Decentralized social network built on Arcnet testnet',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}










