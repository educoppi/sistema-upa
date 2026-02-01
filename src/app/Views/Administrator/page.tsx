'use client'
import { Header } from "@/components/Header";
import { TextFieldReception, TextFieldPesquisa } from "@/components/TextField";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import axios, { AxiosResponse } from 'axios';
import style from "./styles.module.css";
import Swal from 'sweetalert2';
import { FaTrash } from "react-icons/fa";
import { SiTabelog } from "react-icons/si";
import Select from "@/components/Select";

export default function Reception() {

  const [token, setToken] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    // Só executa no cliente
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('usuario');
    setToken(t);
    setUsuario(u ? JSON.parse(u) : null);
  }, []);

  const [pesquisaCPF, setPesquisaCPF] = useState("");

  const [atualizaUsuario, setAtualizaUsuario] = useState(false);

  const [limpaCampos, setLimpaCampos] = useState(false);

  const [deletarFuncionario, setDeletarFuncionario] = useState(false);

  const [cargo, setCargo] = useState("");

  const [funcionario, setFuncionario] = useState({
    id: 0,
    name: '',
    lastName: '',
    password: '',
    cpf: '',
    phone: '',
    email: '',
    birthDate: ''
  });

  function cadastrar() {

    if (atualizaUsuario) {

      console.log(funcionario);

      axios.put(`https://projeto-integrador-lf6v.onrender.com/users/${funcionario.id}`, funcionario,
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
            text: 'Usuário atualizado com sucesso!',
            confirmButtonColor: '#3085d6',
          });
        })
        .catch(function () {
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Erro ao atualizar Usuário.',
            confirmButtonColor: '#d33',
          });
        });
    } else {
      const funcionarioFormatado = {
        ...funcionario,
        group: parseInt(cargo),
        birthDate: funcionario.birthDate ? new Date(funcionario.birthDate).toISOString() : null
      }

      if (funcionario.name == "" || funcionario.lastName == "" || funcionario.cpf == "" || funcionario.phone == "" || funcionario.email == "" || funcionario.birthDate == "") {
        Swal.fire({
          icon: 'warning',
          title: 'Campos obrigatórios',
          text: 'Preencha os campos obrigatórios antes de cadastrar.',
          confirmButtonColor: '#3085d6',
        });

        return;
      }
      console.log(funcionarioFormatado);
      axios.post('https://projeto-integrador-lf6v.onrender.com/users', funcionarioFormatado,
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
            text: 'Funcionário cadastrado com sucesso!',
            confirmButtonColor: '#3085d6',
          });
        })
        .catch(function () {
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Erro ao cadastrar funcionário.',
            confirmButtonColor: '#d33',
          });
        });
    }

  }


  function buscarFuncionario() {
    axios.get(`https://projeto-integrador-lf6v.onrender.com/users/funcionario?cpf=${pesquisaCPF}`)
      .then(function (response: AxiosResponse) {

        const dados = Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : null;
        console.log(dados);

        setFuncionario({
          id: dados.id,
          name: dados.name,
          lastName: dados.lastName,
          password: dados.password,
          cpf: dados.cpf,
          phone: dados.phone,
          email: dados.email,
          birthDate: dados.birthDate
        });

        setAtualizaUsuario(true)

        setDeletarFuncionario(true);

        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Funcionário Buscado com sucesso!',
          confirmButtonColor: '#3085d6',
        });

        setLimpaCampos(true);

      })
      .catch(function () {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Erro ao buscar funcionário. CPF Incorreto!',
          confirmButtonColor: '#d33',
        });
      });
  }

  function limpaCamposPesquisa() {
    setFuncionario({
      id: 0,
      name: '',
      lastName: '',
      password: '',
      cpf: '',
      phone: '',
      email: '',
      birthDate: ''
    });
    setAtualizaUsuario(false);

    setPesquisaCPF("");

    setLimpaCampos(false);

    setDeletarFuncionario(false);
  }

  function deletar() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {

      if (!result.isConfirmed) return;

      axios.put(
        `https://projeto-integrador-lf6v.onrender.com/users/${funcionario.id}`,
        {
          situation: "DISABLED"
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      )
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "Sucesso!",
            text: "Funcionário desativado com sucesso!",
            confirmButtonColor: "#3085d6",
          });

          limpaCamposPesquisa();
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "Erro!",
            text: "Erro ao deletar funcionário.",
            confirmButtonColor: "#d33",
          });
        });

    });
  }




  return (
    <>
      <Header name={usuario?.name || "Usuário"} />

      <div className={style.space}>

        <h1>Gerência de Usuários</h1>

        <div className={style.pesquisaField}>
          <TextFieldPesquisa type="text" placeholder="Pesquise pelo CPF do Usuário" onChange={setPesquisaCPF} text={pesquisaCPF} />
          <Button onClick={buscarFuncionario} className={style.buttonPesquisar}>Buscar</Button>
        </div>

        <div className={style.container}>

          <TextFieldReception type="text" label="Nome" placeholder="Nome" required onChange={name => setFuncionario({ ...funcionario, name: name })} text={funcionario.name} />

          <TextFieldReception type="text" label="Sobrenome" placeholder="Sobrenome" required onChange={lastName => setFuncionario({ ...funcionario, lastName: lastName })} text={funcionario.lastName} />

          <TextFieldReception type="text" label="CPF" placeholder="CPF" required onChange={cpf => setFuncionario({ ...funcionario, cpf: cpf })} text={funcionario.cpf} />

          <TextFieldReception type="text" label="Celular" placeholder="Celular" required onChange={phone => setFuncionario({ ...funcionario, phone: phone })} text={funcionario.phone} />

          <TextFieldReception type="text" label="Email" placeholder="Email" required onChange={email => setFuncionario({ ...funcionario, email: email })} text={funcionario.email} />

          <TextFieldReception type="date" label="Data de Nascimento" placeholder="Data de Nascimento" required onChange={birthDate => setFuncionario({ ...funcionario, birthDate: birthDate })} text={funcionario.birthDate ? funcionario.birthDate.split('T')[0] : ''} />

          <TextFieldReception type="password" label="Senha" placeholder="Senha" required onChange={password => setFuncionario({ ...funcionario, password: password })} text={funcionario.password} />


          <Select
            label="Cargo"
            name="cargo"
            placeholder="Selecione um cargo"
            campo="cargo"
            options={[
              { value: '1', label: 'Recepcionista' },
              { value: '2', label: 'Doutor(a)' },
              { value: '3', label: 'Farmacêutico(a)' },
              { value: '5', label: 'Enfermeiro(a)' },
              { value: '6', label: 'Administrador(a)' },
            ]}
            value={cargo}
            onChange={setCargo}
          />

        </div>

        <div className={style.buttons}>

          {
            limpaCampos && (

              <>
                <Button className={style.buttonClear} onClick={limpaCamposPesquisa}> Limpar Campos </Button>
              </>

            )
          }

          <Button className={style.buttonForm} onClick={cadastrar}> {atualizaUsuario ? "Atualizar" : "Cadastrar"} </Button>

          {
            deletarFuncionario && (
              <>
                <Button
                  className={style.deleteButton}
                  onClick={deletar}
                  title="Deletar"
                >
                  <FaTrash />
                </Button>
              </>
            )
          }
        </div>
      </div>
    </>
  );
}