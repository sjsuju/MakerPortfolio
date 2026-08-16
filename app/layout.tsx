import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// --font-display aliases --font-sans in globals.css, so `font-display` still works.
const sansFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono"
});

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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sansFont.variable} ${monoFont.variable}`}
    >
      <head>
        {/* Set the theme class before paint to prevent a flash of the wrong theme. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
