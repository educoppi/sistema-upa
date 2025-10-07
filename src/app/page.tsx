'use client'
import Link from "next/link";
import style from "./page.module.css";
import Button from "@/components/Button";
import TextField from "@/components/TextField";
import { HeaderLogin } from "@/components/Header";
import axios, { AxiosResponse } from 'axios';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");

  const [token, setToken] = useState("");

  function login(){
    axios.post('http://localhost:3000/users/login', { cpf, senha })
      .then(function (response: AxiosResponse) {
        setToken(response.data.token)
        getUser(token)
    })
        .catch(function () {
          console.log("erro")
    })
  }

  function getUser(tokenRecebido: string){
    console.log(tokenRecebido)
    axios.get('http://localhost:3000/users/logado', {
      headers: {
        'Authorization': `Bearer ${tokenRecebido}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log(response.data)
      localStorage.setItem('token', tokenRecebido);
      localStorage.setItem('usuario', JSON.stringify(response.data));

      direcionaTela()
    })
  }

  function direcionaTela() {
    router.push('/Views/Doctor')
  }




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
            < TextField type="text" label="CPF" placeholder="CPF" onChange={setCpf} text={cpf}/>
            < TextField type="password" label="Senha" placeholder="Senha" onChange={setSenha} text={senha}/>
          </div>

          <Button onClick={login}>ENTRAR</Button>
          
        </div>
      </div>

    </div>
    </>
  );
}





