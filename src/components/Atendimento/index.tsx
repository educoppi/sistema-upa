"use client";

import React, { useState } from "react";
import Button from "../Button";
import TituloMinimizavel from "../TituloMinimizavel";
import SegmentoCard from "../SegmentoCard";
import styles from "./styles.module.css";
import PrescriptionModal from "../PrescriptionModal";
import { FiTrash2 } from "react-icons/fi";

type Paciente = {
  id: number;
  nome: string;
  nivel: number;
  dataNascimento?: string;
  sintomas?: string;
  alergias?: string;
  remedioControlado?: string;
  anotacoes?: string;
};

interface Props {
  paciente: Paciente;
  onVoltar: () => void;
  onFinalizar: (anotacoes: string) => void;
}

export default function FichaMedica({ paciente, onVoltar, onFinalizar }: Props) {
  const [anotacoes, setAnotacoes] = useState(paciente.anotacoes ?? "");

  const [showFicha, setShowFicha] = useState(true);
  const [showReceita, setShowReceita] = useState(false);
  const [showEncaminhamento, setShowEncaminhamento] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  
  const [historico, setHistorico] = useState<string[]>(() => {
    const saved = localStorage.getItem(`receitas_paciente_${paciente.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const encaminhamentos: string[] = [];

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
      {showFicha && (
        <SegmentoCard className={styles.card}>
          <div className={styles.infoBox}>
            <div><strong>Nome:</strong> {paciente.nome}</div>
            <div><strong>Data nascimento:</strong> {paciente.dataNascimento ?? " "}</div>
            <div><strong>Nível:</strong> {paciente.nivel}</div>
            <div><strong>Sintomas:</strong> {paciente.sintomas ?? " "}</div>
            <div><strong>Alergias:</strong> {paciente.alergias ?? " "}</div>
            <div><strong>Remédio controlado:</strong> {paciente.remedioControlado ?? "-"}</div>
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
                  const confirmar = confirm("Deseja deletar esta receita?");
                  if (confirmar) {
                    setHistorico(prev => prev.filter((_, index) => index !== i));
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
                onClick={() => alert("Abrir modal para criar encaminhamento")}
                style={{ borderRadius: "12px" }}
              >
                CRIAR
              </Button>
            </div>
          ) : (
            <ul>{encaminhamentos.map((e, i) => <li key={i}>{e}</li>)}</ul>
          )}
        </SegmentoCard>
      )}

      {showPrescriptionModal && (
        <PrescriptionModal
        onClose={() => setShowPrescriptionModal(false)}
        patientName={paciente.nome}
        onSave={(novaReceita: string) => {
          setHistorico(prev => [...prev, novaReceita]);
          setShowPrescriptionModal(false);
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
        <Button
          onClick={finalizarAtendimento}
          style={{ borderRadius: "12px" }}
        >
          FINALIZAR
        </Button>
      </div>
    </div>
  );
}
