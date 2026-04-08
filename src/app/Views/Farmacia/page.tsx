"use client";
import styles from "@/app/Views/Farmacia/styles.module.css";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import TextField from "@/components/TextField";
import MedicamentoModal from "@/components/MedicamentoModal";
import Button from "@/components/Button";
import Select from "@/components/Select";
import { Tabs, Tab, ToastContainer, Toast } from "react-bootstrap";
import axios, { AxiosResponse } from "axios";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import medicationService from "@/services/medication";
import Medication from "@/models/Medication";
import Movement from "@/models/Movement";
import api from "@/services/api";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const [sortSolicitacoes, setSortSolicitacoes] = useState<{
    campo: string;
    ascendente: boolean;
  }>({
    campo: "createdAt",
    ascendente: true,
  });
  const [sortMovimentacoes, setSortMovimentacoes] = useState<{
    campo: string;
    ascendente: boolean;
  }>({
    campo: "createdAt",
    ascendente: false,
  });
  const [movements, setMovements] = useState<Movement[]>([]);
  const [pendingMovements, setPendingMovements] = useState<Movement[]>([]);

  const [toasts, setToasts] = useState<
    Array<{ id: number; message: string; variant: string; title?: string }>
  >([]);
  const addToast = (
    message: string,
    variant: string = "info",
    title?: string,
  ) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, variant, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingApprovalId, setPendingApprovalId] = useState<number | null>(
    null,
  );

  const [filtroMov, setFiltroMov] = useState({
    nome: "",
    medicamento: "",
    data: "",
    tipo: "",
  });

  const solicitacoesOrdenadas = [...pendingMovements].sort((a, b) => {
    const { campo, ascendente } = sortSolicitacoes;
    let valorA, valorB;

    switch (campo) {
      case "doctor":
        valorA =
          `${a.doctor?.name || ""} ${a.doctor?.lastName || ""}`.toLowerCase();
        valorB =
          `${b.doctor?.name || ""} ${b.doctor?.lastName || ""}`.toLowerCase();
        break;
      case "medication":
        valorA = (a.medication?.name || "").toLowerCase();
        valorB = (b.medication?.name || "").toLowerCase();
        break;
      case "quantity":
        valorA = a.quantity;
        valorB = b.quantity;
        break;
      case "createdAt":
        valorA = new Date(a.createdAt).getTime();
        valorB = new Date(b.createdAt).getTime();
        break;
      default:
        return 0;
    }

    if (valorA < valorB) return ascendente ? -1 : 1;
    if (valorA > valorB) return ascendente ? 1 : -1;
    return 0;
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

  const ordenarSolicitacoes = (campo: string) => {
    setSortSolicitacoes((prev) => ({
      campo,
      ascendente: prev.campo === campo ? !prev.ascendente : true,
    }));
  };

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
      addToast("Preencha todos os campos antes de cadastrar.", "warning");
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

      addToast("Medicamento cadastrado com sucesso!", "success");
    } catch (error: unknown) {
      console.error(
        "Erro ao criar medicamento:",
        axios.isAxiosError(error)
          ? error.response?.data || error.message
          : error,
      );

      addToast("Erro no cadastro de medicamento.", "danger");
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
      addToast(`Não foi possível buscar medicamentos: ${error}`, "danger");
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

  const movimentacoesOrdenadas = [...movementsFiltrados].sort((a, b) => {
    const { campo, ascendente } = sortMovimentacoes;
    let valorA, valorB;

    switch (campo) {
      case "doctor":
        valorA =
          `${a.doctor?.name || ""} ${a.doctor?.lastName || ""}`.toLowerCase();
        valorB =
          `${b.doctor?.name || ""} ${b.doctor?.lastName || ""}`.toLowerCase();
        break;
      case "user":
        valorA =
          `${a.user?.name || ""} ${a.user?.lastName || ""}`.toLowerCase();
        valorB =
          `${b.user?.name || ""} ${b.user?.lastName || ""}`.toLowerCase();
        break;
      case "medication":
        valorA = (a.medication?.name || "").toLowerCase();
        valorB = (b.medication?.name || "").toLowerCase();
        break;
      case "quantity":
        valorA = a.quantity;
        valorB = b.quantity;
        break;
      case "movementType":
        valorA = a.movementType?.toLowerCase() || "";
        valorB = b.movementType?.toLowerCase() || "";
        break;
      case "createdAt":
        valorA = new Date(a.createdAt).getTime();
        valorB = new Date(b.createdAt).getTime();
        break;
      case "updatedAt":
        valorA = new Date(a.updatedAt).getTime();
        valorB = new Date(b.updatedAt).getTime();
        break;
      default:
        return 0;
    }

    if (valorA < valorB) return ascendente ? -1 : 1;
    if (valorA > valorB) return ascendente ? 1 : -1;
    return 0;
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

      addToast("Solicitação aprovada!", "success");

      buscarMovimentosPendentes();
    } catch (err) {
      console.error("Erro ao aprovar solicitação:", err);

      addToast("Erro ao aprovar movimento.", "danger");
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

  const getImageBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const obterDataAtualFormatada = (): string => {
    const data = new Date();
    return (
      data.toLocaleDateString("pt-BR") + " " + data.toLocaleTimeString("pt-BR")
    );
  };

  const obterDataDDMMAAAA = (): string => {
    const data = new Date();
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}${mes}${ano}`;
  };

  const gerarPDFBusca = async () => {
    if (resultadosOrdenados.length === 0) {
      addToast("Nenhum medicamento encontrado para gerar o relatório.", "info");
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const logoMaxWidth = 20;

    const logoBase64 = await getImageBase64("/images/logo2.png");
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = logoBase64;
    });

    const aspectRatio = img.width / img.height;
    const logoWidth = logoMaxWidth;
    const logoHeight = logoMaxWidth / aspectRatio;

    const body = resultadosOrdenados.map((med) => [
      tornarMaiusculo(med.name),
      med.dosage,
      tornarMaiusculo(med.type),
      med.quantity.toString(),
      new Date(med.expiresAt).toLocaleDateString("pt-BR"),
    ]);

    autoTable(doc, {
      head: [["Nome", "Dosagem", "Tipo", "Quantidade", "Vencimento"]],
      body: body,
      startY: 5 + logoHeight + 15,
      margin: { top: 40 },
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 123, 255] }, // cor azul para combinar com a aba
      didDrawPage: (data) => {
        try {
          doc.addImage(logoBase64, "PNG", margin, 5, logoWidth, logoHeight);
        } catch (e) {
          console.warn("Erro ao adicionar logo:", e);
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(40, 40, 40);
        doc.text(
          "RELATÓRIO DE MEDICAMENTOS",
          pageWidth / 2,
          5 + logoHeight / 2,
          {
            align: "center",
          },
        );

        doc.setDrawColor(0, 123, 255);
        doc.setLineWidth(0.5);
        doc.line(
          margin,
          5 + logoHeight + 5,
          pageWidth - margin,
          5 + logoHeight + 5,
        );

        const dataGeracao = `Relatório gerado em: ${obterDataAtualFormatada()}`;
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(dataGeracao, margin, doc.internal.pageSize.getHeight() - 10);
      },
    });

    const dataStr = obterDataDDMMAAAA();
    doc.save(`medicamentos_${dataStr}.pdf`);
  };

  const gerarPDFEstoqueBaixo = async () => {
    if (estoqueBaixo.length === 0 && vencendo.length === 0) {
      addToast(
        "Não há alertas de estoque baixo ou vencimento próximo para gerar relatório.",
        "info",
      );
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const logoMaxWidth = 20;

    // Carrega a logo
    const logoBase64 = await getImageBase64("/images/logo2.png");
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = logoBase64;
    });

    const aspectRatio = img.width / img.height;
    const logoWidth = logoMaxWidth;
    const logoHeight = logoMaxWidth / aspectRatio;

    const addHeaderFooter = (data: any) => {
      try {
        doc.addImage(logoBase64, "PNG", margin, 5, logoWidth, logoHeight);
      } catch (e) {
        console.warn("Erro ao adicionar logo:", e);
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text(
        "RELATÓRIO DE ALERTAS DE ESTOQUE",
        pageWidth / 2,
        5 + logoHeight / 2,
        { align: "center" },
      );
      doc.setDrawColor(220, 53, 69);
      doc.setLineWidth(0.5);
      doc.line(
        margin,
        5 + logoHeight + 5,
        pageWidth - margin,
        5 + logoHeight + 5,
      );

      const dataGeracao = `Relatório gerado em: ${obterDataAtualFormatada()}`;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(dataGeracao, margin, doc.internal.pageSize.getHeight() - 10);
    };

    let startY = 5 + logoHeight + 15;

    // Tabela de estoque baixo
    if (estoqueBaixo.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text("Medicamentos com estoque baixo", margin, startY);
      startY += 7;

      const bodyLow = estoqueBaixo.map((med) => [
        tornarMaiusculo(med.name),
        med.dosage,
        tornarMaiusculo(med.type),
        med.quantity.toString(),
        new Date(med.expiresAt).toLocaleDateString("pt-BR"),
      ]);

      autoTable(doc, {
        head: [["Nome", "Dosagem", "Tipo", "Quantidade", "Vencimento"]],
        body: bodyLow,
        startY: startY,
        margin: { top: 40 },
        styles: { fontSize: 10 },
        headStyles: { fillColor: [220, 53, 69] },
        didDrawPage: addHeaderFooter,
      });

      startY = (doc as any).lastAutoTable.finalY + 10;
    }

    // Tabela de medicamentos próximos ao vencimento
    if (vencendo.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text("Medicamentos com vencimento próximo (30 dias)", margin, startY);
      startY += 7;

      const bodyExpiring = vencendo.map((med) => [
        tornarMaiusculo(med.name),
        med.dosage,
        tornarMaiusculo(med.type),
        med.quantity.toString(),
        new Date(med.expiresAt).toLocaleDateString("pt-BR"),
      ]);

      autoTable(doc, {
        head: [["Nome", "Dosagem", "Tipo", "Quantidade", "Vencimento"]],
        body: bodyExpiring,
        startY: startY,
        margin: { top: 40 },
        styles: { fontSize: 10 },
        headStyles: { fillColor: [255, 193, 7] },
        didDrawPage: addHeaderFooter,
      });
    }

    const dataStr = obterDataDDMMAAAA();
    doc.save(`alertas_estoque_${dataStr}.pdf`);
  };

  const gerarPDFMovimentacoes = async () => {
    if (movementsFiltrados.length === 0) {
      addToast(
        "Nenhuma movimentação encontrada com os filtros atuais.",
        "info",
      );
      return;
    }

    const doc = new jsPDF("portrait");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const logoMaxWidth = 20;

    const logoBase64 = await getImageBase64("/images/logo2.png");
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = logoBase64;
    });

    const aspectRatio = img.width / img.height;
    const logoWidth = logoMaxWidth;
    const logoHeight = logoMaxWidth / aspectRatio;

    const body = movementsFiltrados.map((mov) => [
      tornarMaiusculo(
        mov.doctor ? `${mov.doctor.name} ${mov.doctor.lastName}` : "-",
      ),
      tornarMaiusculo(mov.user ? `${mov.user.name} ${mov.user.lastName}` : "-"),
      tornarMaiusculo(mov.medication?.name || "-"),
      mov.quantity.toString(),
      traduzirMovementType(mov.movementType),
      new Date(mov.createdAt).toLocaleDateString("pt-BR"),
      new Date(mov.updatedAt).toLocaleDateString("pt-BR"),
    ]);

    autoTable(doc, {
      head: [
        [
          "Requisitado por",
          "Aprovado por",
          "Medicamento",
          "Qtd",
          "Tipo",
          "Solicitado em",
          "Aprovado em",
        ],
      ],
      body: body,
      startY: 5 + logoHeight + 15,
      margin: { top: 40 },
      styles: { fontSize: 7 },
      headStyles: { fillColor: [0, 123, 255] },
      didDrawPage: (data) => {
        try {
          doc.addImage(logoBase64, "PNG", margin, 5, logoWidth, logoHeight);
        } catch (e) {
          console.warn("Erro ao adicionar logo:", e);
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(40, 40, 40);
        doc.text(
          "RELATÓRIO DE MOVIMENTAÇÕES",
          pageWidth / 2,
          5 + logoHeight / 2,
          { align: "center" },
        );

        doc.setDrawColor(0, 123, 255);
        doc.setLineWidth(0.5);
        doc.line(
          margin,
          5 + logoHeight + 5,
          pageWidth - margin,
          5 + logoHeight + 5,
        );

        const dataGeracao = `Relatório gerado em: ${obterDataAtualFormatada()}`;
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(dataGeracao, margin, doc.internal.pageSize.getHeight() - 10);
      },
    });

    const dataStr = obterDataDDMMAAAA();
    doc.save(`movimentacoes_${dataStr}.pdf`);
  };

  const ordenarMovimentacoes = (campo: string) => {
    setSortMovimentacoes((prev) => ({
      campo,
      ascendente: prev.campo === campo ? !prev.ascendente : true,
    }));
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
                    <th>
                      Solicitado por
                      <button
                        onClick={() => ordenarSolicitacoes("doctor")}
                        style={{ marginLeft: 5 }}
                      >
                        {sortSolicitacoes.campo === "doctor" ? (
                          sortSolicitacoes.ascendente ? (
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
                      Medicamento
                      <button
                        onClick={() => ordenarSolicitacoes("medication")}
                        style={{ marginLeft: 5 }}
                      >
                        {sortSolicitacoes.campo === "medication" ? (
                          sortSolicitacoes.ascendente ? (
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
                      <button
                        onClick={() => ordenarSolicitacoes("quantity")}
                        style={{ marginLeft: 5 }}
                      >
                        {sortSolicitacoes.campo === "quantity" ? (
                          sortSolicitacoes.ascendente ? (
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
                      Data da Solicitação
                      <button
                        onClick={() => ordenarSolicitacoes("createdAt")}
                        style={{ marginLeft: 5 }}
                      >
                        {sortSolicitacoes.campo === "createdAt" ? (
                          sortSolicitacoes.ascendente ? (
                            <FaSortUp />
                          ) : (
                            <FaSortDown />
                          )
                        ) : (
                          <FaSortDown style={{ opacity: 0.3 }} />
                        )}
                      </button>
                    </th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitacoesOrdenadas.map((mov) => (
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

              <Button
                style={{ borderRadius: "5px" }}
                onClick={gerarPDFBusca}
              >
                GERAR RELATÓRIO
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
                    {resultadosOrdenados.map((med, index) => (
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
                onShowToast={addToast}
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
              <Button
                style={{ borderRadius: "5px"}}
                onClick={gerarPDFEstoqueBaixo}
              >
                GERAR RELATÓRIO
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
                  <div className={styles.noResults}>Nenhum medicamento com estoque baixo encontrado.</div>
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

            <Button
              style={{ borderRadius: "5px"}}
              onClick={gerarPDFMovimentacoes}
            >
              GERAR RELATÓRIO
            </Button>
          </div>

          <div className={styles.containerTabela}>
            <div className={styles.tabelaEstoqueVencimento}>
              {movementsFiltrados.length > 0 ? (
                <table className={styles.tabela}>
                  <thead>
                    <tr>
                      <th>
                        Requisitado por
                        <button
                          onClick={() => ordenarMovimentacoes("doctor")}
                          style={{ marginLeft: 5 }}
                        >
                          {sortMovimentacoes.campo === "doctor" ? (
                            sortMovimentacoes.ascendente ? (
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
                        Aprovado por
                        <button
                          onClick={() => ordenarMovimentacoes("user")}
                          style={{ marginLeft: 5 }}
                        >
                          {sortMovimentacoes.campo === "user" ? (
                            sortMovimentacoes.ascendente ? (
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
                        Medicamento
                        <button
                          onClick={() => ordenarMovimentacoes("medication")}
                          style={{ marginLeft: 5 }}
                        >
                          {sortMovimentacoes.campo === "medication" ? (
                            sortMovimentacoes.ascendente ? (
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
                        <button
                          onClick={() => ordenarMovimentacoes("quantity")}
                          style={{ marginLeft: 5 }}
                        >
                          {sortMovimentacoes.campo === "quantity" ? (
                            sortMovimentacoes.ascendente ? (
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
                        <button
                          onClick={() => ordenarMovimentacoes("movementType")}
                          style={{ marginLeft: 5 }}
                        >
                          {sortMovimentacoes.campo === "movementType" ? (
                            sortMovimentacoes.ascendente ? (
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
                        Solicitado em
                        <button
                          onClick={() => ordenarMovimentacoes("createdAt")}
                          style={{ marginLeft: 5 }}
                        >
                          {sortMovimentacoes.campo === "createdAt" ? (
                            sortMovimentacoes.ascendente ? (
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
                        Aprovado em
                        <button
                          onClick={() => ordenarMovimentacoes("updatedAt")}
                          style={{ marginLeft: 5 }}
                        >
                          {sortMovimentacoes.campo === "updatedAt" ? (
                            sortMovimentacoes.ascendente ? (
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
                    {movimentacoesOrdenadas.map((mov) => (
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
                <div className={styles.noResults}>Nenhum movimento encontrado com os filtros aplicados.</div>
              )}
            </div>
          </div>
        </Tab>
      </Tabs>

      {/* Toast Container */}
      <ToastContainer position="bottom-end" className="p-3">
        {toasts.map((toast) => (
          <Toast key={toast.id} bg={toast.variant} autohide delay={3000}>
            {toast.title && (
              <Toast.Header closeButton>{toast.title}</Toast.Header>
            )}
            <Toast.Body style={{ color: "white", fontWeight: "bold" }}>
              {toast.message}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </>
  );
}
