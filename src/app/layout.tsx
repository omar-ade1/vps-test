import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Footer from "./components/footer/Footer";
import MainHeader from "./components/header/MainHeader";

const cairo = Cairo({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "El-Lufzy | أ/عادل عاشور",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html dir="rtl" lang="en" className="scroll-smooth">
      <body className={`${cairo.className}`}>
        <Providers>
          <MainHeader />
          {children}
          <Footer/>
        </Providers>
      </body>
    </html>
  );
}
