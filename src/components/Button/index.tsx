import styles from './styles.module.css';
import Link from 'next/link';




function Button() {
  return (
    <>
      <button type="button" className={styles.button}>
        Tela Login
      </button>
      <Link href="/Login">Ir para login</Link>
    </>
  );
}

export default Button;
