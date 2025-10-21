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

  const [usuario, setUsuario] = useState({
    id: 0,
    name: "",
    role: ""
  });

  function login(){
    axios.post('https://projeto-integrador-lf6v.onrender.com/users/login', { cpf, senha })
      .then(function (response: AxiosResponse) {
        setToken(response.data.token)
        const tokenRecebido = response.data.token
        getUser(tokenRecebido)
    })
        .catch(function () {
          console.log("erro")
    })
  }

  function getUser(tokenRecebido: string){
    console.log(tokenRecebido)
    axios.get('https://projeto-integrador-lf6v.onrender.com/users/logado', {
      headers: {
        'Authorization': `Bearer ${tokenRecebido}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log(response.data);
      localStorage.setItem('token', tokenRecebido);

      setUsuario({
        id: response.data.id,
        name: response.data.name,
        role: response.data.role[0]
      });

      localStorage.setItem('usuario', JSON.stringify(response.data));

      direcionaTela(response.data.role[0]);
    })
  }

  function direcionaTela(role: string) {
    console.log(usuario.role);

    if ( usuario.role === 'DOCTOR' ) {
      router.push('/Views/Doctor');
    }

    if( usuario.role === 'PHARMACY' ) {
      router.push('/Views/Farmacia');
    }

    if( usuario.role === 'RECEPCIONIST' ) {
      router.push('/Views/Reception');
    }

    if( usuario.role === 'NURSE' ) {
      router.push('/Views/Triage');
    }

  }

  return (
    <>
    <div className={style.tela}>
    <HeaderLogin />

    <br />
    <Link href="/Views/Doctor">Doutor</Link>
    <br />
    <Link href="/Views/Farmacia">Farmácia</Link>
    <br />
    <Link href="/Views/Reception">Recepção</Link>
    <br />
    <Link href="/Views/Triage">Triagem</Link>

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





