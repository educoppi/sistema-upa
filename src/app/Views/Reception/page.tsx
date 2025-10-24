'use client'
import { Header } from "@/components/Header";
import TextField, { TextFieldReception, TextFieldPesquisa } from "@/components/TextField";
import { useState } from "react";
import { Button } from "react-bootstrap";
import axios, { AxiosResponse } from 'axios';
import style from "./styles.module.css";

export default function Reception() {

  const token = localStorage.getItem('token');
  const usuarioString = localStorage.getItem('usuario');
  const usuario = usuarioString ? JSON.parse(usuarioString) : null;

  const [pesquisaCPF, setPesquisaCPF] = useState("");

  function formatDate(dateString?: string) {
    if (!dateString) return " - ";
  
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Data inválida";
  
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // mês começa em 0
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  }

  const [paciente, setPaciente] = useState({
    name: '',
    lastName: '',
    cpf: '',
    phone: '',
    email: '',
    allergy: '',
    birthDate: '',
    situation: 'AGUARDANDO TRIAGEM'
  });


  // TA DANDO ERRO
  function cadastrar() {
    console.log(paciente)
    axios.post('https://projeto-integrador-lf6v.onrender.com/users/patient', paciente,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    )
      .then(function (response: AxiosResponse) {
        console.log("deu certo");
      })
      .catch(function () {
        console.log("erro");
      });
  }

  return (
    <>
      <Header name={usuario?.name || "Usuário"} />

      <div className={style.space}>

        <h1>Gerência de Pacientes</h1>

        <div className={style.pesquisaField}>
          <TextFieldPesquisa type="text" placeholder="Pesquise pelo CPF do Paciente" onChange={setPesquisaCPF} text={pesquisaCPF} />
            <Button className={style.buttonPesquisar}>Buscar</Button>
        </div>

        <div className={style.container}>

          <TextFieldReception type="text" label="Nome" placeholder="Nome" onChange={name => setPaciente({ ...paciente, name: name })} text={paciente.name} />

          <TextFieldReception type="text" label="Sobrenome" placeholder="Sobrenome" onChange={lastName => setPaciente({ ...paciente, lastName: lastName })} text={paciente.lastName} />

          <TextFieldReception type="text" label="CPF" placeholder="CPF" onChange={cpf => setPaciente({ ...paciente, cpf: cpf })} text={paciente.cpf} />

          <TextFieldReception type="text" label="Celular" placeholder="Celular" onChange={phone => setPaciente({ ...paciente, phone: phone })} text={paciente.phone} />

          <TextFieldReception type="text" label="Email" placeholder="Email" onChange={email => setPaciente({ ...paciente, email: email })} text={paciente.email} />

          <TextFieldReception type="text" label="Alergias" placeholder="Alergias" onChange={allergy => setPaciente({ ...paciente, allergy: allergy })} text={paciente.allergy} />

          <TextFieldReception type="date" label="Data de Nascimento" placeholder="Data de Nascimento" onChange={birthDate => setPaciente({ ...paciente, birthDate: new Date(birthDate).toLocaleDateString() })} text={paciente.birthDate} />


        </div>

          <Button className={style.buttonForm} onClick={cadastrar}>CADASTRAR</Button>

      </div>




    </>
  );
}