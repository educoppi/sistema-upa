import styles from "./styles.module.css"

export default function Logo() {
    return (
        <div className={styles.logo}>
            <img className={styles.imagem} src="images/logo.png" alt="" />
            <div className={styles.container}>
                <h2>São Lucas</h2>
                <h4>Pronto Atendimento</h4>
            </div>
        </div>
    );
}