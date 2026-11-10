"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "../../constants/nav";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          <span className={styles.logo} aria-hidden>♞</span>
          <span className={styles.brand_text}>
            <strong>Նորությունների գեներատոր</strong>
            <span>Արարատի մարզի շախմատի ֆեդերացիա</span>
          </span>
        </Link>
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
      </div>
    </header>
  );
}
