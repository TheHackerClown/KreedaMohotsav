import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import 'animate.css';

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  subsets: ["latin"],
  weight: "400",
});


export const metadata: Metadata = {
  title:  "PARAKRAM",
  description: "NFSU's Sport Club",
};
  
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pressStart2P.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
