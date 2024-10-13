import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { BreakpointIndicator } from "@/components/breakpoint-indicator";
import { PropsWithChildren } from "react";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Noćna Mora",
  description:
    "Dobrodošli na arhivsku stranicu Noćne More! Pregledajte i istražite ovu jedinstvenu kolekciju emisija koje su ostavile traga u povijesti hrvatske televizije.",
  openGraph: {
    title: "Noćna Mora",
    description:
      "Dobrodošli na arhivsku stranicu Noćne More! Pregledajte i istražite ovu jedinstvenu kolekciju emisija koje su ostavile traga u povijesti hrvatske televizije.",
    url: "https://nocna-mora.com",
    siteName: "Noćna Mora",
    images: [
      {
        url: "/og-image.jpeg",
        width: 1600,
        height: 1200,
      },
    ],
    locale: "hr_HR",
    type: "website",
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BreakpointIndicator />
        <div className="flex size-full min-h-screen flex-col justify-between">
          <Header />
          <main className="flex grow flex-col">{children}</main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
