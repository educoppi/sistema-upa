"use client";
import React, { useState } from "react";
import Button from "../Button";
import TituloMinimizavel from "../TituloMinimizavel";
import SegmentoCard from "../SegmentoCard";
import styles from "./styles.module.css";
import PrescriptionModal from "../PrescriptionModal";
import { FiTrash2 } from "react-icons/fi";
import EncaminhamentoModal from "../EncaminhamentoModal";

type patient = {
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

interface Props {
  patient: patient;
  onFinalizar: (anotacoes: string) => void;
}

export default function Atendimento({ onFinalizar }: Props) {
  const token = localStorage.getItem("token");
  const usuarioString = localStorage.getItem("usuario");
  const usuario = usuarioString ? JSON.parse(usuarioString) : null;
  const patientString = localStorage.getItem("currentPatientId");
  const patient = patientString ? JSON.parse(patientString) : null;

  console.log("Atendimento - patient:", patient);

  const [anotacoes, setAnotacoes] = useState(patient?.annotation ?? "");

  const [showFicha, setShowFicha] = useState(true);
  const [showReceita, setShowReceita] = useState(false);
  const [showEncaminhamento, setShowEncaminhamento] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showEncaminhamentoModal, setShowEncaminhamentoModal] = useState(false);

  const [historico, setHistorico] = useState<string[]>(() => {
    if (!patient) return [];
    const saved = localStorage.getItem(`receitas_patient_${patient.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [encaminhamentos, setEncaminhamentos] = useState<
    { descricao: string; medicamentos: string; data: string }[]
  >(() => {
    if (!patient) return [];
    const saved = localStorage.getItem(`encaminhamentos_patient_${patient.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  function formatDate(dateString?: string) {
    if (!dateString) return " - ";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Data inválida";

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // mês começa em 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  function finalizarAtendimento() {
    onFinalizar(anotacoes);
  }

  return (
    <div className={styles.fichaContainer}>
      {/* FICHA MÉDICA */}
      <TituloMinimizavel
        title="Ficha Médica"
        isOpen={showFicha}
        onAlterna={() => setShowFicha(!showFicha)}
      />
      {showFicha && patient && (
        <SegmentoCard className={styles.card}>
          <div className={styles.infoBox}>
            <div>
              <strong>Nome:</strong> {patient.name} {patient.lastName ?? ""}
            </div>
            <div>
              <strong>Data nascimento:</strong> {formatDate(patient.birthDate)}
            </div>
            <div>
              <strong>Nível:</strong>{" "}
              <span className={patient.level === 5 ? styles.nivelCinco : ""}>
                {patient.level}
              </span>
            </div>

            <div>
              <strong>Sintomas:</strong> {patient.symptom ?? " "}
            </div>
            <div>
              <strong>Alergias:</strong> {patient.allergy ?? " "}
            </div>
            <div>
              <strong>Remédio controlado:</strong>{" "}
              {patient.recentMedicine ?? "-"}
            </div>
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

      {/* RECEITA */}
      <TituloMinimizavel
        title="Receita"
        isOpen={showReceita}
        onAlterna={() => setShowReceita(!showReceita)}
      />
      {showReceita && (
        <SegmentoCard className={styles.card}>
          {historico.length === 0 ? (
            <div className={styles.emptyBox}>
              <p>Não possui receitas recentes</p>
              <div style={{ fontSize: 30 }}>+</div>
              <Button
                onClick={() => setShowPrescriptionModal(true)}
                style={{ borderRadius: "12px" }}
              >
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
                        const confirmar = confirm(
                          "Deseja deletar esta receita?"
                        );
                        if (confirmar) {
                          setHistorico((prev) =>
                            prev.filter((_, index) => index !== i)
                          );
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

              <Button
                onClick={() => setShowPrescriptionModal(true)}
                style={{ borderRadius: "12px", marginTop: "16px" }}
              >
                CRIAR
              </Button>
            </div>
          )}
        </SegmentoCard>
      )}

      {/* ENCAMINHAMENTO */}
      <TituloMinimizavel
        title="Encaminhamento"
        isOpen={showEncaminhamento}
        onAlterna={() => setShowEncaminhamento(!showEncaminhamento)}
      />
      {showEncaminhamento && (
        <SegmentoCard className={styles.card}>
          {encaminhamentos.length === 0 ? (
            <div className={styles.emptyBox}>
              <p>Não possui encaminhamentos recentes</p>
              <div style={{ fontSize: 30 }}>+</div>
              <Button
                onClick={() => setShowEncaminhamentoModal(true)}
                style={{ borderRadius: "12px" }}
              >
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
                    <hr />
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => setShowEncaminhamentoModal(true)}
                style={{ borderRadius: "12px", marginTop: "16px" }}
              >
                CRIAR
              </Button>
            </div>
          )}
        </SegmentoCard>
      )}

      {/* MODAL DE RECEITA */}
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

      {/* MODAL DE ENCAMINHAMENTO */}
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
            localStorage.setItem(
              `encaminhamentos_patient_${patient.id}`,
              JSON.stringify(atualizados)
            );
            setShowEncaminhamentoModal(false);
          }}
        />
      )}

      {/* BOTÕES */}
      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "flex-end",
          marginTop: 20,
        }}
      >
        <Button onClick={finalizarAtendimento} style={{ borderRadius: "12px" }}>
          FINALIZAR
        </Button>
      </div>
    </div>
  );
}
