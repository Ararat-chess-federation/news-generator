import type { Metadata } from "next";
import Image from "next/image";
import logo from "../../src/assets/logo.png";
import LoginForm from "./LoginForm";
import "./Login.css";

export const metadata: Metadata = {
  title: "Մուտք | Նորությունների գեներատոր",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { from } = await searchParams;

  return (
    <main className="login_page">
      <section className="card login_card">
        <Image src={logo} alt="" className="login_logo" priority />
        <h1>Մուտք</h1>
        <p className="login_subtitle">Մուտքագրեք ձեր տվյալները՝ շարունակելու համար</p>
        <LoginForm from={typeof from === "string" ? from : ""} />
      </section>
    </main>
  );
}
