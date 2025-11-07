'use client'
import { Header } from "@/components/Header";
import TextField, { TextFieldReception, TextFieldPesquisa } from "@/components/TextField";
import { useState } from "react";
import { Button } from "react-bootstrap";
import axios, { AxiosResponse } from 'axios';
import style from "./styles.module.css";
import Swal from 'sweetalert2';

export default function Reception() {

  const token = localStorage.getItem('token');
  const usuarioString = localStorage.getItem('usuario');
  const usuario = usuarioString ? JSON.parse(usuarioString) : null;

  const [pesquisaCPF, setPesquisaCPF] = useState("");

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
    const pacienteFormatado = {
      ...paciente,
      birthDate: paciente.birthDate ? new Date(paciente.birthDate).toISOString() : null
    }

    if(paciente.name == "" || paciente.lastName == "" || paciente.cpf == "" || paciente.phone == "" || paciente.email == "" || paciente.birthDate == "" ){
      Swal.fire({
        icon: 'warning',
        title: 'Campos obrigatórios',
        text: 'Preencha os campos obrigatórios antes de cadastrar.',
        confirmButtonColor: '#3085d6',
      });

      return;
    }
    console.log(paciente)
    axios.post('https://projeto-integrador-lf6v.onrender.com/users/patient', pacienteFormatado,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    )
      .then(function (response: AxiosResponse) {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Paciente cadastrado com sucesso!',
          confirmButtonColor: '#3085d6',
        });
      })
      .catch(function () {
              Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Erro ao Cadastrar Paciente.',
                confirmButtonColor: '#d33',
              });
      });
  }


  function buscarPaciente() {
    axios.get(`https://projeto-integrador-lf6v.onrender.com/users?cpf=${pesquisaCPF}`
    )
      .then(function (response: AxiosResponse) {

        const dados = Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : null;
        console.log(dados);

        setPaciente({
          name: dados.name || "",
          lastName: dados.lastName || "",
          cpf: dados.cpf || "",
          phone: dados.phone || "",
          email: dados.email || "",
          allergy: dados.allergy || "",
          birthDate: dados.birthDate || "",
          situation: dados.situation || "AGUARDANDO TRIAGEM"
        });

      })
      .catch(function () {
              Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Erro ao buscar paciente. CPF Incorreto!',
                confirmButtonColor: '#d33',
              });
      });
  }

  return (
    <>
      <Header name={usuario?.name || "Usuário"} />

      <div className={style.space}>

        <h1>Gerência de Pacientes</h1>

        <div className={style.pesquisaField}>
          <TextFieldPesquisa type="text" placeholder="Pesquise pelo CPF do Paciente" onChange={setPesquisaCPF} text={pesquisaCPF} />
          <Button onClick={buscarPaciente} className={style.buttonPesquisar}>Buscar</Button>
        </div>

        <div className={style.container}>

          <TextFieldReception type="text" label="Nome" placeholder="Nome" required onChange={name => setPaciente({ ...paciente, name: name })} text={paciente.name} />

          <TextFieldReception type="text" label="Sobrenome" placeholder="Sobrenome" required onChange={lastName => setPaciente({ ...paciente, lastName: lastName })} text={paciente.lastName} />

          <TextFieldReception type="text" label="CPF" placeholder="CPF" required onChange={cpf => setPaciente({ ...paciente, cpf: cpf })} text={paciente.cpf} />

          <TextFieldReception type="text" label="Celular" placeholder="Celular" required onChange={phone => setPaciente({ ...paciente, phone: phone })} text={paciente.phone} />

          <TextFieldReception type="text" label="Email" placeholder="Email" required onChange={email => setPaciente({ ...paciente, email: email })} text={paciente.email} />

          <TextFieldReception type="text" label="Alergias" placeholder="Alergias" onChange={allergy => setPaciente({ ...paciente, allergy: allergy })} text={paciente.allergy} />

          <TextFieldReception type="date" label="Data de Nascimento" placeholder="Data de Nascimento" required onChange={birthDate => setPaciente({ ...paciente, birthDate: birthDate })} text={paciente.birthDate ? paciente.birthDate.split('T')[0] : ''} />


        </div>

        <Button className={style.buttonForm} onClick={cadastrar}>CADASTRAR</Button>

      </div>




    </>
  );
}