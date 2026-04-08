"use client";
import React, { useEffect, useState } from "react";
import { SimplifiedPatient } from "../../types/types";
import styles from "./styles.module.css";
import Button from "../Button";
import api from "../../services/api";

type TabelaIniciarProps = {
  onIniciar: (patient: SimplifiedPatient) => void;
  idRemover?: string | number | null;
};

export default function TabelaIniciar({
  onIniciar,
  idRemover,
}: TabelaIniciarProps) {
  const [patients, setPatients] = useState<SimplifiedPatient[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  // 🔹 Carrega pacientes aguardando atendimento
  useEffect(() => {
    async function loadPatients() {
      try {
        const response = await api.get("/users/patient/awaitingAttendance");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = response.data as any[];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const simplified = data.flatMap((patient: any) => {
          const records = Array.isArray(patient.recordsAsDoctor)
            ? patient.recordsAsDoctor
            : [];

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return records.map((record: any) => ({
            patientId: patient.patientId,
            name: patient.name ?? "Sem nome",
            lastName: patient.lastName ?? "",
            level: typeof record.level === "number" ? record.level : null,
            symptom: record.symptom ?? "-",
            allergy: patient.allergy ?? "-",
            birthDate: patient.birthDate ?? undefined,
            cpf: patient.cpf ?? "-",
            email: patient.email ?? "-",
            phone: patient.phone ?? "-",
            annotationTriage: record.annotationTriage ?? "-",
            appointmentDate: record.appointmentDate
              ? new Date(record.appointmentDate)
              : undefined,
            recentMedicine: record.recentMedicine ?? "-",
            situation: record.situation ?? "-",
            recordsAsDoctor: patient.recordsAsDoctor,
          })) as SimplifiedPatient[];
        });

        simplified.sort((a, b) => (b.level ?? 0) - (a.level ?? 0));
        setPatients(simplified);
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
      }
    }
    loadPatients();
  }, []);

  // 🔹 FASE 1: Remove o paciente da lista quando o idRemover mudar (ao clicar em finalizar)
  useEffect(() => {
    if (idRemover) {
      setPatients((prev) => prev.filter((p) => p.patientId !== idRemover));
    }
  }, [idRemover]);

  // 🔹 FASE 2: Inicia o atendimento e atualiza a chamada
  const handleIniciar = async (item: SimplifiedPatient) => {
    setLoadingId((item.patientId as number) ?? null);

    // Salva o paciente localmente para a tela de atendimento
    localStorage.setItem("pacienteSelecionado", JSON.stringify(item));

    // Envia a chamada para a API (Para o app Desktop/Telão conseguir ler)
    try {
    } catch (error) {
      console.error("Erro ao enviar chamada para o telão:", error);
    }

    // Remove o paciente da lista (sem mexer no banco)
    setPatients((prev) => prev.filter((p) => p.patientId !== item.patientId));

    // Notifica o componente pai
    onIniciar(item);

    setLoadingId(null);
  };

  return (
    <div className={styles.container}>
      <table className={styles.tabela}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Nível</th>
            <th>Sintomas</th>
            <th>Anotação</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((item, index) => (
            <tr
              key={`${item.patientId ?? "noid"}-${index}`}
              className={item.level === 5 ? styles.nivelAlto : ""}
            >
              <td>
                {item.name} {item.lastName}
              </td>
              <td>{item.level ?? "-"}</td>
              <td>{item.symptom ?? "-"}</td>
              <td>{item.annotationTriage ?? "-"}</td>
              <td>
                <Button
                  disabled={loadingId === item.patientId}
                  onClick={() => handleIniciar(item)}
                  style={{ borderRadius: "12px" }}
                >
                  {loadingId === item.patientId ? "Iniciando..." : "INICIAR"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {patients.length === 0 && (
        <p style={{ textAlign: "center", marginTop: 20, color: "#555" }}>
          Nenhum paciente aguardando atendimento.
        </p>
      )}
    </div>
  );
}
