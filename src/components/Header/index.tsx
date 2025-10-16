import Logo from "../Logo/Index";
import UserIcon from "../UserIcon";
import styles from "./styles.module.css";

type Props = {
    name?: string;
}

export function HeaderLogin() {
    return (
        <header className={styles.header}>
            < Logo/>
        </header>
    );
}


export function Header(props: Props) {
    return (
        <header className={styles.header}>
            < Logo/>
            < UserIcon name={props.name}/>
        </header>
    );
}