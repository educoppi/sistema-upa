"use client";
import React, { useState } from "react";
import styles from "./styles.module.css";

interface Medicamento {
  nome: string;
  dose: string;
  tipo: string;
  qtd: number;
}

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
  const [busca, setBusca] = useState("");
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const dataAtual = new Date().toLocaleDateString("pt-BR");

  const medicamentosDisponiveis = [
    { nome: "Dipirona", dose: "500mg", tipo: "Comprimido" },
    { nome: "Dipirona", dose: "1g", tipo: "Gotas" },
    { nome: "Paracetamol", dose: "750mg", tipo: "Comprimido" },
    { nome: "Ibuprofeno", dose: "600mg", tipo: "Comprimido" },
    { nome: "Amoxicilina", dose: "500mg", tipo: "Cápsula" },
    { nome: "Losartana", dose: "50mg", tipo: "Comprimido" },
  ];

  const resultadosBusca = busca.trim()
    ? medicamentosDisponiveis.filter((med) =>
        med.nome.toLowerCase().includes(busca.toLowerCase())
      )
    : [];

  function adicionarMedicamento(med: { nome: string; dose: string; tipo: string }) {
    const novo: Medicamento = { ...med, qtd: 1 };
    setMedicamentos([...medicamentos, novo]);
    setBusca("");
  }

  function removerMedicamento(index: number) {
    setMedicamentos(medicamentos.filter((_, i) => i !== index));
  }

  function atualizarQuantidade(index: number, qtd: number) {
    const novos = [...medicamentos];
    novos[index].qtd = Math.max(1, qtd);
    setMedicamentos(novos);
  }

  function handleSalvar() {
    if (!descricao.trim()) {
      alert("Por favor, insira uma descrição.");
      return;
    }

    const medicamentosTexto = medicamentos
      .map((m) => `${m.nome} ${m.dose} - ${m.tipo} (${m.qtd})`)
      .join(", ");

    onSave({ descricao, medicamentos: medicamentosTexto });
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <h2>Encaminhamento</h2>
        <p><strong>Paciente:</strong> {patientName}</p>
        <p><strong>Data:</strong> {dataAtual}</p>

        <div className={styles.formGroup}>
          <label>Descrição:</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={5}
            placeholder="Digite aqui o motivo e detalhes do encaminhamento..."
          />
        </div>

        <div className={styles.formGroup}>
          <label>Medicamentos:</label>
          <div className={styles.searchBar}>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Pesquisar medicamento..."
            />
            <button onClick={() => setBusca("")}>Busca</button>
          </div>

          {resultadosBusca.length > 0 && (
            <div className={styles.searchResults}>
              {resultadosBusca.map((med, i) => (
                <div
                  key={i}
                  className={styles.searchItem}
                  onClick={() => adicionarMedicamento(med)}
                >
                  <div className={styles.searchItemTitle}>{med.nome}</div>
                  <div className={styles.searchItemSub}>
                    {med.dose} - {med.tipo}
                  </div>
                </div>
              ))}
            </div>
          )}

          {medicamentos.length > 0 && (
            <div className={styles.medicamentosList}>
              <button onClick={() => setMedicamentos([])} className={styles.novaBuscaBtn}>
                Nova Busca
              </button>

              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Dose</th>
                    <th>Tipo</th>
                    <th>Qtd</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {medicamentos.map((med, i) => (
                    <tr key={i}>
                      <td>{med.nome}</td>
                      <td>{med.dose}</td>
                      <td>{med.tipo}</td>
                      <td>
                        <input
                          type="number"
                          value={med.qtd}
                          onChange={(e) =>
                            atualizarQuantidade(i, parseInt(e.target.value) || 1)
                          }
                          min="1"
                        />
                      </td>
                      <td>
                        <button
                          onClick={() => removerMedicamento(i)}
                          className={styles.removeBtn}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className={styles.buttonGroup}>
          <button onClick={onClose} className={styles.cancelBtn}>Cancelar</button>
          <button onClick={handleSalvar} className={styles.saveBtn}>Salvar</button>
        </div>
      </div>
    </div>
  );
}
