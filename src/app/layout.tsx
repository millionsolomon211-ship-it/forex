import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Forex Exchange Module",
  description: "Manage your foreign exchange rates and virtual cards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-black antialiased border-[12px] border-black min-h-screen m-0 p-0`}>
        {children}
      </body>
    </html>
  );
}
