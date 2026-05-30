import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReactQueryProvider } from '../components/ReactQueryProvider';
import { AuthHydration } from '../components/AuthHydration';
import { Navbar } from '../components/Navbar';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'A1 Learner | Premium AI-Powered Engineering Platform',
  description: 'Master DSA & Problem Solving, Full Stack Development, AI Engineering, and Cybersecurity with personalized AI guidance.',
  keywords: ['DSA & Problem Solving', 'Full Stack Development', 'AI Engineering', 'Cybersecurity', 'Amit Rajput', 'A1 Learner'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-primary/30 selection:text-white">
        <ReactQueryProvider>
          <AuthHydration>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
          </AuthHydration>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
