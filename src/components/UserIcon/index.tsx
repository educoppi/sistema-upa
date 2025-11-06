import ButtonSair from "../ButtonSair";
import styles from "./styles.module.css";

type Props = {
    name?: string;
}

export default function UserIcon(props: Props) {
    return (
        <>
        <div className={styles.container}>
            <h5>{props.name}</h5>
            <img className={styles.icon} src="https://static.vecteezy.com/system/resources/previews/019/879/186/large_2x/user-icon-on-transparent-background-free-png.png" alt="" />
            < ButtonSair />
        </div>
        </>
    );
}