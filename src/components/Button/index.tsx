import styles from './styles.module.css';
import { CSSProperties } from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
  className?: string;
  disabled?: boolean;
};

export default function Button({ children, onClick, style, className, disabled = false }: ButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.button} ${className ?? ""}`}
      onClick={onClick}
      style={style}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
