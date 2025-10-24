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


export function TextFieldPesquisa(props: Props) {
    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        //setTexto(e.target.value);

        if (props.onChange) {
            props.onChange(e.target.value);
        }
    }


    return (
        <>
            <div className={styles.content}>
                <p className={styles.label}>{props.label}</p>
                <input type={props.type} placeholder={props.placeholder} value={props.text} onChange={handleInputChange} className={styles.inputPesquisa} />
            </div>
        </>
    );
}

export function TextFieldReception(props: Props) {
    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        //setTexto(e.target.value);

        if (props.onChange) {
            props.onChange(e.target.value);
        }
    }


    return (
        <>
            <div className={styles.content}>
                <p className={styles.label}>{props.label}</p>
                <input type={props.type} placeholder={props.placeholder} value={props.text} onChange={handleInputChange} className={styles.input} />
            </div>
        </>
    );
}

export default function TextField(props: Props) {

    //const [texto, setTexto] = useState(props.text);

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        //setTexto(e.target.value);

        if (props.onChange) {
            props.onChange(e.target.value);
        }
    }

    return (
        <>
            <p className={styles.labelLogin}>{props.label}</p>
            <input type={props.type} placeholder={props.placeholder} value={props.text} onChange={handleInputChange} className={styles.input} />
        </>
    );
}
