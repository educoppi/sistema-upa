import styles from "./styles.module.css";

type Props = {
label?: string;
placeholder?: string;
type: string;
}

export default function TextField(props: Props) {
    return (
        <>
            {props.label}:
            <input type={props.type} placeholder={props.placeholder}  className={styles.input}/>
        </>
    );
}