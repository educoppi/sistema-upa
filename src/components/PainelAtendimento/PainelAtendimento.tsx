import React, { useState } from "react";
import { SimplifiedPatient } from "../../types/types";
import TabelaIniciar from "../TabelaIniciar";
import Atendimento from "../Atendimento";

export default function PainelAtendimento() {
  const [pacienteSelecionado, setPacienteSelecionado] = useState<SimplifiedPatient | null>(null);
  const [idRemover, setIdRemover] = useState<number | string | null>(null);

  function handleIniciar(patient: SimplifiedPatient) {
    setPacienteSelecionado(patient);
  }

  function handleFinalizar(patientId: string | number) {
    setPacienteSelecionado(null);
    setIdRemover(patientId); // Avisa a tabela qual ID deve sumir
  }

  return (
    <>
      <TabelaIniciar onIniciar={handleIniciar} idRemover={idRemover} />
      <Atendimento onFinalizar={handleFinalizar} />
    </>
  );
}