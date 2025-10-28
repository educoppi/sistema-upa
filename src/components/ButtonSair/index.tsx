import { FaSignOutAlt } from "react-icons/fa"; // ícone de sair
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";

export default function ButtonSair() {
    const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');


    router.push('/');

    // window.location.href = '/login';
  };

  return (
    <div className={styles.container} onClick={handleLogout}>
      <FaSignOutAlt className={styles.icon} />
      <u>Sair</u>
    </div>
  );
}