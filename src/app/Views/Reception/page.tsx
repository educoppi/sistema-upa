'use client'
import { Header } from "@/components/Header";
import TextField from "@/components/TextField";
import { useState } from "react";
import { Button } from "react-bootstrap";
import axios, { AxiosResponse } from 'axios';

export default function Reception() {

  const token = localStorage.getItem('token');
  const usuarioString = localStorage.getItem('usuario');
  const usuario = usuarioString ? JSON.parse(usuarioString) : null;

  const [paciente, setPaciente] = useState({
    name: '',
    lastName: '',
    cpf: '',
    phone: '',
    email: '',
    allergy: '',
    birthDate: ''
  });

  function cadastrar() {
    axios.post('http://localhost:3000/users/patient', paciente,
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

      <TextField type="text" label="Nome" placeholder="Nome" onChange={name => setPaciente({ ...paciente, name: name })} text={paciente.name} />

      <TextField type="text" label="Sobrenome" placeholder="Sobrenome" onChange={lastName => setPaciente({ ...paciente, lastName: lastName })} text={paciente.lastName} />

      <TextField type="text" label="cpf" placeholder="cpf" onChange={cpf => setPaciente({ ...paciente, cpf: cpf })} text={paciente.cpf} />

      <TextField type="text" label="phone" placeholder="phone" onChange={phone => setPaciente({ ...paciente, phone: phone })} text={paciente.phone} />

      <TextField type="text" label="email" placeholder="email" onChange={email => setPaciente({ ...paciente, email: email })} text={paciente.email} />

      <TextField type="text" placeholder="Alergias" onChange={allergy => setPaciente({ ...paciente, allergy: allergy })} text={paciente.allergy}/>

      <TextField type="date" placeholder="Data de Nascimento" onChange={birthDate => setPaciente({ ...paciente, birthDate: birthDate })} text={paciente.birthDate}/>

      <Button onClick={cadastrar}>CADASTRAR</Button>
    </>
  );
}