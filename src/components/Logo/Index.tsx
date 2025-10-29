import styles from "./styles.module.css"

export default function Logo() {
    return (
        <div className={styles.logo}>
            <img className={styles.imagem} src="/images/logo.png" alt="oi" />
            <div className={styles.container}>
                <h2>SisUPA</h2>
                <h4>Unidade de Pronto Atendimento</h4>
            </div>
        </div>
    );
}