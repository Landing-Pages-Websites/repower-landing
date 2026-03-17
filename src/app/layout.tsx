import type { Metadata } from "next";
import { Oswald, Source_Sans_3 } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"]
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "repower Montana - Solar + Battery Solutions",
  description: "Solar panels, battery backup, and energy resilience for Montana homes and businesses. Schedule your free consultation today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oswald.variable} ${sourceSans.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.MEGA_TAG_CONFIG={siteKey:"sk_placeholder"};window.API_ENDPOINT="https://optimizer.gomega.ai";window.TRACKING_API_ENDPOINT="https://events-api.gomega.ai";`,
          }}
        />
        <script src="https://cdn.gomega.ai/scripts/optimizer.min.js" async />
        <Script src="https://572388.tctm.co/t.js" strategy="afterInteractive" />
      </head>
      <body className={`${sourceSans.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}