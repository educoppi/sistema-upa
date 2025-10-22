'use client'
import styles from '@/app/Views/Farmacia/styles.module.css'
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import TextField from "@/components/TextField";
import Button from '@/components/Button';
import Select from '@/components/Select';
import { Tabs, Tab, Alert } from 'react-bootstrap';
import axios, { AxiosResponse } from 'axios';

export default function Farmacia() {

  const [token, setToken] = useState('');
  const [usuario, setUsuario] = useState({ name: '', id: 0 });

  // const token = localStorage.getItem('token');
  // const usuarioString = localStorage.getItem('usuario');
  // const usuario = usuarioString ? JSON.parse(usuarioString) : null;

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
  })

  const [resultadosBusca, setResultadosBusca] = useState<any[]>([]);

  const [alerta, setAlerta] = useState<{ tipo: 'success' | 'danger', mensagem: string } | null>(null);

  const [isFiltered, setIsFiltered] = useState(false)


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
      const response = await axios.get(`https://projeto-integrador-lf6v.onrender.com/medications?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setIsFiltered(true)
      setResultadosBusca(response.data);
      console.log('Resultado da busca:', response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Erro ao buscar medicamentos:', error.response?.data || error.message);
      } else {
        console.error('Erro inesperado:', error);
      }
    }
  }

  useEffect(() => {
    setToken(localStorage.getItem('token') || '');
    const usuarioString = localStorage.getItem('usuario');
    setUsuario(usuarioString ? JSON.parse(usuarioString) : null)
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
                  </div>


                  {resultadosBusca.length > 0 ? (
                    <>
                      <div className={styles.containerTabela}>
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
                            {resultadosBusca.map((med, index) => (
                              <tr key={index}>
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
                    <div className={styles.noResults}>
                      Nenhum medicamento encontrado.
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        </Tab>


        <Tab eventKey="estoque" title="ESTOQUE">

        </Tab>

        <Tab eventKey="movement" title="MOVIMENTAÇÕES">

              <Button>ATUALIZAR MEDICAMENTO</Button>
        </Tab>
      </Tabs >






      <br /><br /><br />







    </>
  );
}