"use client";
import React, { useState } from "react";
import styles from "./styles.module.css";
import Button from "../Button";

interface EncaminhamentoModalProps {
  patientName: string;
  onClose: () => void;
  onSave: (encaminhamento: { descricao: string; medicamentos: string }) => void;
}

export default function EncaminhamentoModal({
  patientName,
  onClose,
  onSave,
}: EncaminhamentoModalProps) {
  const [descricao, setDescricao] = useState("");
  const [medicamentos, setMedicamentos] = useState("");
  const dataAtual = new Date().toLocaleDateString("pt-BR");

  function handleSalvar() {
    if (!descricao.trim()) {
      alert("Por favor, insira uma descrição.");
      return;
    }

    

    onSave({ descricao, medicamentos });
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Encaminhamento</h2>
        <p><strong>Paciente:</strong> {patientName}</p>
        <p><strong>Data:</strong> {dataAtual}</p>

        <div className={styles.field}>
          <label>Descrição:</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={5}
            placeholder="Digite aqui..."
          />
        </div>

        <div className={styles.field}>
          <label>Medicamentos:</label>
          
        </div>

        <div className={styles.actions}>
          <Button onClick={handleSalvar}>Salvar</Button>
          <Button onClick={onClose} style={{ backgroundColor: "#ccc" }}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
