import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "pezblog: the blog you've always missed",
  description:
    "get started using pezblog today and keep track of what matters.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pezblog.vercel.app/" />
        <meta
          property="og:image"
          content={`https://pezblog.vercel.app/logo512.png`}
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://pezblog.vercel.app/" />
        <meta
          property="twitter:title"
          content="pezblog: the blog you've always missed"
        />
        <meta
          property="twitter:description"
          content="get started using pezblog today and keep track of what matters."
        />
        <link
          rel="apple-touch-icon"
          href="https://pezblog.vercel.app/logo192.png"
        />
        <meta
          property="twitter:image"
          content="https://metatags.io/images/meta-tags.png"
        />
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap`}
        />
        <link rel="icon" href="/favicon.ico" />
        <title>pezblog: the blog you've always missed</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
