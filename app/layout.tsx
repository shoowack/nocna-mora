import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { BreakpointIndicator } from "@/components/breakpoint-indicator";
import { PropsWithChildren } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Noćna Mora",
  description:
    "Dobrodošli na arhivsku stranicu Noćne More! Pregledajte i istražite ovu jedinstvenu kolekciju emisija koje su ostavile traga u povijesti hrvatske televizije.",
  openGraph: {
    title: "Noćna Mora",
    description:
      "Dobrodošli na arhivsku stranicu Noćne More! Pregledajte i istražite ovu jedinstvenu kolekciju emisija koje su ostavile traga u povijesti hrvatske televizije.",
    url: "https://nocna-mora.vercel.app",
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
        <div className="flex h-full min-h-screen w-full flex-col justify-between">
          <Header />
          <main className="grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
