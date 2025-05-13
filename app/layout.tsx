import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
