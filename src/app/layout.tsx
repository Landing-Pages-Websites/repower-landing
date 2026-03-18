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
      <head>
        <meta name="mega-site-id" content="7dbda2a3-f2b6-4043-9001-115caf74b9bd" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.MEGA_TAG_CONFIG={siteKey:"sk_mmv1597s_i3ve8nl7cv",gtmId:"GTM-N6DBKMH9",siteId:"7dbda2a3-f2b6-4043-9001-115caf74b9bd"};window.API_ENDPOINT="https://optimizer.gomega.ai";window.TRACKING_API_ENDPOINT="https://events-api.gomega.ai";`,
          }}
        />
        <script
          id="optimizer-script"
          src="https://cdn.gomega.ai/scripts/optimizer.min.js"
          data-site-id="7dbda2a3-f2b6-4043-9001-115caf74b9bd"
          async
        />
      </head>
      <body className={`${sourceSans.className} antialiased`}>
        {children}
        <Script src="https://572388.tctm.co/t.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
