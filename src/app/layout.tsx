// 'use client';
import type { Metadata } from "next";
import { fetchSingleType, type SupportPage } from "@/lib/strapi";
import { Geist, Geist_Mono, DM_Sans, DM_Serif_Display } from "next/font/google";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Configure DM Sans
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

// Configure DM Serif Display
const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
});

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await fetchSingleType<SupportPage>("support-page", {
    populate: {
      header: {
        populate: {
          logo: true,
        },
      },
    },
  });

    // Handle absolute Cloudinary URLs vs relative local paths
  const rawUrl = pageData?.header?.logo?.url;
  const logoSrc = rawUrl
    ? rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
      ? rawUrl
      : `${process.env.NEXT_PUBLIC_STRAPI_API_URL || ""}${rawUrl}`
    : "/favicon.ico";

  const logoUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL +
    (pageData?.header?.logo?.url ?? "/favicon.ico");

  return {
    icons: {
      icon: logoSrc,
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
   <html 
      lang="en" 
      className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable} ${dmSerifDisplay.variable}`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
        />
        
      </head>

      <body>{children}</body>
    </html>
  );
}
