import styles from "./styles.module.css";

export default function UserIcon() {
    return (
        <>
        <div className={styles.container}>
            <h5>Dr. João</h5>
            <img className={styles.icon} src="https://static.vecteezy.com/system/resources/previews/019/879/186/large_2x/user-icon-on-transparent-background-free-png.png" alt="" />
        </div>
        </>
    );
}