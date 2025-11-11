'use client'
import styles from '@/app/Views/Farmacia/styles.module.css'
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import TextField from "@/components/TextField";
import MedicamentoModal from "@/components/MedicamentoModal";
import Button from '@/components/Button';
import Select from '@/components/Select';
import { Tabs, Tab } from 'react-bootstrap';
import axios, { AxiosResponse } from 'axios';
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { IoReloadCircle } from 'react-icons/io5';
import medicationService from '@/services/medication';
import Medication from '@/models/Medication';
import Movement from '@/models/Movement';
import api from '@/services/api';
import Swal from 'sweetalert2';



export default function Farmacia() {

  const [token, setToken] = useState('');
  const [usuario, setUsuario] = useState({ name: '', id: 0 });

  const [cadastrarMedicamento, setCadastrarMedicamento] = useState({
    name: '',
    dosage: '',
    type: '',
    quantity: '',
    expiresAt: '',
  });

  const [buscarMedicamento, setBuscarMedicamento] = useState({
    name: '',
    dosage: '',
    type: '',
  });

  const [resultadosBusca, setResultadosBusca] = useState<any[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [modalEditar, setModalEditar] = useState(false)
  const [medicamentoSelecionado, setMedicamentoSelecionado] = useState<Medication>()
  const [estoqueBaixo, setEstoqueBaixo] = useState<Medication[]>([]);
  const [vencendo, setVencendo] = useState<Medication[]>([]);
  const [ordenarPor, setOrdenarPor] = useState<CampoOrdenavel | null>(null);
  const [ordemAscendente, setOrdemAscendente] = useState(true);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [pendingMovements, setPendingMovements] = useState<Movement[]>([]);

  type CampoOrdenavel = "name" | "dosage" | "type" | "quantity" | "expiresAt";

  const ordenar = (campo: CampoOrdenavel) => {
    if (ordenarPor === campo) {
      setOrdemAscendente(!ordemAscendente);
    } else {
      setOrdenarPor(campo);
      setOrdemAscendente(true);
    }
  };

  const resultadosOrdenados = [...resultadosBusca].sort((a, b) => {
    if (!ordenarPor) return 0;

    if (ordenarPor === "expiresAt") {
      const dataA = new Date(a.expiresAt);
      const dataB = new Date(b.expiresAt);
      return ordemAscendente
        ? dataA.getTime() - dataB.getTime()
        : dataB.getTime() - dataA.getTime();
    }

    if (typeof a[ordenarPor] === "string" && typeof b[ordenarPor] === "string") {
      return ordemAscendente
        ? a[ordenarPor].localeCompare(b[ordenarPor])
        : b[ordenarPor].localeCompare(a[ordenarPor]);
    }

    if (typeof a[ordenarPor] === "number" && typeof b[ordenarPor] === "number") {
      return ordemAscendente
        ? (a[ordenarPor] as number) - (b[ordenarPor] as number)
        : (b[ordenarPor] as number) - (a[ordenarPor] as number);
    }

    return 0;
  });

  function tornarMaiusculo(text: string) {
    if (!text) return '';
    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  function traduzirMovementType(type: string | undefined) {
    if (!type) return '-';
    if (type.toLowerCase() === 'inbound') return 'Entrada';
    if (type.toLowerCase() === 'outbound') return 'Saída';
    return type;
  }


  async function cadastrar() {

    if (
      cadastrarMedicamento.name.trim() == '' ||
      cadastrarMedicamento.quantity.trim() == '' ||
      cadastrarMedicamento.dosage.trim() == '' ||
      cadastrarMedicamento.type == '' ||
      cadastrarMedicamento.expiresAt == ''
    ) {

      Swal.fire({
        icon: 'warning',
        title: 'Campos obrigatórios',
        text: 'Preencha todos os campos antes de cadastrar.',
        confirmButtonColor: '#3085d6',
      });

      return;
    }

    const body = {
      name: cadastrarMedicamento.name.toLowerCase(),
      quantity: cadastrarMedicamento.quantity,
      dosage: cadastrarMedicamento.dosage,
      type: cadastrarMedicamento.type,
      expiresAt: new Date(cadastrarMedicamento.expiresAt).toISOString(),
    };

    try {
      const response = await axios.post('https://projeto-integrador-lf6v.onrender.com/medications', body, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Resposta:', response.data);

      setCadastrarMedicamento({
        name: '',
        dosage: '',
        type: '',
        quantity: '',
        expiresAt: '',
      });

      Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Medicamento cadastrado com sucesso!',
        confirmButtonColor: '#3085d6',
      });

    } catch (error: unknown) {
      console.error('Erro ao criar medicamento:', axios.isAxiosError(error) ? error.response?.data || error.message : error);

      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Erro no cadastro de medicamento.',
        confirmButtonColor: '#d33',
      });
    }
  }


  type MedicamentoFiltro = {
    name?: string;
    type?: string;
    quantity?: number | string;
    dosage?: string;
  }

  type Movement = {
    id: number;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    movementType: string;
    approvedMovement: boolean;
    user: { name: string, lastName: string };
    doctor: { name: string, lastName: string };
    medication: { name: string };
  };


  async function buscarMedicamentos(filtros: MedicamentoFiltro) {

    const params = new URLSearchParams();

    if (filtros.name) params.append('name', filtros.name.toLowerCase());
    if (filtros.type) params.append('type', filtros.type.toLowerCase());
    if (filtros.dosage) params.append('dosage', filtros.dosage);

    try {
      const medications = await medicationService.busca(filtros.name, filtros.dosage, filtros.type)

      // const response = await axios.get(`https://projeto-integrador-lf6v.onrender.com/medications?${params.toString()}`, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });

      setIsFiltered(true)
      // setResultadosBusca(response.data);
      // console.log('Resultado da busca:', response.data);
      setResultadosBusca(medications);
      console.log('Resultado da busca:', medications);
    } catch (error: unknown) {
      // if (axios.isAxiosError(error)) {
      //   console.error('Erro ao buscar medicamentos:', error.response?.data || error.message);
      // } else {
      //   console.error('Erro inesperado:', error);
      // }
      // TODO: exibir mensagm de erro na UI
      Swal.fire({
        icon: 'error',
        title: 'Erro na busca',
        text: `Não foi possível buscar medicamentos: ${error}`,
        confirmButtonColor: '#d33',
      });

    }
  }

  useEffect(() => {
    setToken(localStorage.getItem('token') || '');
    const usuarioString = localStorage.getItem('usuario');
    setUsuario(usuarioString ? JSON.parse(usuarioString) : null);
  }, []);


  useEffect(() => {
    if (!token) return;

    buscarAlertas();

    const interval = setInterval(() => {
      buscarAlertas();
    }, 30000);

    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    const buscarTodasMovimentacoes = async () => {
      try {
        const response = await api.get('/movements');
        setMovements(response.data);
      } catch (error) {
        console.error('Erro ao carregar movimentos:', error);
      }
    };

    buscarTodasMovimentacoes();
  }, []);


  useEffect(() => {
    buscarMovimentosPendentes();
  }, []);


  const buscarMovimentosPendentes = async () => {


    try {
      const response = await api.get('/movements?approvedMovement=false');
      setPendingMovements(response.data);
    } catch (err) {
      console.error('Erro ao buscar movimentos pendentes:', err);
    }
  };
  

  const aprovarMovimento = async (id: number) => {
    if (!window.confirm('Deseja realmente aprovar este movimento?')) return;

    console.log(id)

    try {
      await api.put(`https://projeto-integrador-lf6v.onrender.com/movements/updateFarmacia/${id}`);
      alert('Movimento aprovado com sucesso!');
      buscarMovimentosPendentes();
    } catch (err) {
      console.error('Erro ao aprovar movimento:', err);
      alert('Erro ao aprovar movimento.');
    }
  };

  const buscarAlertas = async () => {
    try {
      const response = await api.get('/medications/alertas');
      setEstoqueBaixo(response.data.estoqueBaixo || []);
      setVencendo(response.data.vencendo || []);
    } catch (error) {
      console.error('Erro ao buscar alertas de medicamentos:', error);
    }
  };




  return (
    <>
      < Header name={usuario?.name || "Usuário"} />
      <Tabs
        defaultActiveKey="solicitacoes"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="solicitacoes" title="SOLICITAÇÕES">
          <div className={styles.tabelaEstoqueVencimento}>
            {pendingMovements.length > 0 ? (
              <table className={styles.tabela}>
                <thead>
                  <tr>
                    <th>Solicitado por</th>
                    <th>Medicamento</th>
                    <th>Quantidade</th>
                    <th>Data da Solicitação</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingMovements.map((mov) => (
                    <tr key={mov.id}>
                      <td>{tornarMaiusculo(mov.doctor ? `${mov.doctor.name} ${mov.doctor.lastName}` : '-')}</td>
                      <td>{tornarMaiusculo(mov.medication?.name || '-')}</td>
                      <td>{mov.quantity}</td>
                      <td>{new Date(mov.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Button
                          onClick={() => aprovarMovimento(mov.id)}
                        >
                          Aprovar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>Nenhuma solicitação pendente.</div>
            )}
          </div>

        </Tab>

        <Tab eventKey="cadastro" title="CADASTRO">
          <div className={styles.container}>

            <div className={styles.form}>
              <TextField type="text" label="Nome:" onChange={name => setCadastrarMedicamento({ ...cadastrarMedicamento, name: name })} text={cadastrarMedicamento.name} />
              <TextField type="text" label="Dosagem:" onChange={dosage => setCadastrarMedicamento({ ...cadastrarMedicamento, dosage: dosage })} text={cadastrarMedicamento.dosage} />
              <Select
                label="Tipo"
                name="type"
                placeholder="Selecione um tipo"
                campo="tipo"
                options={[
                  { value: 'comprimido', label: 'Comprimidos' },
                  { value: 'ampola', label: 'Ampola' },
                  { value: 'frasco', label: 'Frasco' },
                  { value: 'capsula', label: 'Cápsulas' },
                  { value: 'outro', label: 'Outro' },
                ]}
                value={cadastrarMedicamento.type}
                onChange={type => setCadastrarMedicamento({ ...cadastrarMedicamento, type: type })}
              />
              <TextField type="text" label="Quantidade:" onChange={quantity => setCadastrarMedicamento({ ...cadastrarMedicamento, quantity: quantity })} text={cadastrarMedicamento.quantity} />
              <TextField type="date" label="Vencimento:" onChange={expiresAt => setCadastrarMedicamento({ ...cadastrarMedicamento, expiresAt: expiresAt })} text={cadastrarMedicamento.expiresAt} />

              <Button onClick={cadastrar}>CADASTRAR</Button>

            </div>
          </div>
        </Tab>

        <Tab eventKey="busca" title="BUSCA">
          <>
            {!isFiltered && (
              <div className={styles.container}>
                <div className={styles.form}>
                  <TextField type="text" label="Nome:" onChange={name => setBuscarMedicamento({ ...buscarMedicamento, name: name })} text={buscarMedicamento.name} />
                  <TextField type="text" label="Dosagem:" onChange={dosage => setBuscarMedicamento({ ...buscarMedicamento, dosage: dosage })} text={buscarMedicamento.dosage} />
                  <Select
                    name="type"
                    placeholder="Tipo"
                    label="Tipo"
                    campo="tipo"
                    options={[
                      { value: 'comprimido', label: 'Comprimidos' },
                      { value: 'ampola', label: 'Ampola' },
                      { value: 'frasco', label: 'Frasco' },
                      { value: 'capsula', label: 'Cápsulas' },
                      { value: 'gotas', label: 'Gotas' },
                    ]}
                    onChange={type => setBuscarMedicamento({ ...buscarMedicamento, type: type })}
                    value={buscarMedicamento.type}
                  />

                  <Button onClick={() => buscarMedicamentos(buscarMedicamento)}>BUSCAR</Button>
                </div>
              </div>
            )}

            {isFiltered && (
              <>
                <div>
                  <div className={styles.buscaFiltrada}>
                    <TextField type="text" placeholder="Nome" onChange={name => setBuscarMedicamento({ ...buscarMedicamento, name: name })} text={buscarMedicamento.name} />
                    <TextField type="text" placeholder="Dosagem" onChange={dosage => setBuscarMedicamento({ ...buscarMedicamento, dosage: dosage })} text={buscarMedicamento.dosage} />
                    <Select
                      name="type"
                      placeholder="Tipo"
                      campo="tipo"
                      options={[
                        { value: 'comprimido', label: 'Comprimidos' },
                        { value: 'ampola', label: 'Ampola' },
                        { value: 'frasco', label: 'Frasco' },
                        { value: 'capsula', label: 'Cápsulas' },
                        { value: 'outro', label: 'Outro' },
                      ]}
                      onChange={type => setBuscarMedicamento({ ...buscarMedicamento, type: type })}
                      value={buscarMedicamento.type}
                    />

                    <Button onClick={() => buscarMedicamentos(buscarMedicamento)}>NOVA BUSCA</Button>
                    <Button onClick={() => {
                      setIsFiltered(false);
                      setBuscarMedicamento({
                        name: '',
                        dosage: '',
                        type: '',
                      })
                    }}>LIMPAR</Button>
                  </div>


                  {resultadosBusca.length > 0 ? (
                    <>
                      <div className={styles.containerTabela}>
                        <table className={styles.tabela}>
                          <thead>
                            <tr>
                              <th>
                                Nome
                                <button onClick={() => ordenar("name")}>
                                  {ordenarPor === "name" ? (
                                    ordemAscendente ? <FaSortUp /> : <FaSortDown />
                                  ) : (
                                    <FaSortDown style={{ opacity: 0.3 }} />
                                  )}
                                </button>
                              </th>
                              <th>
                                Dosagem
                                <button onClick={() => ordenar("dosage")}>
                                  {ordenarPor === "dosage" ? (
                                    ordemAscendente ? <FaSortUp /> : <FaSortDown />
                                  ) : (
                                    <FaSortDown style={{ opacity: 0.3 }} />
                                  )}
                                </button>
                              </th>
                              <th>
                                Tipo
                                <button onClick={() => ordenar("type")}>
                                  {ordenarPor === "type" ? (
                                    ordemAscendente ? <FaSortUp /> : <FaSortDown />
                                  ) : (
                                    <FaSortDown style={{ opacity: 0.3 }} />
                                  )}
                                </button>
                              </th>
                              <th>
                                Quantidade
                                <button onClick={() => ordenar("quantity")}>
                                  {ordenarPor === "quantity" ? (
                                    ordemAscendente ? <FaSortUp /> : <FaSortDown />
                                  ) : (
                                    <FaSortDown style={{ opacity: 0.3 }} />
                                  )}
                                </button>
                              </th>
                              <th>
                                Vencimento
                                <button onClick={() => ordenar("expiresAt")}>
                                  {ordenarPor === "expiresAt" ? (
                                    ordemAscendente ? <FaSortUp /> : <FaSortDown />
                                  ) : (
                                    <FaSortDown style={{ opacity: 0.3 }} />
                                  )}
                                </button>
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {resultadosOrdenados.map((med, index) => (
                              <tr onClick={() => { setMedicamentoSelecionado(med); setModalEditar(true) }} key={index}>
                                <td><strong>{tornarMaiusculo(med.name)}</strong></td>
                                <td>{med.dosage}</td>
                                <td>{tornarMaiusculo(med.type)}</td>
                                <td>{med.quantity}</td>
                                <td>{new Date(med.expiresAt).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                    </>
                  ) : (
                    <div className={styles.buscaFiltrada}>
                      <div className={styles.noResults}>
                        Nenhum medicamento encontrado.
                      </div>
                    </div>

                  )}

                </div>
              </>
            )}

            {modalEditar && medicamentoSelecionado && (
              <MedicamentoModal
                medicamento={medicamentoSelecionado}
                onClose={() => {
                  setModalEditar(false);
                  setMedicamentoSelecionado(undefined);
                }}
                onConfirm={() => {
                  buscarMedicamentos(buscarMedicamento);
                }}
              />
            )}
          </>
        </Tab>

        <Tab eventKey="estoque" title="ESTOQUE">
          <>
            <div className={styles.buscaFiltrada}>
              <Button onClick={buscarAlertas}>ATUALIZAR</Button>
            </div>

            <div
              className={styles.containerTabela}
            >
              {/* TABELA DE QUANTIDADE BAIXA */}
              <div className={styles.tabelaEstoqueVencimento}>
                <h5>Estoque Baixo</h5>

                {estoqueBaixo.length > 0 ? (
                  <table className={styles.tabela}>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Dosagem</th>
                        <th>Tipo</th>
                        <th>Quantidade</th>
                        <th>Vencimento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estoqueBaixo.map((med, index) => (
                        <tr key={index}>
                          <td><strong>{tornarMaiusculo(med.name)}</strong></td>
                          <td>{med.dosage}</td>
                          <td>{tornarMaiusculo(med.type)}</td>
                          <td style={{ color: 'red', fontWeight: 'bolder', backgroundColor: '#ffe5e5' }}>{med.quantity}</td>
                          <td>{new Date(med.expiresAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div>
                    Nenhum medicamento com estoque baixo encontrado.
                  </div>
                )}
              </div>

              {/* TABELA DE VENCIMENTO */}
              <div className={styles.tabelaEstoqueVencimento}>
                <h5>Vencimento próximo (30 dias)</h5>

                {vencendo.length > 0 ? (
                  <table className={styles.tabela}>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Dosagem</th>
                        <th>Tipo</th>
                        <th>Quantidade</th>
                        <th>Vencimento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vencendo.map((med, index) => (
                        <tr key={index} >
                          <td><strong>{tornarMaiusculo(med.name)}</strong></td>
                          <td>{med.dosage}</td>
                          <td>{tornarMaiusculo(med.type)}</td>
                          <td>{med.quantity}</td>
                          <td style={{ color: 'red', fontWeight: 'bolder', backgroundColor: '#ffe5e5' }}>
                            {new Date(med.expiresAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div>
                    Nenhum medicamento vencendo nos próximos 30 dias.
                  </div>
                )}
              </div>
            </div>
          </>
        </Tab>

        <Tab eventKey="movement" title="MOVIMENTAÇÕES">

          <div className={styles.buscaFiltrada}>
            {/*COLOCAR BOTÕES AQUI*/}
          </div>

          <div className={styles.tabelaEstoqueVencimento}>

            {movements.length > 0 ? (
              <table className={styles.tabela}>
                <thead>
                  <tr>
                    <th>Requisitado por</th>
                    <th>Aprovado por</th>
                    <th>Medicamento</th>
                    <th>Quantidade</th>
                    <th>Tipo</th>
                    <th>Solicitado em</th>
                    <th>Aprovado em</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((mov) => (
                    <tr key={mov.id}>
                      <td>{tornarMaiusculo(mov.doctor ? `${mov.doctor.name} ${mov.doctor.lastName}` : '-')}</td>
                      <td>{tornarMaiusculo(mov.user ? `${mov.user.name} ${mov.user.lastName}` : '-')}</td>
                      <td>{tornarMaiusculo(mov.medication?.name || '-')}</td>
                      <td>{mov.quantity}</td>
                      <td>{traduzirMovementType(mov.movementType)}</td>
                      <td>{new Date(mov.createdAt).toLocaleDateString()}</td>
                      <td>{new Date(mov.updatedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>Nenhum movimento encontrado.</div>
            )}
          </div>

        </Tab>
      </Tabs >
    </>


  );
}