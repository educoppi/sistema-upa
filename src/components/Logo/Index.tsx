import styles from "./styles.module.css"

export default function Logo() {
    return (
        <div className={styles.logo}>
            <img className={styles.imagem} src="https://tse2.mm.bing.net/th/id/OIP.PUvYnhSdkXWJfT0nEHFFVwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" alt="" />
            <h3>UPA</h3>
            <h5>Unidade de Pronto Atendimento</h5>
        </div>
    );
}