import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Footer from "./components/footer/Footer";
import MainHeader from "./components/header/MainHeader";
import { Toaster } from "react-hot-toast";
import { BsCheckCircle, BsXCircle } from "react-icons/bs";

const cairo = Cairo({ subsets: ["latin"] });
 
export const metadata: Metadata = {
  title: "El-Lufzy | أ/عادل عاشور",
  description: "موقع الاستاذ عادل عاشور للاختبارات اللفظية في القدرات العامة",
  keywords: "قدرات, قدرات لفظي, عادل عاشور, عادل, اختبارات, اختبارات قدرات, لفظي, el-lufzy, el-lufzy.com, الوجيز, lufzy, كمي, قدرات عامة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html dir="rtl" lang="en" className="scroll-smooth">
      <head>
      <link rel="icon" href="/favicon.png" type="image/png" />
      <link rel="icon" href="/public/favicon.png" type="image/png" />
      </head>
      <body className={`${cairo.className}`}>
        <Providers>
          <Toaster
            // position="top-right"
            containerStyle={{
              zIndex: 999999,
            }}
            toastOptions={{
              duration: 5000,
              success: {
                style: {
                  background: "#4CAF50",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                },
                icon: <BsCheckCircle size={24} color="white" />,
              },
              error: {
                style: {
                  background: "#F44336",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                },
                icon: <BsXCircle size={24} color="white" />,
              },
            }}
          />

          <MainHeader />

          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
