import styles from './styles.module.css';
import { CSSProperties } from "react";


type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  style?: CSSProperties;      
  className?: string;      
};

function Button({ children, onClick, style, className }: ButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.button} ${className ?? ""}`}
      onClick={onClick}
      style={style}          
    >
      {children}
    </button>
  );
}



export default Button;
