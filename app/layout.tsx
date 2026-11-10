import type { Metadata, Viewport } from "next";
import { Noto_Sans_Armenian } from "next/font/google";
import Header from "../src/components/header/Header";
import "./layout.css";

const notoSansArmenian = Noto_Sans_Armenian({
  subsets: ["armenian", "latin"],
  display: "swap",
  variable: "--font-main",
});

export const metadata: Metadata = {
  title: "Նորությունների գեներատոր | Արարատի մարզի շախմատի ֆեդերացիա",
  description: "Նորությունների գեներատոր",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1e3a8a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hy" className={notoSansArmenian.variable}>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
