import Link from "next/link";
import style from "./page.module.css";

export default function Home() {
  return (
    <>
        <Link className={style.link} href="/Views/Doctor">Login</Link>

        <div className={style.container}>
          
        </div>
    </>
  );
}





