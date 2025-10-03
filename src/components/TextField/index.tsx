import styles from "./styles.module.css";

type Props = {
label?: string;
placeholder?: string;
}

export default function TextField(props: Props) {
    return (
        <>
            {props.label}:
            <input type="text" placeholder={props.placeholder}  className={styles.input}/>
        </>
    );
}