import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
export const dynamic = "force-dynamic";

const globalFont = Manrope({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  openGraph: {
    title: "pezblog: the blog you've always missed",
    description:
      "get started using pezblog today and keep track of what matters.",
    url: "https://pezblog.vercel.app/",
    type: "website",
    images: "https://pezblog.vercel.app/logo192.png",
  },
  twitter: {
    card: "summary_large_image",
    site: "https://pezblog.vercel.app/",
    title: "pezblog: the blog you've always missed",
    description:
      "get started using pezblog today and keep track of what matters.",
    images: "https://pezblog.vercel.app/logo192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={globalFont.className}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="apple-touch-icon"
          href="https://pezblog.vercel.app/logo192.png"
        />
        {/* <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=Cormorant:wght@400;600;700&display=swap`}
        /> */}
        <link rel="icon" href="/favicon.ico" />
        <title>pezblog: the blog you've always missed</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
