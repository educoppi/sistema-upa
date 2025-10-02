import styles from '@/components/TabBar/styles.module.css'

type Props = {
    label: string;
    className: string;
    name: string;
    checked?: boolean;
    onClick:() => void;
}

export default function Tab({label, className, name, checked, onClick}: Props) {
    return (
        <div>
            <label className={className}>
                {label}
                <input type="radio" name={name} checked={checked} onClick={onClick} />
            </label>
        </div>
    )
};