import Logo from "../Logo/Index";
import styles from "./styles.module.css"

export default function Header() {
    return (
        <header className={styles.header}>
            < Logo/>
        </header>
    );
}