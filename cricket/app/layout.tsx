
import type { Metadata } from "next";
import "./globals.css";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "CricPulse - Live Sports Platform",
  description: "Live cricket scores, stats, and AI predictions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-white min-h-screen flex flex-col font-sans antialiased">
        {/* <Navbar /> */}
        <main className="flex-grow">
          {children}
        </main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
