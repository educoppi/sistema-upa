'use client'
import styles from '@/app/Views/Farmacia/styles.module.css'
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import TextField from "@/components/TextField";
import MedicamentoModal from "@/components/MedicamentoModal";
import Button from '@/components/Button';
import Select from '@/components/Select';
import { Tabs, Tab, Alert } from 'react-bootstrap';
import axios, { AxiosResponse } from 'axios';
import { FaSortUp, FaSortDown } from "react-icons/fa";
import medicationService from '@/services/medication';
import Medication from '@/models/Medication';


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

  const [alerta, setAlerta] = useState<{ tipo: 'success' | 'danger', mensagem: string } | null>(null);

  const [isFiltered, setIsFiltered] = useState(false);

  const [modalEditar, setModalEditar] = useState(false)

  const [medicamentoSelecionado, setMedicamentoSelecionado] = useState<Medication>()

  const [estoqueBaixo, setEstoqueBaixo] = useState<any[]>([]);



  type CampoOrdenavel = "name" | "dosage" | "type" | "quantity" | "expiresAt";

  const [ordenarPor, setOrdenarPor] = useState<CampoOrdenavel | null>(null);
  const [ordemAscendente, setOrdemAscendente] = useState(true);

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



  async function cadastrar() {

    if (
      cadastrarMedicamento.name.trim() == '' ||
      cadastrarMedicamento.quantity.trim() == '' ||
      cadastrarMedicamento.dosage.trim() == '' ||
      cadastrarMedicamento.type == '' ||
      cadastrarMedicamento.expiresAt == ''
    ) {
      setAlerta({ tipo: 'danger', mensagem: 'Por favor, preencha todos os campos.' });
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

      setAlerta({ tipo: 'success', mensagem: 'Medicamento cadastrado com sucesso!' });
    } catch (error: unknown) {
      console.error('Erro ao criar medicamento:', axios.isAxiosError(error) ? error.response?.data || error.message : error);
      setAlerta({ tipo: 'danger', mensagem: 'Erro no cadastro de medicamento.' });
    }
  }


  type MedicamentoFiltro = {
    name?: string;
    type?: string;
    quantity?: number | string;
    dosage?: string;
  }

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
      setAlerta({
        tipo: 'danger',
        mensagem: `Erro: ${error}`
      });
    }
  }

  useEffect(() => {
    setToken(localStorage.getItem('token') || '');
    const usuarioString = localStorage.getItem('usuario');
    setUsuario(usuarioString ? JSON.parse(usuarioString) : null)
  }, []);


  async function buscarEstoqueBaixo() {
    try {
      const medicamentos = await medicationService.busca('', '', '');
      const abaixoDe300 = medicamentos.filter((m: any) => Number(m.quantity) < 300);
      setEstoqueBaixo(abaixoDe300);
    } catch (error) {
      console.error('Erro ao buscar estoque baixo:', error);
    }
  }

  useEffect(() => {
    const intervalo = setInterval(() => {
      buscarEstoqueBaixo();
    }, 30000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <>
      < Header name={usuario?.name || "Usuário"} />
      <Tabs
        defaultActiveKey="solicitacoes"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="solicitacoes" title="SOLICITAÇÕES">
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

              {alerta && (
                <Alert variant={alerta.tipo} onClose={() => setAlerta(null)} dismissible>
                  {alerta.mensagem}
                </Alert>
              )}


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
                                <td>{med.name}</td>
                                <td>{med.dosage}</td>
                                <td>{med.type}</td>
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
                onConfirm={() => { }}
              />
            )}
          </>
        </Tab>


        <Tab eventKey="estoque" title="ESTOQUE">

          <div className={styles.containerTabela}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>

              <Button onClick={buscarEstoqueBaixo}>ATUALIZAR</Button>
            </div>

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
                    <tr key={index} style={{ backgroundColor: '#ffe5e5' }}>
                      <td>{med.name}</td>
                      <td>{med.dosage}</td>
                      <td>{med.type}</td>
                      <td style={{ color: 'red', fontWeight: 'bold' }}>{med.quantity}</td>
                      <td>{new Date(med.expiresAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                Nenhum medicamento com estoque baixo encontrado.
              </div>
            )}
          </div>

        </Tab>

        <Tab eventKey="movement" title="MOVIMENTAÇÕES">


        </Tab>
      </Tabs >

      <br /><br /><br />
    </>


  );
}