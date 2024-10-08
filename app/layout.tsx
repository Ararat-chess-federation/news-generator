import type { Metadata } from "next";
import Header from "../src/components/header/Header";
import "./layout.css";

export const metadata: Metadata = {
  title: "Նորությունների գեներատոր | Արարատի մարզի շախմատի ֆեդերացիա",
  description: "Նորությունների գեներատոր",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
