import type { Metadata } from 'next';
import Header from '@/components/Header';
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
        <Header />
        <main className="main-container">
          {children}
        </main>
      </body>
    </html>
  );
}