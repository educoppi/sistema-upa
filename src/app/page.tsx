import Link from "next/link";
import style from "./page.module.css";
import Button from "@/components/Button";

export default function Home() {
  return (
    <>
        <Link className={style.link} href="/Views/Doctor">Login</Link>

        <div className={style.container}>
          <h3>Login</h3>
          <input type="text" />
          <input type="text" />
          <button>Login</button>
        </div>
    </>
  );
}





