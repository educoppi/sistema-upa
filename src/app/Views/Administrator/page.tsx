'use client'
import { Header } from "@/components/Header";
import { TextFieldReception, TextFieldPesquisa } from "@/components/TextField";
import { useEffect, useState } from "react";
import { Button, Toast, ToastContainer, Modal } from "react-bootstrap"; // adicionados Toast, ToastContainer e Modal
import axios, { AxiosResponse } from 'axios';
import style from "./styles.module.css";
import { FaTrash } from "react-icons/fa";
import Select from "@/components/Select";

interface ToastItem {
  id: number;
  message: string;
  variant: string;
  title?: string;
}

export default function Reception() {
  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<any>(null);
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

  // --- Estado para toasts ---
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Função para adicionar um toast
  const addToast = (message: string, variant: string = 'success', title: string = '') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, variant, title }]);
    // Remove automaticamente após 3 segundos
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // --- Estado e funções para o Modal de confirmação de exclusão ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    executarDelete(); // chama a função que faz a requisição de exclusão
  };

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('usuario');
    setToken(t);
    setUsuario(u ? JSON.parse(u) : null);
  }, []);

  function cadastrar() {
    if (atualizaUsuario) {
      axios.put(`https://projeto-integrador-lf6v.onrender.com/users/${funcionario.id}`, funcionario,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )
        .then(function () {
          addToast('Usuário atualizado com sucesso!', 'success', 'Sucesso');
        })
        .catch(function () {
          addToast('Erro ao atualizar Usuário.', 'danger', 'Erro');
        });
    } else {
      const funcionarioFormatado = {
        ...funcionario,
        group: parseInt(cargo),
        birthDate: funcionario.birthDate ? new Date(funcionario.birthDate).toISOString() : null
      }

      if (funcionario.name == "" || funcionario.lastName == "" || funcionario.cpf == "" || funcionario.phone == "" || funcionario.email == "" || funcionario.birthDate == "") {
        addToast('Preencha os campos obrigatórios antes de cadastrar.', 'warning', 'Campos obrigatórios');
        return;
      }

      axios.post('https://projeto-integrador-lf6v.onrender.com/users', funcionarioFormatado,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      )
        .then(function () {
          addToast('Funcionário cadastrado com sucesso!', 'success', 'Sucesso');
        })
        .catch(function () {
          addToast('Erro ao cadastrar funcionário.', 'danger', 'Erro');
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

        setAtualizaUsuario(true);
        setDeletarFuncionario(true);
        addToast('Funcionário Buscado com sucesso!', 'success', 'Sucesso');
        setLimpaCampos(true);
      })
      .catch(function () {
        addToast('Erro ao buscar funcionário. CPF Incorreto!', 'danger', 'Erro');
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

  function executarDelete() {
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
      .then(() => {
        addToast('Funcionário desativado com sucesso!', 'success', 'Sucesso');
        limpaCamposPesquisa();
      })
      .catch(() => {
        addToast('Erro ao deletar funcionário.', 'danger', 'Erro');
      });
  }

  function deletar() {
    setShowDeleteModal(true);
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
          {limpaCampos && (
            <Button className={style.buttonClear} onClick={limpaCamposPesquisa}> Limpar Campos </Button>
          )}
          <Button className={style.buttonForm} onClick={cadastrar}> {atualizaUsuario ? "Atualizar" : "Cadastrar"} </Button>
          {deletarFuncionario && (
            <Button
              className={style.deleteButton}
              onClick={deletar}
              title="Deletar"
            >
              <FaTrash />
            </Button>
          )}
        </div>
      </div>

      {/* Toast Container - mesmos estilos da outra página */}
      <ToastContainer position="bottom-end" className="p-3">
        {toasts.map((toast) => (
          <Toast key={toast.id} bg={toast.variant} autohide delay={3000}>

            <Toast.Body style={{ color: "white", fontWeight: "bold" }}>
              {toast.message}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>

      {/* Modal de confirmação para exclusão */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tem certeza que deseja desativar este funcionário? Essa ação não poderá ser desfeita.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}