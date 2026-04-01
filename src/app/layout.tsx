import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: "300",
  variable: "--font-ibm",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-source",
});

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.png',
  },
  title: { template: "%s | LAMP", default: "LAMP — Listen: Album & Music Portfolio" },
  description: "Rate albums, write reviews, discover trending music. Your review stays unbiased — you can't see others' until you write your own.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${ibmPlexMono.variable} ${sourceSerif.variable}`}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
