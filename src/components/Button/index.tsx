import styles from './styles.module.css';
import { CSSProperties } from "react";


type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  style?: CSSProperties;      // precisa estar aqui
  className?: string;         // precisa estar aqui
};

function Button({ children, onClick, style, className }: ButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.button} ${className ?? ""}`}
      onClick={onClick}
      style={style}          // repassa style
    >
      {children}
    </button>
  );
}



export default Button;
