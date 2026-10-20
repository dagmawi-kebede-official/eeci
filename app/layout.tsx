import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/header"
import Footer from "@/components/footer";
import { Providers } from "@/components/providers";
import type { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ethiopian Enterprise Cyber Intelligence",
  description: "Enterprise Cybersecurity Solution",
  openGraph: {
    title: "Ethiopian Enterprise Cyber Intelligence",
    description: "Assess, Manage, and Continuously Improve your Organization's Security. With Integrated AI Features.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen">
        
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="block flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>

      </body>
    </html>
  );
}
