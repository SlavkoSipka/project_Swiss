import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "nicemodels.com - DAS EROTIKPORTAL",
  description: "Find the best escort models in Switzerland and Europe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`} suppressHydrationWarning>
        <LanguageProvider>
          <div className="max-w-[1600px] mx-auto bg-gradient-to-b from-white via-purple-50/30 to-white min-h-screen">
            <Header />
            <main className="relative">
            {children}
            </main>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
