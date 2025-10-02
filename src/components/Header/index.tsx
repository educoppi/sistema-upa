import Logo from "../Logo/Index";
import UserIcon from "../UserIcon";
import styles from "./styles.module.css"

export function HeaderLogin() {
    return (
        <header className={styles.header}>
            < Logo/>
        </header>
    );
}


export function Header() {
    return (
        <header className={styles.header}>
            < Logo/>
            < UserIcon/>
        </header>
    );
}