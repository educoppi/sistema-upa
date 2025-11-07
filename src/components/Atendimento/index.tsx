import React, { useState, useEffect } from "react";
import { SimplifiedPatient } from "../../types/types";
import styles from "./styles.module.css";
import Button from "../Button";
import api from "../../services/api";

type AtendimentoProps = {
  patient: SimplifiedPatient | null;
  onFinalizar: (updatedPatients: SimplifiedPatient[]) => void;
};

type Receita = {
  descricao: string;
  data: string;
};

type Encaminhamento = {
  destino: string;
  motivo: string;
  data: string;
};

export default function Atendimento({ patient, onFinalizar }: AtendimentoProps) {
  const [anotacoes, setAnotacoes] = useState<string>("");
  const [historico, setHistorico] = useState<SimplifiedPatient[]>([]);
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [receitaDescricao, setReceitaDescricao] = useState<string>("");
  const [encaminhamentos, setEncaminhamentos] = useState<Encaminhamento[]>([]);
  const [encaminhamentoDestino, setEncaminhamentoDestino] = useState<string>("");
  const [encaminhamentoMotivo, setEncaminhamentoMotivo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadHistorico() {
      if (patient?.patientId) {
        setLoading(true);
        try {
          const res = await api.get(`/records?patientId=${patient.patientId}`);
          const data = res.data as SimplifiedPatient[];
          setHistorico(data);
          setAnotacoes(data.length > 0 && data[0].annotationTriage ? data[0].annotationTriage : "");
          // Simule histórico receitas e encaminhamentos:
          setReceitas([]);
          setEncaminhamentos([]);
        } catch (error) {
          console.error("Erro ao carregar histórico", error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadHistorico();
  }, [patient]);

  function validarCampos() {
    if (!patient?.level) {
      alert("Informe o nível!");
      return false;
    }
    if (!patient?.appointmentDate) {
      alert("Informe a data do atendimento!");
      return false;
    }
    return true;
  }

  async function finalizarAtendimento() {
    if (!validarCampos() || !patient) return;
    const recordData = {
      patientId: patient.patientId,
      appointmentDate: patient.appointmentDate || new Date().toISOString(),
      level: patient.level,
      symptom: patient.symptom,
      recentMedicine: patient.recentMedicine,
      annotationMedic: anotacoes,
      receitas,
      encaminhamentos,
    };

    try {
      setLoading(true);
      await api.post("/records", recordData);
      alert("Atendimento finalizado com sucesso!");
      const res = await api.get("/users/patient/awaitingAttendance");
      const updatedPatients = res.data as SimplifiedPatient[];
      onFinalizar(updatedPatients);
      setAnotacoes("");
      setReceitas([]);
      setEncaminhamentos([]);
      setHistorico([]);
    } catch (error) {
      alert("Erro ao finalizar atendimento");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (!patient) {
    return <div className={styles.selecioneAviso}>Selecione um paciente para iniciar atendimento.</div>;
  }

  // Adicionar receita
  function adicionarReceita() {
    if (!receitaDescricao.trim()) return;
    setReceitas([...receitas, { descricao: receitaDescricao, data: new Date().toLocaleDateString("pt-BR") }]);
    setReceitaDescricao("");
  }

  // Adicionar encaminhamento
  function adicionarEncaminhamento() {
    if (!encaminhamentoDestino.trim() || !encaminhamentoMotivo.trim()) return;
    setEncaminhamentos([
      ...encaminhamentos,
      { destino: encaminhamentoDestino, motivo: encaminhamentoMotivo, data: new Date().toLocaleDateString("pt-BR") }
    ]);
    setEncaminhamentoDestino("");
    setEncaminhamentoMotivo("");
  }

  return (
    <div className={styles.fichaContainer}>
      <h2 className={styles.fichaTitulo}>▼ Ficha Médica</h2>
      <div className={styles.infoBox}>
        <div className={styles.infoLinha}>
          <span><strong>Nome:</strong> {patient.name} {patient.lastName}</span>
          <span><strong>Data nascimento:</strong> {patient.birthDate ? new Date(patient.birthDate).toLocaleDateString("pt-BR") : "-"}</span>
        </div>
        <div className={styles.infoLinha}>
          <span><strong>Nível:</strong> <span className={patient.level === 5 ? styles.nivelCinco : ""}>{patient.level ?? "-"}</span></span>
          <span><strong>Sintomas:</strong> {patient.symptom ?? "-"}</span>
        </div>
        <div className={styles.infoLinha}>
          <span><strong>Alergias:</strong> {patient.allergy ?? "-"}</span>
          <span><strong>Remédio controlado:</strong> {patient.recentMedicine ?? "-"}</span>
        </div>
      </div>

      <div className={styles.anotacoesBox}>
        <strong>Anotações:</strong>
        <textarea
          value={anotacoes}
          onChange={e => setAnotacoes(e.target.value)}
          placeholder="Digite aqui ..."
          rows={6}
          className={styles.textarea}
        />
      </div>

      {/* RECEITA */}
      <h3 className={styles.subtitulo}>▼ Receita</h3>
      <div className={styles.receitaBox}>
        {receitas.length === 0 && <p className={styles.textoSecundario}>Não possui receitas recentes</p>}
        {receitas.map((r, i) => (
          <div key={i} className={styles.receitaCard}>
            <span>{r.descricao}</span>
            <span className={styles.receitaData}>{r.data}</span>
          </div>
        ))}
        <textarea
          value={receitaDescricao}
          onChange={e => setReceitaDescricao(e.target.value)}
          placeholder="Nova receita..."
          rows={2}
          className={styles.textarea}
        />
        <Button onClick={adicionarReceita} style={{ marginTop: 8 }}>+</Button>
      </div>

      {/* ENCAMINHAMENTO */}
      <h3 className={styles.subtitulo}>▼ Encaminhamento</h3>
      <div className={styles.encaminhamentoBox}>
        {encaminhamentos.length === 0 && <p className={styles.textoSecundario}>Nenhum encaminhamento registrado</p>}
        {encaminhamentos.map((e, i) => (
          <div key={i} className={styles.encaminhamentoCard}>
            <span><strong>Destino:</strong> {e.destino}</span>
            <span><strong>Motivo:</strong> {e.motivo}</span>
            <span className={styles.encaminhamentoData}>{e.data}</span>
          </div>
        ))}
        <input
          value={encaminhamentoDestino}
          onChange={e => setEncaminhamentoDestino(e.target.value)}
          placeholder="Destino"
          className={styles.input}
        />
        <input
          value={encaminhamentoMotivo}
          onChange={e => setEncaminhamentoMotivo(e.target.value)}
          placeholder="Motivo"
          className={styles.input}
        />
        <Button onClick={adicionarEncaminhamento} style={{ marginTop: 8 }}>+</Button>
      </div>

      {/* FINALIZAR */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
        <Button onClick={finalizarAtendimento} disabled={loading} style={{ borderRadius: "12px" }}>
          {loading ? "Salvando..." : "FINALIZAR"}
        </Button>
      </div>

      {/* HISTÓRICO */}
      <h3 className={styles.subtitulo}>▼ Histórico de Atendimentos</h3>
      <div className={styles.historicoBox}>
        {loading && <p>Carregando histórico...</p>}
        {!loading && historico.length === 0 && <p>Sem histórico disponível.</p>}
        {historico.map((item, idx) => (
          <div key={idx} className={styles.recordCard}>
            <p><strong>Data:</strong> {item.appointmentDate ? new Date(item.appointmentDate).toLocaleDateString("pt-BR") : "-"}</p>
            <p><strong>Nível:</strong> {item.level}</p>
            <p><strong>Sintomas:</strong> {item.symptom ?? "-"}</p>
            <p><strong>Anotação:</strong> {item.annotationTriage ?? "-"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
