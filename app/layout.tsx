import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script";

export const metadata = {
  title: "Chefio | Just Cook It",
  description: "Discover and share amazing recipes with Chefio.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
        <Script id="google-signin-init">
          {`
            window.onload = function() {
              console.log('Window loaded, checking for Google Sign-In...');
              if (window.google) {
                console.log('Google Sign-In script loaded successfully');
              } else {
                console.error('Google Sign-In script not loaded');
              }
            };
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
