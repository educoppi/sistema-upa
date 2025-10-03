import styles from './styles.module.css';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

function Button({ children, onClick }: ButtonProps) {
  return (
    <button 
      type="button" 
      className={styles.button}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
