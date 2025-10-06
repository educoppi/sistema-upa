"use client";

import React, { useState } from "react";
import Button from "../Button";
import TituloMinimizavel from "../TituloMinimizavel";
import SegmentoCard from "../SegmentoCard";
import styles from "./styles.module.css";


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
}

export default function FichaMedica({ paciente, onVoltar }: Props) {
  const [anotacoes, setAnotacoes] = useState(paciente.anotacoes ?? "");

  const [showFicha, setShowFicha] = useState(true);
  const [showReceita, setShowReceita] = useState(true);
  const [showEncaminhamento, setShowEncaminhamento] = useState(true);

  const receitas: string[] = [];
  const encaminhamentos: string[] = [];

  function finalizarAtendimento() {
    alert(`Atendimento finalizado para ${paciente.nome}\nAnotações:\n${anotacoes}`);
    onVoltar();
  }

  return (
    <div className={styles.fichaContainer}>

      {/* FICHA MÉDICA */}
      <TituloMinimizavel title="Ficha Médica" isOpen={showFicha} onAlterna={() => setShowFicha(!showFicha)} />
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
      <TituloMinimizavel title="Receita" isOpen={showReceita} onAlterna={() => setShowReceita(!showReceita)} />
      {showReceita && (
        <SegmentoCard className={styles.card}>
          {receitas.length === 0 ? (
            <div className={styles.emptyBox}>
              <p>Não possui receitas recentes</p>
              <div style={{ fontSize: 30 }}>+</div>
              <Button onClick={() => alert("Abrir modal pra criar receita")} style={{ borderRadius: "12px" }}>CRIAR</Button>
            </div>
          ) : (
            <ul>{receitas.map((r, i) => <li key={i}>{r}</li>)}</ul>
          )}
        </SegmentoCard>
      )}

      {/* ENCAMINHAMENTO */}
      <TituloMinimizavel title="Encaminhamento" isOpen={showEncaminhamento} onAlterna={() => setShowEncaminhamento(!showEncaminhamento)} />
      {showEncaminhamento && (
        <SegmentoCard className={styles.card}>
          {encaminhamentos.length === 0 ? (
            <div className={styles.emptyBox}>
              <p>Não possui encaminhamentos recentes</p>
              <div style={{ fontSize: 30 }}>+</div>
              <Button onClick={() => alert("Abrir modal para criar encaminhamento")} style={{ borderRadius: "12px" }}>CRIAR</Button>
            </div>
          ) : (
            <ul>{encaminhamentos.map((e, i) => <li key={i}>{e}</li>)}</ul>
          )}
        </SegmentoCard>
      )}

      {/* BOTÃO FINALIZAR */}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
        <Button onClick={finalizarAtendimento} style={{ borderRadius: "12px" }}>FINALIZAR</Button>
      </div>

    </div>
  );
}
