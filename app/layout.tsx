import './globals.css';
import { Inter } from 'next/font/google';
import NavBar from './components/NavBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Gestion des Installations',
  description: 'Système de gestion des installations et des matériels',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <NavBar />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}