"use client";

import React, { useState } from "react";
import Button from "../Button";
import TituloMinimizavel from "../TituloMinimizavel";
import SegmentoCard from "../SegmentoCard";


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

// props do componente
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
    <div style={{ width: "80%", margin: "20px auto", fontFamily: "Arial, sans-serif" }}>

      {/* FICHA MÉDICA */}
      <TituloMinimizavel title="Ficha Médica" isOpen={showFicha} onAlterna={() => setShowFicha(!showFicha)} />
      {showFicha && (
        <SegmentoCard>
          <div><strong>Nome:</strong> {paciente.nome}</div>
          <div><strong>Data nascimento:</strong> {paciente.dataNascimento ?? "-"}</div>
          <div><strong>Nível:</strong> {paciente.nivel}</div>
          <div style={{ marginTop: 8 }}><strong>Sintomas:</strong> {paciente.sintomas ?? "-"}</div>
          <div><strong>Alergias:</strong> {paciente.alergias ?? "-"}</div>
          <div><strong>Remédio controlado:</strong> {paciente.remedioControlado ?? "-"}</div>

          <div style={{ marginTop: 12 }}>
            <strong>Anotações:</strong>
            <textarea
              value={anotacoes}
              onChange={(e) => setAnotacoes(e.target.value)}
              placeholder="Digite aqui as observações..."
              rows={6}
              style={{ width: "100%", padding: 8, fontSize: 14, borderRadius: 4 }}
            />
          </div>
        </SegmentoCard>
      )}

      {/* RECEITA */}
      <TituloMinimizavel title="Receita" isOpen={showReceita} onAlterna={() => setShowReceita(!showReceita)} />
      {showReceita && (
        <SegmentoCard>
          {receitas.length === 0 ? (
            <div style={{ textAlign: "center" }}>
              <p>Não possui receitas recentes</p>
              <div style={{ fontSize: 30 }}>+</div>
              <Button onClick={() => alert("Abrir modal pra criar receita")}>CRIAR</Button>
            </div>
          ) : (
            <ul>{receitas.map((r, i) => <li key={i}>{r}</li>)}</ul>
          )}
        </SegmentoCard>
      )}

      {/* ENCAMINHAMENTO */}
      <TituloMinimizavel title="Encaminhamento" isOpen={showEncaminhamento} onAlterna={() => setShowEncaminhamento(!showEncaminhamento)} />
      {showEncaminhamento && (
        <SegmentoCard>
          {encaminhamentos.length === 0 ? (
            <div style={{ textAlign: "center" }}>
              <p>Não possui encaminhamentos recentes</p>
              <div style={{ fontSize: 30 }}>+</div>
              <Button onClick={() => alert("Abrir modal para criar encaminhamento")}>CRIAR</Button>
            </div>
          ) : (
            <ul>{encaminhamentos.map((e, i) => <li key={i}>{e}</li>)}</ul>
          )}
        </SegmentoCard>
      )}

      {/* BOTÃO FINALIZAR */}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
        <Button onClick={finalizarAtendimento}>FINALIZAR</Button>
      </div>

    </div>
  );
}
// fazer conectar com as infos do banco separar o que vai ser componente(productCard) e fazer os modals de receita e encaminhamento //fazer o historico com o componenete do rafa usestate pra controlar o que aparece e o que não aparece