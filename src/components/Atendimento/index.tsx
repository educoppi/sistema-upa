"use client";
import React, { useState, useEffect } from "react";
import Button from "../Button";
import TituloMinimizavel from "../TituloMinimizavel";
import SegmentoCard from "../SegmentoCard";
import styles from "./styles.module.css";
import PrescriptionModal from "../PrescriptionModal";
import { FiTrash2 } from "react-icons/fi";
import EncaminhamentoModal from "../EncaminhamentoModal";

type Patient = {
  id: number;
  name: string;
  lastName?: string;
  level: number;
  birthDate?: string;
  symptom?: string;
  allergy?: string;
  recentMedicine?: string;
  annotation?: string;
};

interface Encaminhamento {
  descricao: string;
  medicamentos: string;
  data: string;
}

interface Props {
  onFinalizar: (anotacoes: string) => void;
}

export default function Atendimento({ onFinalizar }: Props) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [anotacoes, setAnotacoes] = useState("");
  const [showFicha, setShowFicha] = useState(true);
  const [showReceita, setShowReceita] = useState(false);
  const [showEncaminhamento, setShowEncaminhamento] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showEncaminhamentoModal, setShowEncaminhamentoModal] = useState(false);
  const [historico, setHistorico] = useState<string[]>([]);
  const [encaminhamentos, setEncaminhamentos] = useState<Encaminhamento[]>([]);

  // Carrega paciente e dados
  useEffect(() => {
    const patientString = localStorage.getItem("currentPatientId");
    if (patientString) setPatient(JSON.parse(patientString));
  }, []);

  useEffect(() => {
    if (!patient) return;
    setAnotacoes(patient.annotation ?? "");
    const histString = localStorage.getItem(`receitas_patient_${patient.id}`);
    setHistorico(histString ? JSON.parse(histString) : []);
    const encString = localStorage.getItem(`encaminhamentos_patient_${patient.id}`);
    setEncaminhamentos(encString ? JSON.parse(encString) : []);
  }, [patient]);

  function formatDate(dateString?: string) {
    if (!dateString) return " - ";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Data inválida";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function finalizarAtendimento() {
    if (!patient) return;

    const hoje = new Date();
    const dataHoje = hoje.toISOString().split("T")[0]; // formato yyyy-mm-dd

    const atendimentoDoDia = {
      id: Date.now(),
      data: dataHoje,
      anotacoes,
      receitas: historico,
      encaminhamentos,
    };

    // salva histórico individual do paciente
    const historicoSalvoString = localStorage.getItem(`historico_atendimentos_patient_${patient.id}`);
    const historicoSalvo = historicoSalvoString ? JSON.parse(historicoSalvoString) : [];
    const novoHistorico = [...historicoSalvo, atendimentoDoDia];
    localStorage.setItem(`historico_atendimentos_patient_${patient.id}`, JSON.stringify(novoHistorico));

    // adiciona também no histórico global para o calendário
    const historicoGlobalString = localStorage.getItem("historico_global");
    const historicoGlobal = historicoGlobalString ? JSON.parse(historicoGlobalString) : [];
    const novoRegistro = {
      id: Date.now(),
      titulo: "Consulta médica",
      descricao: anotacoes || "Sem anotações.",
      sintomas: patient.symptom ?? "",
      data: dataHoje,
      receita: historico.join("\n") || "",
      encaminhamento: encaminhamentos.map((e) => e.descricao).join(", ") || "",
    };
    localStorage.setItem("historico_global", JSON.stringify([...historicoGlobal, novoRegistro]));

    // Atualiza anotação no paciente
    const patientAtualizado = { ...patient, annotation: anotacoes };
    setPatient(patientAtualizado);
    localStorage.setItem("currentPatientId", JSON.stringify(patientAtualizado));

    alert("Atendimento finalizado e salvo no histórico!");
    onFinalizar(anotacoes);
  }

  // Deletar encaminhamento
  function deletarEncaminhamento(index: number) {
    if (!patient) return;
    if (confirm("Deseja deletar este encaminhamento?")) {
      const atualizados = encaminhamentos.filter((_, i) => i !== index);
      setEncaminhamentos(atualizados);
      localStorage.setItem(`encaminhamentos_patient_${patient.id}`, JSON.stringify(atualizados));
    }
  }

  return (
    <div className={styles.fichaContainer}>
      <TituloMinimizavel title="Ficha Médica" isOpen={showFicha} onAlterna={() => setShowFicha(!showFicha)} />
      {showFicha && patient && (
        <SegmentoCard className={styles.card}>
          <div className={styles.infoBox}>
            <div><strong>Nome:</strong> {patient.name} {patient.lastName ?? ""}</div>
            <div><strong>Data nascimento:</strong> {formatDate(patient.birthDate)}</div>
            <div><strong>Nível:</strong> {patient.level}</div>
            <div><strong>Sintomas:</strong> {patient.symptom ?? " "}</div>
            <div><strong>Alergias:</strong> {patient.allergy ?? " "}</div>
            <div><strong>Remédio controlado:</strong> {patient.recentMedicine ?? "-"}</div>
          </div>
          <div className={styles.anotacoesBox}>
            <strong>Anotações:</strong>
            <textarea
              value={anotacoes}
              onChange={(e) => setAnotacoes(e.target.value)}
              placeholder="Digite aqui ..."
              rows={6}
              style={{ width: "100%", padding: 8, fontSize: 14, borderRadius: 4 }}
            />
          </div>
        </SegmentoCard>
      )}

      <TituloMinimizavel title="Receita" isOpen={showReceita} onAlterna={() => setShowReceita(!showReceita)} />
      {showReceita && (
        <SegmentoCard className={styles.card}>
          {historico.length === 0 ? (
            <div className={styles.emptyBox}>
              <p>Não possui receitas recentes</p>
              <div style={{ fontSize: 30 }}>+</div>
              <Button onClick={() => setShowPrescriptionModal(true)} style={{ borderRadius: "12px" }}>
                CRIAR
              </Button>
            </div>
          ) : (
            <div>
              {historico.map((receita, i) => (
                <div key={i} className={styles.receitaCard}>
                  <div className={styles.receitaHeader}>
                    <button
                      onClick={() => {
                        if (confirm("Deseja deletar esta receita?")) {
                          setHistorico((prev) => prev.filter((_, index) => index !== i));
                        }
                      }}
                      className={styles.deleteButton}
                      title="Excluir receita"
                    >
                      <FiTrash2 size={18} color="#c00" />
                    </button>
                  </div>
                  <pre>{receita}</pre>
                </div>
              ))}
              <Button onClick={() => setShowPrescriptionModal(true)} style={{ borderRadius: "12px", marginTop: "16px" }}>
                CRIAR
              </Button>
            </div>
          )}
        </SegmentoCard>
      )}

      <TituloMinimizavel title="Encaminhamento" isOpen={showEncaminhamento} onAlterna={() => setShowEncaminhamento(!showEncaminhamento)} />
      {showEncaminhamento && (
        <SegmentoCard className={styles.card}>
          {encaminhamentos.length === 0 ? (
            <div className={styles.emptyBox}>
              <p>Não possui encaminhamentos recentes</p>
              <div style={{ fontSize: 30 }}>+</div>
              <Button onClick={() => setShowEncaminhamentoModal(true)} style={{ borderRadius: "12px" }}>
                CRIAR
              </Button>
            </div>
          ) : (
            <div>
              <ul>
                {encaminhamentos.map((e, i) => (
                  <li key={i}>
                    <strong>Data:</strong> {e.data} <br />
                    <strong>Descrição:</strong> {e.descricao} <br />
                    <strong>Medicamentos:</strong> {e.medicamentos || "-"}
                    <button
                      onClick={() => deletarEncaminhamento(i)}
                      title="Excluir encaminhamento"
                      style={{
                        marginLeft: 10,
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <FiTrash2 color="#c00" size={16} />
                    </button>
                    <hr />
                  </li>
                ))}
              </ul>
              <Button onClick={() => setShowEncaminhamentoModal(true)} style={{ borderRadius: "12px", marginTop: "16px" }}>
                CRIAR
              </Button>
            </div>
          )}
        </SegmentoCard>
      )}

      {showPrescriptionModal && patient && (
        <PrescriptionModal
          onClose={() => setShowPrescriptionModal(false)}
          patientName={patient.name}
          onSave={(novaReceita: string) => {
            setHistorico((prev) => [...prev, novaReceita]);
            setShowPrescriptionModal(false);
          }}
        />
      )}

      {showEncaminhamentoModal && patient && (
        <EncaminhamentoModal
          patientName={patient.name}
          onClose={() => setShowEncaminhamentoModal(false)}
          onSave={(novo) => {
            const novoEnc = {
              ...novo,
              data: new Date().toLocaleDateString("pt-BR"),
            };
            const atualizados = [...encaminhamentos, novoEnc];
            setEncaminhamentos(atualizados);
            localStorage.setItem(`encaminhamentos_patient_${patient.id}`, JSON.stringify(atualizados));
            setShowEncaminhamentoModal(false);
          }}
        />
      )}

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
        <Button onClick={finalizarAtendimento} style={{ borderRadius: "12px" }}>
          FINALIZAR
        </Button>
      </div>
    </div>
  );
}
