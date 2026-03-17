import type { Metadata } from "next";
import { Barlow_Condensed, Source_Sans_3 } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"]
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Solar + Battery for Your Home | repower Montana",
  description: "Power your Montana home with solar energy and battery backup. Schedule your free consultation with repower today. 30% federal tax credit available.",
  openGraph: {
    title: "Solar + Battery for Your Home | repower Montana",
    description: "Power your Montana home with solar energy and battery backup. Schedule your free consultation today.",
    images: ["/trust-badges.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} ${sourceSans.variable}`}>
      <body className={`${sourceSans.className} antialiased`}>
        {children}
        <Script src="https://572388.tctm.co/t.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
