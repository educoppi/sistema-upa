"use client";
import React, { useEffect, useState } from "react";
import Button from "../Button";
import TituloMinimizavel from "../TituloMinimizavel";
import SegmentoCard from "../SegmentoCard";
import PrescriptionModal from "../PrescriptionModal";
import EncaminhamentoModal from "../EncaminhamentoModal";
import styles from "./styles.module.css";
import { FiTrash2, FiEye } from "react-icons/fi";
import api from "../../services/api";

type SimplifiedPatient = {
  patientId?: string | number;
  id?: number;
  name?: string;
  nome?: string;
  lastName?: string;
  birthDate?: string;
  level?: number;
  symptom?: string;
  allergy?: string;
  recentMedicine?: string;
  annotationTriage?: string;
  cpf?: string;
  email?: string;
  phone?: string;
};

type EncaminhamentoType = {
  descricao: string;
  medicamentos?: string;
  data?: string;
};

type AtendimentoProps = {
  onFinalizar?: (updatedPatients: any[]) => void;
};

export default function Atendimento({ onFinalizar }: AtendimentoProps) {
  const [patient, setPatient] = useState<SimplifiedPatient | null>(null);
  const [anotacoes, setAnotacoes] = useState<string>("");
  const [receitas, setReceitas] = useState<string[]>([]);
  const [encaminhamentos, setEncaminhamentos] = useState<EncaminhamentoType[]>([]);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showEncaminhamentoModal, setShowEncaminhamentoModal] = useState(false);
  const [detalhesEncaminhamento, setDetalhesEncaminhamento] = useState<EncaminhamentoType | null>(null);

  // estados para o TituloMinimizavel (abre/fecha)
  const [openReceita, setOpenReceita] = useState<boolean>(true);
  const [openEncaminhamento, setOpenEncaminhamento] = useState<boolean>(true);

  useEffect(() => {
    const saved = localStorage.getItem("pacienteSelecionado");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as SimplifiedPatient;
        setPatient(parsed);
        setAnotacoes(parsed.annotationTriage ?? "");
        // não buscamos receitas/encaminhamentos do server aqui
      } catch (e) {
        console.error("Erro ao parsear pacienteSelecionado:", e);
      }
    }
  }, []);

  async function postRecordToServer(extra: { receitas?: any[]; encaminhamentos?: any[] } = {}) {
    if (!patient?.patientId && !patient?.id) return;

    const patientId = patient.patientId ?? patient.id;
    const recordData = {
      patientId,
      appointmentDate: new Date().toISOString(),
      level: patient.level ?? null,
      symptom: patient.symptom ?? null,
      recentMedicine: patient.recentMedicine ?? null,
      annotationMedic: anotacoes ?? null,
      receitas: extra.receitas ?? receitas.map((r) => ({ descricao: r, data: new Date().toLocaleDateString("pt-BR") })),
      encaminhamentos: extra.encaminhamentos ?? encaminhamentos,
    };

    try {
      await api.post("/records", recordData);
    } catch (err) {
      console.error("Erro ao salvar record no servidor:", err);
      alert("Erro ao salvar no servidor. Dados foram mantidos localmente.");
    }
  }

  async function handleSaveReceita(receitaTexto: string) {
    const nova = receitaTexto.trim();
    if (!nova) return;
    const novaReceitas = [...receitas, nova];
    setReceitas(novaReceitas);
    await postRecordToServer({ receitas: novaReceitas.map((r) => ({ descricao: r, data: new Date().toLocaleDateString("pt-BR") })) });
  }

  async function handleSaveEncaminhamento(novo: { descricao: string; medicamentos?: string }) {
    const novoEnc: EncaminhamentoType = { ...novo, data: new Date().toLocaleDateString("pt-BR") };
    const novos = [...encaminhamentos, novoEnc];
    setEncaminhamentos(novos);
    await postRecordToServer({ encaminhamentos: novos });
  }

  function handleDeleteReceita(index: number) {
    const atual = receitas.filter((_, i) => i !== index);
    setReceitas(atual);
    postRecordToServer({ receitas: atual.map((r) => ({ descricao: r, data: new Date().toLocaleDateString("pt-BR") })) }).catch(() => {});
  }

  function handleDeleteEncaminhamento(index: number) {
    const atual = encaminhamentos.filter((_, i) => i !== index);
    setEncaminhamentos(atual);
    postRecordToServer({ encaminhamentos: atual }).catch(() => {});
  }

  function formatDateStr(d?: string) {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleDateString("pt-BR");
    } catch {
      return d;
    }
  }

  async function finalizarAtendimento() {
    await postRecordToServer();

    
    localStorage.removeItem("pacienteSelecionado");
    setPatient(null);
    setAnotacoes("");
    setReceitas([]);
    setEncaminhamentos([]);
    if (onFinalizar) onFinalizar([]);


    alert("Atendimento finalizado e salvo.");
  }

  if (!patient) {
    return <div className={styles.selecioneAviso}>Selecione um paciente para iniciar atendimento.</div>;
  }

  return (
    <div className={styles.fichaContainer}>
      <h2 className={styles.fichaTitulo}>Ficha Médica</h2>

      <div className={styles.infoBox}>
        <div className={styles.infoLinha}>
          <div><strong>Nome:</strong> {patient.name ?? patient.nome ?? "Sem nome"} {patient.lastName ?? ""}</div>
          <div><strong>Data nascimento:</strong> {formatDateStr(patient.birthDate)}</div>
        </div>

        <div className={styles.infoLinha}>
          <div><strong>Nível:</strong> <span className={patient.level === 5 ? styles.nivelCinco : ""}>{patient.level ?? "-"}</span></div>
          <div><strong>Sintomas:</strong> {patient.symptom ?? "-"}</div>
        </div>

        <div className={styles.infoLinha}>
          <div><strong>Alergias:</strong> {patient.allergy ?? "-"}</div>
          <div><strong>Remédio controlado:</strong> {patient.recentMedicine ?? "-"}</div>
        </div>
      </div>

      {/* Campo de anotações (FIXO) */}
      <h3 className={styles.subtitulo}>Anotações Médicas</h3>
      <SegmentoCard className={styles.card}>
        <textarea
          className={styles.textarea}
          placeholder="Digite aqui suas observações, diagnósticos e anotações clínicas..."
          value={anotacoes}
          onChange={(e) => setAnotacoes(e.target.value)}
        />
      </SegmentoCard>

      {/* RECEITA - minimizável */}
      <TituloMinimizavel title="Receita" isOpen={openReceita} onAlterna={() => setOpenReceita(!openReceita)}>
        <SegmentoCard className={styles.card}>
          {receitas.length === 0 ? (
            <div className={styles.emptyBox}>
              <p>Não possui receitas recentes</p>
              <Button onClick={() => setShowPrescriptionModal(true)} style={{ borderRadius: 12 }}>CRIAR</Button>
            </div>
          ) : (
            <div className={styles.receitaBox}>
              {receitas.map((r, i) => (
                <div key={i} className={styles.receitaCard}>
                  <div style={{ whiteSpace: "pre-wrap", flex: 1 }}>{r}</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button onClick={() => alert(r)} title="Ver receita" style={{ background: "transparent", border: "none", cursor: "pointer" }}>
                      <FiEye size={18} />
                    </button>
                    <button onClick={() => { if (confirm("Deseja deletar esta receita?")) handleDeleteReceita(i); }} title="Excluir" style={{ background: "transparent", border: "none", cursor: "pointer" }}>
                      <FiTrash2 color="#c00" size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SegmentoCard>
      </TituloMinimizavel>

      {/* ENCAMINHAMENTO - minimizável */}
      <TituloMinimizavel title="Encaminhamento" isOpen={openEncaminhamento} onAlterna={() => setOpenEncaminhamento(!openEncaminhamento)}>
        <SegmentoCard className={styles.card}>
          {encaminhamentos.length === 0 ? (
            <div className={styles.emptyBox}>
              <p>Não possui encaminhamentos recentes</p>
              <Button onClick={() => setShowEncaminhamentoModal(true)} style={{ borderRadius: 12 }}>CRIAR</Button>
            </div>
          ) : (
            <div className={styles.encaminhamentoBox}>
              {encaminhamentos.map((e, i) => (
                <div key={i} className={styles.encaminhamentoCard}>
                  <div>
                    <div><strong>Data:</strong> {e.data}</div>
                    <div style={{ whiteSpace: "pre-wrap" }}>{e.descricao}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button onClick={() => setDetalhesEncaminhamento(e)} title="Ver detalhes" style={{ background: "transparent", border: "none", cursor: "pointer" }}>
                      <FiEye size={18} color="#009688" />
                    </button>
                    <button onClick={() => { if (confirm("Deseja deletar este encaminhamento?")) handleDeleteEncaminhamento(i); }} title="Excluir" style={{ background: "transparent", border: "none", cursor: "pointer" }}>
                      <FiTrash2 color="#c00" size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SegmentoCard>
      </TituloMinimizavel>

      {/* Modal de detalhes do encaminhamento */}
      {detalhesEncaminhamento && (
        <div className={styles.modalOverlay} onClick={() => setDetalhesEncaminhamento(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Detalhes do Encaminhamento</h3>
            <p><strong>Data:</strong> {detalhesEncaminhamento.data}</p>
            <p><strong>Descrição:</strong> {detalhesEncaminhamento.descricao}</p>
            <p><strong>Medicamentos:</strong> {detalhesEncaminhamento.medicamentos ?? "-"}</p>
            <div style={{ textAlign: "right", marginTop: 12 }}>
              <Button onClick={() => setDetalhesEncaminhamento(null)} style={{ borderRadius: 8 }}>Fechar</Button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
        <Button onClick={finalizarAtendimento} style={{ borderRadius: 12 }}>FINALIZAR</Button>
      </div>

      {/* MODAIS */}
      {showPrescriptionModal && (
        <PrescriptionModal
          onClose={() => setShowPrescriptionModal(false)}
          patientName={patient.name ?? patient.nome ?? ""}
          doctorName={localStorage.getItem("usuario") ? JSON.parse(localStorage.getItem("usuario")!).name : undefined}
          onSave={async (receitaTexto: string) => {
            await handleSaveReceita(receitaTexto);
            setShowPrescriptionModal(false);
          }}
        />
      )}

      {showEncaminhamentoModal && (
        <EncaminhamentoModal
          onClose={() => setShowEncaminhamentoModal(false)}
          patientName={patient.name ?? patient.nome ?? ""}
          onSave={async (novo) => {
            await handleSaveEncaminhamento(novo);
            setShowEncaminhamentoModal(false);
          }}
        />
      )}
    </div>
  );
}
