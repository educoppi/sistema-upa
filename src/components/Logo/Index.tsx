import styles from "./styles.module.css"

export default function Logo() {
    return (
        <div className={styles.logo}>
            <img className={styles.imagem} src="images/logo.png" alt="" />
            <h3>UPA</h3>
            <h5>Unidade de Pronto Atendimento</h5>
        </div>
    );
}