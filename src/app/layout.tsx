// 'use client';
import type { Metadata } from "next";
import { fetchSingleType } from "@/lib/strapi";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await fetchSingleType("support-page", {
    populate: {
      header: {
        populate: {
          logo: true,
        },
      },
    },
  });

  const logoUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL +
    (pageData?.header?.logo?.url ?? "/favicon.ico");

  return {
    icons: {
      icon: logoUrl,
    },
    title: "I&M Bank Help & Support",
    description: "Developed by Gaman",
  };
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;1,600&family=DM+Serif+Display&display=swap"
          rel="stylesheet"
        />
      </head>

      <body>{children}</body>
    </html>
  );
}
