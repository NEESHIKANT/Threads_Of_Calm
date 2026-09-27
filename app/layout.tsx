import "./globals.css";

export const metadata = {
  title: "Threads of Calm",
  description: "Handcrafted crochet creations and home décor.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}