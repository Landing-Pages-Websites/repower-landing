import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display"
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Repower Montana - Solar + Battery Solutions",
  description: "Residential and commercial solar installation with battery backup for Montana homes and businesses. Energy resilience and independence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable}`}>
      <head>
        {/* MegaTag Configuration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.MEGA_TAG_CONFIG = {
                siteKey: "sk_placeholder"
              };
              window.API_ENDPOINT = "https://optimizer.gomega.ai";
              window.TRACKING_API_ENDPOINT = "https://events-api.gomega.ai";
            `,
          }}
        />
        <script src="https://cdn.gomega.ai/scripts/optimizer.min.js" async />
        <Script src="https://572388.tctm.co/t.js" strategy="afterInteractive" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}