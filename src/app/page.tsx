import Link from "next/link";
import style from "./page.module.css";
import Button from "@/components/Button";
import TextField from "@/components/TextField";
import { HeaderLogin } from "@/components/Header";

export default function Home() {

  

  return (
    <>
    <div className={style.tela}>
      <HeaderLogin />

    <Link href="/Views/Doctor">Login</Link>
    <Link href="/Views/Farmacia">Farmácia</Link>

      <div className={style.centralizador}>

        <div className={style.container}>

          <h3 className={style.titulo}>LOGIN</h3>
          <div className={style.inputs}>
            < TextField label="CPF" placeholder="CPF"/>
            < TextField label="Senha" placeholder="Senha"/>
          </div>
          <Button>ENTRAR</Button>
          
        </div>
      </div>

    </div>
    </>
  );
}





