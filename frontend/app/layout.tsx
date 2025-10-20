import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
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
            <Link href="/">
              <Image
                src="https://maustorageprod.blob.core.windows.net/spinfileuat/Spin/Data/Estate/IMG/ceb693ad6b7643fc8c1be271d6a9c068.svg"
                alt="Million Logo"
                width={150}
                height={40}
                priority
              />
            </Link>
          </div>
        </header>
        <main className="main-container">
          {children}
        </main>
      </body>
    </html>
  );
}