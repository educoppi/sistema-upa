"use client";
import React, { useState } from "react";
import styles from "./styles.module.css";
import medicationService from "@/services/medication";
import movementService from "@/services/movement";
import Medication from "@/models/Medication";
import axios, { AxiosResponse } from 'axios';
import Movement from "@/models/Movement";
import { header } from "framer-motion/client";


const token = localStorage.getItem('token');

interface Medicamento extends Medication {
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
  const [resultadosBusca, setResultadosBusca] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(false);

  const dataAtual = new Date().toLocaleDateString("pt-BR");

  async function buscarMedicamentos() {
    if (!busca.trim()) {
      setResultadosBusca([]);
      return;
    }

    setLoading(true);
    try {
      const meds = await medicationService.busca(busca);
      setResultadosBusca(meds);
    } catch (error) {
      console.error("Erro ao buscar medicamentos:", error);
    } finally {
      setLoading(false);
    }
  }

  function adicionarMedicamento(med: Medication) {
    const jaExiste = medicamentos.find((m) => m.id === med.id);
    if (jaExiste) {
      alert("Esse medicamento já foi adicionado.");
      return;
    }

    const novo: Medicamento = { ...med, qtd: 1 };
    setMedicamentos((prev) => [...prev, novo]);
    setBusca("");
    setResultadosBusca([]);
  }

  function removerMedicamento(index: number) {
    setMedicamentos((prev) => prev.filter((_, i) => i !== index));
  }

  function atualizarQuantidade(index: number, qtd: number) {
    setMedicamentos((prev) => {
      const novos = [...prev];
      novos[index].qtd = Math.max(1, qtd);
      return novos;
    });
  }

  async function handleSalvar() {
    if (!descricao.trim()) {
      alert("Por favor, insira uma descrição.");
      return;
    }

    if (medicamentos.length === 0) {
      alert("Adicione pelo menos um medicamento.");
      return;
    }



    try {
      for (const med of medicamentos) {
        await axios.post('https://projeto-integrador-lf6v.onrender.com/movements', {
          medicationId: med.id,
          quantity: med.qtd
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.error('Erro ao criar movimentação:', error.response ? error.response.data : error.message);
          })
      }

      const medicamentosTexto = medicamentos
        .map((m) => `${m.name} ${m.dosage} - ${m.type} (${m.qtd})`)
        .join(", ");

      onSave({ descricao, medicamentos: medicamentosTexto });
      alert("Solicitação enviada para a farmácia com sucesso!");
      onClose();
    } catch (error) {
      console.error("Erro ao salvar encaminhamento:", error);
      alert("Erro ao enviar solicitação à farmácia.");
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <h2>Encaminhamento</h2>
        <p>
          <strong>Paciente:</strong> {patientName}
        </p>
        <p>
          <strong>Data:</strong> {dataAtual}
        </p>

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
              placeholder="Digite o nome do medicamento..."
              onKeyDown={(e) => e.key === "Enter" && buscarMedicamentos()}
            />
            <button onClick={buscarMedicamentos}>
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>

          {resultadosBusca.length > 0 && (
            <div className={styles.searchResults}>
              {resultadosBusca.map((med, i) => (
                <div
                  key={i}
                  className={styles.searchItem}
                  onClick={() => adicionarMedicamento(med)}
                >
                  <div className={styles.searchItemTitle}>{med.name}</div>
                  <div className={styles.searchItemSub}>
                    {med.dosage} - {med.type}
                  </div>
                </div>
              ))}
            </div>
          )}

          {medicamentos.length > 0 && (
            <div className={styles.medicamentosList}>
              <button
                onClick={() => setMedicamentos([])}
                className={styles.novaBuscaBtn}
              >
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
                      <td>{med.name}</td>
                      <td>{med.dosage}</td>
                      <td>{med.type}</td>
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
          <button onClick={onClose} className={styles.cancelBtn}>
            Cancelar
          </button>
          <button onClick={handleSalvar} className={styles.saveBtn}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
