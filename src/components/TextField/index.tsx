'use client';
import { ChangeEvent, useState } from "react";
import styles from "./styles.module.css";

type Props = {
label?: string;
placeholder?: string;
type: string;
text?: string;
onChange?(texto: string): void;
}

export default function TextField(props: Props) {

    const [texto, setTexto] = useState(props.text);

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        setTexto(e.target.value);
       
        if(props.onChange){
            props.onChange(e.target.value);
        }
      }

    return (
        <>
            {props.label}:
            <input type={props.type} placeholder={props.placeholder} value={texto} onChange={handleInputChange}  className={styles.input}/>
        </>
    );
}
