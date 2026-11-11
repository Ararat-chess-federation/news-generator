"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "../../../app/login/actions";
import { navigation } from "../../constants/nav";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <header className={styles.header}>
      <div className={`${styles.inner} ${isLoginPage ? styles.inner_login : ""}`}>
        <Link href="/" className={styles.brand}>
          <span className={styles.logo} aria-hidden>♞</span>
          <span className={styles.brand_text}>
            <strong>Նորությունների գեներատոր</strong>
            <span>Արարատի մարզի շախմատի ֆեդերացիա</span>
          </span>
        </Link>
        {!isLoginPage && (
          <>
            <nav className={styles.nav}>
              {navigation.map((el) => {
                const isActive = pathname === el.link;
                return (
                  <Link
                    key={el.link}
                    href={el.link}
                    className={`${styles.nav_link} ${isActive ? styles.nav_link_active : ""}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className={styles.full_title}>{el.title}</span>
                    <span className={styles.short_title}>{el.shortTitle}</span>
                  </Link>
                );
              })}
            </nav>
            <form action={logout} className={styles.logout}>
              <button type="submit" className={styles.logout_button} title="Ելք">
                <span aria-hidden>⎋</span>
                <span className={styles.logout_text}>Ելք</span>
              </button>
            </form>
          </>
        )}
      </div>
    </header>
  );
}
