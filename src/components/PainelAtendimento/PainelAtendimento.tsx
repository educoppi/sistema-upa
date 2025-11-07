import React, { useState } from "react";
import { SimplifiedPatient } from "../../types/types";
import TabelaIniciar from "../TabelaIniciar";
import Atendimento from "../Atendimento";

export default function PainelAtendimento() {
  const [pacienteSelecionado, setPacienteSelecionado] = useState<SimplifiedPatient | null>(null);

  function handleIniciar(patient: SimplifiedPatient) {
    console.log("Paciente selecionado:", patient);
    setPacienteSelecionado(patient);
  }

  function handleFinalizar(updatedPatients: SimplifiedPatient[]) {
    setPacienteSelecionado(null);
    // Atualizar lista ou estado se necessário
  }

  return (
    <>
      <TabelaIniciar onIniciar={handleIniciar} />
      <Atendimento patient={pacienteSelecionado} onFinalizar={handleFinalizar} />
    </>
  );
}
