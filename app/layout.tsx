import "./globals.css";
// import ChristmasSleigh from "./components/ChristmasSleigh";

export const metadata = {
  title: "Threads of Calm",
  description: "Handcrafted crochet creations and home décor.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        {children}
        {/* <div className="christmas-snow christmas-snow--light" aria-hidden="true" />
        <div className="christmas-snow christmas-snow--steady" aria-hidden="true" />
        <div className="christmas-snow christmas-snow--close" aria-hidden="true" />
        <ChristmasSleigh /> */}
      </body>
    </html>
  );
}