import Link from "next/link";
import { navigation } from "../../constants/nav";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header>
      <nav>
        <ul className={styles.nav_list}>
          {navigation.map((el) => (
            <li key={el.link} className={styles.nav_item}>
              <Link href={el.link}>{el.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
