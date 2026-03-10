"use client";
import styles from "@/app/Views/Farmacia/styles.module.css";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import TextField from "@/components/TextField";
import MedicamentoModal from "@/components/MedicamentoModal";
import Button from "@/components/Button";
import Select from "@/components/Select";
import { Tabs, Tab } from "react-bootstrap";
import axios, { AxiosResponse } from "axios";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { IoReloadCircle } from "react-icons/io5";
import medicationService from "@/services/medication";
import Medication from "@/models/Medication";
import Movement from "@/models/Movement";
import api from "@/services/api";
import Swal from "sweetalert2";
import { BiBorderRadius } from "react-icons/bi";

export default function Farmacia() {
  const [token, setToken] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("usuario");
    setToken(t);
    setUsuario(u ? JSON.parse(u) : null);
  }, []);

  const [cadastrarMedicamento, setCadastrarMedicamento] = useState({
    name: "",
    dosage: "",
    type: "",
    quantity: "",
    expiresAt: "",
  });

  const [buscarMedicamento, setBuscarMedicamento] = useState({
    name: "",
    dosage: "",
    type: "",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [resultadosBusca, setResultadosBusca] = useState<any[]>([]);
  const [modalEditar, setModalEditar] = useState(false);
  const [medicamentoSelecionado, setMedicamentoSelecionado] =
    useState<Medication>();
  const [estoqueBaixo, setEstoqueBaixo] = useState<Medication[]>([]);
  const [vencendo, setVencendo] = useState<Medication[]>([]);
  const [ordenarPor, setOrdenarPor] = useState<CampoOrdenavel | null>(null);
  const [ordemAscendente, setOrdemAscendente] = useState(true);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [pendingMovements, setPendingMovements] = useState<Movement[]>([]);

  const [filtroMov, setFiltroMov] = useState({
    nome: "",
    medicamento: "",
    data: "",
    tipo: "",
  });

  type CampoOrdenavel = "name" | "dosage" | "type" | "quantity" | "expiresAt";

  const ordenar = (campo: CampoOrdenavel) => {
    if (ordenarPor === campo) {
      setOrdemAscendente(!ordemAscendente);
    } else {
      setOrdenarPor(campo);
      setOrdemAscendente(true);
    }
  };

  const medicamentosFiltrados = resultadosBusca.filter((med) => {
    const nome = buscarMedicamento.name.toLowerCase().trim();
    const dosage = buscarMedicamento.dosage.toLowerCase().trim();
    const tipo = buscarMedicamento.type.toLowerCase().trim();

    return (
      (nome === "" || med.name.toLowerCase().includes(nome)) &&
      (dosage === "" || med.dosage.toLowerCase().includes(dosage)) &&
      (tipo === "" || med.type.toLowerCase() === tipo)
    );
  });

  const resultadosOrdenados = [...medicamentosFiltrados].sort((a, b) => {
    if (!ordenarPor) return 0;

    if (ordenarPor === "expiresAt") {
      const dataA = new Date(a.expiresAt);
      const dataB = new Date(b.expiresAt);
      return ordemAscendente
        ? dataA.getTime() - dataB.getTime()
        : dataB.getTime() - dataA.getTime();
    }

    if (
      typeof a[ordenarPor] === "string" &&
      typeof b[ordenarPor] === "string"
    ) {
      return ordemAscendente
        ? a[ordenarPor].localeCompare(b[ordenarPor])
        : b[ordenarPor].localeCompare(a[ordenarPor]);
    }

    if (
      typeof a[ordenarPor] === "number" &&
      typeof b[ordenarPor] === "number"
    ) {
      return ordemAscendente
        ? (a[ordenarPor] as number) - (b[ordenarPor] as number)
        : (b[ordenarPor] as number) - (a[ordenarPor] as number);
    }

    return 0;
  });

  function tornarMaiusculo(text: string) {
    if (!text) return "";
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function traduzirMovementType(type: string | undefined) {
    if (!type) return "-";
    if (type.toLowerCase() === "inbound") return "Entrada";
    if (type.toLowerCase() === "outbound") return "Saída";
    return type;
  }

  async function cadastrar() {
    if (
      cadastrarMedicamento.name.trim() == "" ||
      cadastrarMedicamento.quantity.trim() == "" ||
      cadastrarMedicamento.dosage.trim() == "" ||
      cadastrarMedicamento.type == "" ||
      cadastrarMedicamento.expiresAt == ""
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos obrigatórios",
        text: "Preencha todos os campos antes de cadastrar.",
        confirmButtonColor: "#3085d6",
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
      const response = await axios.post(
        "https://projeto-integrador-lf6v.onrender.com/medications",
        body,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Resposta:", response.data);

      setCadastrarMedicamento({
        name: "",
        dosage: "",
        type: "",
        quantity: "",
        expiresAt: "",
      });

      Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Medicamento cadastrado com sucesso!",
        confirmButtonColor: "#3085d6",
      });
    } catch (error: unknown) {
      console.error(
        "Erro ao criar medicamento:",
        axios.isAxiosError(error)
          ? error.response?.data || error.message
          : error,
      );

      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: "Erro no cadastro de medicamento.",
        confirmButtonColor: "#d33",
      });
    }
  }

  type MedicamentoFiltro = {
    name?: string;
    type?: string;
    quantity?: number | string;
    dosage?: string;
  };

  type Movement = {
    id: number;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    movementType: string;
    approvedMovement: boolean;
    user: { name: string; lastName: string };
    doctor: { name: string; lastName: string };
    medication: { name: string };
  };

  async function buscarMedicamentos(filtros: MedicamentoFiltro) {
    const params = new URLSearchParams();

    if (filtros.name) params.append("name", filtros.name.toLowerCase());
    if (filtros.type) params.append("type", filtros.type.toLowerCase());
    if (filtros.dosage) params.append("dosage", filtros.dosage);

    try {
      const medications = await medicationService.busca(
        filtros.name,
        filtros.dosage,
        filtros.type,
      );

      // const response = await axios.get(`https://projeto-integrador-lf6v.onrender.com/medications?${params.toString()}`, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });

      // setResultadosBusca(response.data);
      // console.log('Resultado da busca:', response.data);
      setResultadosBusca(medications);
      console.log("Resultado da busca:", medications);
    } catch (error: unknown) {
      // if (axios.isAxiosError(error)) {
      //   console.error('Erro ao buscar medicamentos:', error.response?.data || error.message);
      // } else {
      //   console.error('Erro inesperado:', error);
      // }
      // TODO: exibir mensagm de erro na UI
      Swal.fire({
        icon: "error",
        title: "Erro na busca",
        text: `Não foi possível buscar medicamentos: ${error}`,
        confirmButtonColor: "#d33",
      });
    }
  }

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
    const usuarioString = localStorage.getItem("usuario");
    setUsuario(usuarioString ? JSON.parse(usuarioString) : null);
  }, []);

  useEffect(() => {
    if (!token) return;

    buscarAlertas();

    const interval = setInterval(() => {
      buscarAlertas();
      buscarMovimentosPendentes();
      buscarTodasMovimentacoes;
    }, 30000);

    return () => clearInterval(interval);
  }, [token]);

  const buscarTodasMovimentacoes = async () => {
    try {
      const response = await api.get("/movements");
      setMovements(response.data);
    } catch (error) {
      console.error("Erro ao carregar movimentos:", error);
    }
  };

  const movementsFiltrados = movements.filter((mov) => {
    if (!mov.approvedMovement) return false;

    const nomeRequisitado =
      `${mov.doctor?.name || ""} ${mov.doctor?.lastName || ""}`.toLowerCase();
    const nomeAprovador =
      `${mov.user?.name || ""} ${mov.user?.lastName || ""}`.toLowerCase();
    const nomeMedicamento = mov.medication?.name?.toLowerCase() || "";
    const dataSolicitacao = new Date(mov.createdAt).toLocaleDateString("pt-BR");
    const dataAprovacao = new Date(mov.updatedAt).toLocaleDateString("pt-BR");
    const tipoMov = mov.movementType?.toLowerCase();

    const filtroNome = filtroMov.nome.toLowerCase();
    const filtroMed = filtroMov.medicamento.toLowerCase();
    const filtroData = filtroMov.data;
    const filtroTipo = filtroMov.tipo.toLowerCase();

    const nomeMatch =
      filtroNome === "" ||
      nomeRequisitado.includes(filtroNome) ||
      nomeAprovador.includes(filtroNome);

    const medicamentoMatch =
      filtroMed === "" || nomeMedicamento.includes(filtroMed);

    let dataMatch = true;
    if (filtroData) {
      const dataObj = new Date(filtroData + "T00:00:00");
      const dataSolic = new Date(mov.createdAt);
      const dataAprov = new Date(mov.updatedAt);
      dataMatch =
        dataSolic.toDateString() === dataObj.toDateString() ||
        dataAprov.toDateString() === dataObj.toDateString();
    }

    const tipoMatch =
      filtroTipo === "" ||
      (filtroTipo === "entrada" && tipoMov === "inbound") ||
      (filtroTipo === "saída" && tipoMov === "outbound");

    return nomeMatch && medicamentoMatch && dataMatch && tipoMatch;
  });

  useEffect(() => {
    buscarTodasMovimentacoes();
    buscarMovimentosPendentes();
    buscarMedicamentos({ name: "", dosage: "", type: "" });
  }, []);

  const buscarMovimentosPendentes = async () => {
    try {
      const response = await api.get("/movements?approvedMovement=false");
      setPendingMovements(response.data);
    } catch (err) {
      console.error("Erro ao buscar movimentos pendentes:", err);
    }
  };

  const aprovarMovimento = async (id: number) => {
    const result = await Swal.fire({
      title: "Deseja aprovar essa solicitação de medicamento?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim, aprovar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    console.log(id);

    try {
      await api.put(
        `https://projeto-integrador-lf6v.onrender.com/movements/updateFarmacia/${id}`,
      );

      Swal.fire({
        icon: "success",
        title: "Solicitação aprovada!",
        confirmButtonColor: "#3085d6",
      });

      buscarMovimentosPendentes();
    } catch (err) {
      console.error("Erro ao aprovar solicitação:", err);

      Swal.fire({
        icon: "error",
        title: "Erro ao aprovar movimento",
        text: "Ocorreu um problema ao tentar aprovar esta solicitação.",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const buscarAlertas = async () => {
    try {
      const response = await api.get("/medications/alertas");
      setEstoqueBaixo(response.data.estoqueBaixo || []);
      setVencendo(response.data.vencendo || []);
    } catch (error) {
      console.error("Erro ao buscar alertas de medicamentos:", error);
    }
  };

  return (
    <>
      <Header name={usuario?.name || "Usuário"} />
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
                      <td>
                        {tornarMaiusculo(
                          mov.doctor
                            ? `${mov.doctor.name} ${mov.doctor.lastName}`
                            : "-",
                        )}
                      </td>
                      <td>{tornarMaiusculo(mov.medication?.name || "-")}</td>
                      <td>{mov.quantity}</td>
                      <td>{new Date(mov.createdAt).toLocaleDateString()}</td>
                      <td style={{ textAlign: "center" }}>
                        <Button
                          style={{ borderRadius: "5px" }}
                          onClick={() => aprovarMovimento(mov.id)}
                        >
                          APROVAR
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
              <TextField
                type="text"
                label="Nome:"
                onChange={(name) =>
                  setCadastrarMedicamento({
                    ...cadastrarMedicamento,
                    name: name,
                  })
                }
                text={cadastrarMedicamento.name}
              />
              <TextField
                type="text"
                label="Dosagem:"
                onChange={(dosage) =>
                  setCadastrarMedicamento({
                    ...cadastrarMedicamento,
                    dosage: dosage,
                  })
                }
                text={cadastrarMedicamento.dosage}
              />
              <Select
                label="Tipo"
                name="type"
                placeholder="Selecione um tipo"
                campo="tipo"
                options={[
                  { value: "comprimido", label: "Comprimidos" },
                  { value: "ampola", label: "Ampola" },
                  { value: "frasco", label: "Frasco" },
                  { value: "capsula", label: "Cápsulas" },
                  { value: "outro", label: "Outro" },
                ]}
                value={cadastrarMedicamento.type}
                onChange={(type) =>
                  setCadastrarMedicamento({
                    ...cadastrarMedicamento,
                    type: type,
                  })
                }
              />
              <TextField
                type="text"
                label="Quantidade:"
                onChange={(quantity) =>
                  setCadastrarMedicamento({
                    ...cadastrarMedicamento,
                    quantity: quantity,
                  })
                }
                text={cadastrarMedicamento.quantity}
              />
              <TextField
                type="date"
                label="Vencimento:"
                onChange={(expiresAt) =>
                  setCadastrarMedicamento({
                    ...cadastrarMedicamento,
                    expiresAt: expiresAt,
                  })
                }
                text={cadastrarMedicamento.expiresAt}
              />

              <Button style={{ borderRadius: "5px" }} onClick={cadastrar}>
                CADASTRAR
              </Button>
            </div>
          </div>
        </Tab>

        <Tab eventKey="busca" title="BUSCA">
          <>
            <div className={styles.buscaFiltrada}>
              <TextField
                type="text"
                placeholder="Nome"
                onChange={(name) =>
                  setBuscarMedicamento({ ...buscarMedicamento, name })
                }
                text={buscarMedicamento.name}
              />
              <TextField
                type="text"
                placeholder="Dosagem"
                onChange={(dosage) =>
                  setBuscarMedicamento({ ...buscarMedicamento, dosage })
                }
                text={buscarMedicamento.dosage}
              />
              <Select
                name="type"
                placeholder="Tipo"
                campo="tipo"
                options={[
                  { value: "comprimido", label: "Comprimidos" },
                  { value: "ampola", label: "Ampola" },
                  { value: "frasco", label: "Frasco" },
                  { value: "capsula", label: "Cápsulas" },
                  { value: "gotas", label: "Gotas" },
                  { value: "outro", label: "Outro" },
                ]}
                onChange={(type) =>
                  setBuscarMedicamento({ ...buscarMedicamento, type })
                }
                value={buscarMedicamento.type}
              />

              <Button
                style={{ borderRadius: "5px" }}
                onClick={() => {
                  setBuscarMedicamento({ name: "", dosage: "", type: "" });
                }}
              >
                LIMPAR
              </Button>

              <Button
                style={{ borderRadius: "5px" }}
                onClick={() =>
                  buscarMedicamentos({ name: "", dosage: "", type: "" })
                }
              >
                ATUALIZAR
              </Button>
            </div>

            {medicamentosFiltrados.length > 0 ? (
              <div className={styles.containerTabela}>
                <table className={styles.tabela}>
                  <thead>
                    <tr>
                      <th>
                        Nome
                        <button onClick={() => ordenar("name")}>
                          {ordenarPor === "name" ? (
                            ordemAscendente ? (
                              <FaSortUp />
                            ) : (
                              <FaSortDown />
                            )
                          ) : (
                            <FaSortDown style={{ opacity: 0.3 }} />
                          )}
                        </button>
                      </th>
                      <th>
                        Dosagem
                        <button onClick={() => ordenar("dosage")}>
                          {ordenarPor === "dosage" ? (
                            ordemAscendente ? (
                              <FaSortUp />
                            ) : (
                              <FaSortDown />
                            )
                          ) : (
                            <FaSortDown style={{ opacity: 0.3 }} />
                          )}
                        </button>
                      </th>
                      <th>
                        Tipo
                        <button onClick={() => ordenar("type")}>
                          {ordenarPor === "type" ? (
                            ordemAscendente ? (
                              <FaSortUp />
                            ) : (
                              <FaSortDown />
                            )
                          ) : (
                            <FaSortDown style={{ opacity: 0.3 }} />
                          )}
                        </button>
                      </th>
                      <th>
                        Quantidade
                        <button onClick={() => ordenar("quantity")}>
                          {ordenarPor === "quantity" ? (
                            ordemAscendente ? (
                              <FaSortUp />
                            ) : (
                              <FaSortDown />
                            )
                          ) : (
                            <FaSortDown style={{ opacity: 0.3 }} />
                          )}
                        </button>
                      </th>
                      <th>
                        Vencimento
                        <button onClick={() => ordenar("expiresAt")}>
                          {ordenarPor === "expiresAt" ? (
                            ordemAscendente ? (
                              <FaSortUp />
                            ) : (
                              <FaSortDown />
                            )
                          ) : (
                            <FaSortDown style={{ opacity: 0.3 }} />
                          )}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicamentosFiltrados.map((med, index) => (
                      <tr
                        key={index}
                        onClick={() => {
                          setMedicamentoSelecionado(med);
                          setModalEditar(true);
                        }}
                      >
                        <td>
                          <strong>{tornarMaiusculo(med.name)}</strong>
                        </td>
                        <td>{med.dosage}</td>
                        <td>{tornarMaiusculo(med.type)}</td>
                        <td>{med.quantity}</td>
                        <td>{new Date(med.expiresAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.buscaFiltrada}>
                <div className={styles.noResults}>
                  Nenhum medicamento encontrado.
                </div>
              </div>
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
              <Button style={{ borderRadius: "5px" }} onClick={buscarAlertas}>
                ATUALIZAR
              </Button>
            </div>

            <div className={styles.containerTabela}>
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
                          <td>
                            <strong>{tornarMaiusculo(med.name)}</strong>
                          </td>
                          <td>{med.dosage}</td>
                          <td>{tornarMaiusculo(med.type)}</td>
                          <td
                            style={{
                              color: "red",
                              fontWeight: "bolder",
                              backgroundColor: "#ffe5e5",
                            }}
                          >
                            {med.quantity}
                          </td>
                          <td>
                            {new Date(med.expiresAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div>Nenhum medicamento com estoque baixo encontrado.</div>
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
                        <tr key={index}>
                          <td>
                            <strong>{tornarMaiusculo(med.name)}</strong>
                          </td>
                          <td>{med.dosage}</td>
                          <td>{tornarMaiusculo(med.type)}</td>
                          <td>{med.quantity}</td>
                          <td
                            style={{
                              color: "red",
                              fontWeight: "bolder",
                              backgroundColor: "#ffe5e5",
                            }}
                          >
                            {new Date(med.expiresAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div>Nenhum medicamento vencendo nos próximos 30 dias.</div>
                )}
              </div>
            </div>
          </>
        </Tab>

        <Tab eventKey="movement" title="MOVIMENTAÇÕES">
          <div className={styles.buscaFiltrada}>
            <TextField
              type="text"
              placeholder="Nome (requisitante ou aprovador)"
              onChange={(value) => setFiltroMov({ ...filtroMov, nome: value })}
              text={filtroMov.nome}
            />
            <TextField
              type="text"
              placeholder="Medicamento"
              onChange={(value) =>
                setFiltroMov({ ...filtroMov, medicamento: value })
              }
              text={filtroMov.medicamento}
            />
            <TextField
              type="date"
              placeholder="Data"
              onChange={(value) => setFiltroMov({ ...filtroMov, data: value })}
              text={filtroMov.data}
            />
            <Select
              name="tipoMovimento"
              placeholder="Tipo"
              campo="tipo"
              options={[
                { value: "", label: "Todos" },
                { value: "entrada", label: "Entrada" },
                { value: "saída", label: "Saída" },
              ]}
              onChange={(value) => setFiltroMov({ ...filtroMov, tipo: value })}
              value={filtroMov.tipo}
            />


            <Button
              style={{ borderRadius: "5px" }}
              onClick={() => {
                setFiltroMov({ nome: "", medicamento: "", data: "", tipo: "" });
              }}
            >
              LIMPAR
            </Button>
            <Button
              style={{ borderRadius: "5px" }}
              onClick={buscarTodasMovimentacoes}
            >
              ATUALIZAR
            </Button>
          </div>

          <div className={styles.tabelaEstoqueVencimento}>
            {movementsFiltrados.length > 0 ? (
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
                  {movementsFiltrados.map((mov) => (
                    <tr key={mov.id}>
                      <td>
                        {tornarMaiusculo(
                          mov.doctor
                            ? `${mov.doctor.name} ${mov.doctor.lastName}`
                            : "-",
                        )}
                      </td>
                      <td>
                        {tornarMaiusculo(
                          mov.user
                            ? `${mov.user.name} ${mov.user.lastName}`
                            : "-",
                        )}
                      </td>
                      <td>{tornarMaiusculo(mov.medication?.name || "-")}</td>
                      <td>{mov.quantity}</td>
                      <td
                        style={{
                          fontWeight: "bold",
                          color:
                            mov.movementType === "INBOUND" ? "green" : "red",
                          backgroundColor:
                            mov.movementType === "INBOUND"
                              ? "#baf7cf"
                              : "#ffe5e5",
                        }}
                      >
                        {traduzirMovementType(mov.movementType)}
                      </td>
                      <td>{new Date(mov.createdAt).toLocaleDateString()}</td>
                      <td>{new Date(mov.updatedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>Nenhum movimento encontrado com os filtros aplicados.</div>
            )}
          </div>
        </Tab>
      </Tabs>
    </>
  );
}
