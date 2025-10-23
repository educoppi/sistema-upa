import styles from './styles.module.css';

type Option = {
  value: string;
  label: string;
};

type Props = {
  label?: string;
  name: string;
  placeholder?: string;
  campo: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
};

export default function Select(props: Props) {
  return (
    <div>
      {props.label && (
        <>
          <label htmlFor={props.name}>{props.label}:</label>
          <br />
        </>
      )}
      <select
        className={styles.select}
        required
        id={props.name}
        name={props.name}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      >
        {props.placeholder && (
          <option value="" disabled>
            {props.placeholder}
          </option>
        )}
        {props.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
