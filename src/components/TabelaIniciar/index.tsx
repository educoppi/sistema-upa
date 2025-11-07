"use client";
import React, { useEffect, useState } from "react";
import { SimplifiedPatient } from "../../types/types";
import styles from "./styles.module.css";
import Button from "../Button";
import api from "../../services/api";

type TabelaIniciarProps = {
  onIniciar: (patient: SimplifiedPatient) => void;
};

export default function TabelaIniciar({ onIniciar }: TabelaIniciarProps) {
  const [patients, setPatients] = useState<SimplifiedPatient[]>([]);

  useEffect(() => {
    async function loadPatients() {
      try {
        const response = await api.get("/users/patient/awaitingAttendance");
        const data = response.data as any[];

        const simplified = data.flatMap((patient: any) => {
          const records = Array.isArray(patient.recordsAsDoctor) ? patient.recordsAsDoctor : [];
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
            appointmentDate: record.appointmentDate ? new Date(record.appointmentDate) : undefined,
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
              <td>{item.name} {item.lastName}</td>
              <td>{item.level ?? "-"}</td>
              <td>{item.symptom ?? "-"}</td>
              <td>{item.annotationTriage ?? "-"}</td>
              <td>
                <Button onClick={() => onIniciar(item)} style={{ borderRadius: "12px" }}>
                  INICIAR
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
