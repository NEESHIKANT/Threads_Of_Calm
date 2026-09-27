import "./globals.css";

export const metadata = {
  title: "Threads of Calm",
  description: "Handcrafted crochet creations and home décor.",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}