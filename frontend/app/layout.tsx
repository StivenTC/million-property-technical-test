import type { Metadata } from 'next';
import Link from 'next/link';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'Million - Bienes Raíces',
  description: 'Prueba técnica para Million',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <header className="main-header">
          <div className="header-content">
            <Link href="/">Million</Link>
          </div>
        </header>
        <main className="main-container">
          {children}
        </main>
      </body>
    </html>
  );
}