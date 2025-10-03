"use client";

import React, { useState } from "react";
import styles from "./styles.module.css";
import Button from "../Button";


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

// props que o componente recebe
interface Props {
  paciente: Paciente;
  onVoltar: () => void; // função para voltar para a tela anterior
}

export default function FichaMedica({ paciente, onVoltar }: Props) {
  // estado para o campo de anotações
  const [anotacoes, setAnotacoes] = useState(paciente.anotacoes ?? "");

  // estados para controlar se cada Titulo está aberta ou minimizada
  const [showFicha, setShowFicha] = useState(true);
  const [showReceita, setShowReceita] = useState(true);
  const [showEncaminhamento, setShowEncaminhamento] = useState(true);

  //  exemplo pra preencher (receita e encaminhamento)
  const receitas: string[] = [];
  const encaminhamentos: string[] = [];

  // função para finalizar atendimento
  function finalizarAtendimento() {
    alert(`Atendimento finalizado para ${paciente.nome}\nAnotações:\n${anotacoes}`);
    onVoltar();
  }

  return (
    <div className={styles.fichaContainer}>

      {/* Título Ficha Médica clicável */}
      <h2 
        style={{ cursor: "pointer" }}
        onClick={() => setShowFicha(!showFicha)}
      >
        {showFicha ? "▼" : "▶"} Ficha Médica
      </h2>

      {/* Conteúdo da ficha */}
      {showFicha && (
        <>
          {/* informações principais do paciente */}
          <div className={styles.infoBox}>
            <div><strong>Nome:</strong> {paciente.nome}</div>
            <div><strong>Data nascimento:</strong> {paciente.dataNascimento ?? "-"}</div>
            <div><strong>Data:</strong> {new Date().toLocaleDateString()}</div>
            <div><strong>Nível:</strong> {paciente.nivel}</div>
            <div style={{ marginTop: 8 }}><strong>Sintomas:</strong> {paciente.sintomas ?? "-"}</div>
            <div><strong>Alergias:</strong> {paciente.alergias ?? "-"}</div>
            <div><strong>Remédio controlado:</strong> {paciente.remedioControlado ?? "-"}</div>
          </div>

          {/* campo de anotações EDITÁVEL */}
          <div className={styles.anotacoesBox}>
            <strong>Anotações:</strong>
            <textarea
              value={anotacoes}
              onChange={(e) => setAnotacoes(e.target.value)}
              placeholder="Digite aqui as observações..."
              rows={6}
              style={{ width: "100%", padding: 8, fontSize: 14, borderRadius: 4 }}
            />
          </div>
        </>
      )}

      {/* Título Receita clicável */}
      <h2 
        style={{ cursor: "pointer" }}
        onClick={() => setShowReceita(!showReceita)}
      >
        {showReceita ? "▼" : "▶"} Receita
      </h2>

      {/* Conteúdo da receita */}
      {showReceita && (
        <div className={styles.card}>
          {receitas.length === 0 ? (
            <div className={styles.emptyBox}>
              <p>Não possui receitas recentes</p>
              <div style={{ fontSize: 30 }}>+</div>
              <Button onClick={() => alert("Abrir modal pra cirar a receira")}>CRIAR</Button>
            </div>
          ) : (
            <ul>{receitas.map((r, i) => <li key={i}>{r}</li>)}</ul>
          )}
        </div>
      )}

      {/* Título Encaminhamento clicável */}
      <h2 
        style={{ cursor: "pointer" }}
        onClick={() => setShowEncaminhamento(!showEncaminhamento)}
      >
        {showEncaminhamento ? "▼" : "▶"} Encaminhamento
      </h2>

      {/* Conteúdo do encaminhamento */}
      {showEncaminhamento && (
        <div className={styles.card}>
          {encaminhamentos.length === 0 ? (
            <div className={styles.emptyBox}>
              <p>Não possui encaminhamentos recentes</p>
              <div style={{ fontSize: 30 }}>+</div>
              <Button onClick={() => alert("Abrir modal para criar encaminhamento")}>CRIAR</Button>
            </div>
          ) : (
            <ul>{encaminhamentos.map((e, i) => <li key={i}>{e}</li>)}</ul>
          )}
        </div>
      )}

      {/* botões de voltar e finalizar */}
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
       
        <Button onClick={finalizarAtendimento}>FINALIZAR</Button>
      </div>
    </div>
  );
}

// fazer conectar com as infos do banco separar o que vai ser componente(productCard) e fazer os modals de receita e encaminhamento
//fazer o historico com o componenete do rafa  usestate pra controlar o que aparece e o que não aparece
