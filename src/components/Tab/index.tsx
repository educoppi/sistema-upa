import styles from '@/components/Tab/styles.module.css'

type Props = {
    label: string;
    name: string;
    checked?: boolean;
    onClick?: () => void;
}

export default function Tab({ label, name, checked, onClick }: Props) {
    return (
        <label className={styles.root}>
            {label}
            <input type="radio" name={name} checked={checked} onClick={onClick} />
        </label>
    )
};