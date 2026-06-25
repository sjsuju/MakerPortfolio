import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sooraj Sathyajith | Maker Portfolio",
  description:
    "A technical maker portfolio for Sooraj Sathyajith: robotics, prosthetics, AI tools, product experiments, and engineering process."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
