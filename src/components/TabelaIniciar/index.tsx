'use client';
import styles from "./styles.module.css";
import Button from "../Button";
import axios from 'axios';
import { useEffect, useState } from "react";

type Record = {
  level: number | null;
  symptom: string | null;
  annotation?: string;
  appointmentDate?: Date;
  recentMedicine?: string;
  situation?: string;
};

type SimplifiedPatient = {
  patientId: number;
  level: number | null;
  symptom: string | null;
  annotation?: string;
  appointmentDate?: Date;
  recentMedicine?: string;
  situation?: string;
  name: string;
  recordsAsDoctor: Record[];
  lastName?: string;
  allergy?: string;
  birthDate?: Date;
  cpf?: string;
  email?: string;
  phone?: string;
};

type TabelaIniciarProps = {
  onIniciar: (patient: SimplifiedPatient) => void;
};

export default function TabelaIniciar({ onIniciar }: TabelaIniciarProps) {
  const [patients, setPatients] = useState<SimplifiedPatient[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          'https://projeto-integrador-lf6v.onrender.com/users/patient/awaitingAttendance',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // Garante que response.data é um array
        const dataArray = Array.isArray(response.data) ? response.data : [];

        const simplified = dataArray.flatMap((patient: any) => {
          // Garante que recordsAsDoctor é um array
          const records = Array.isArray(patient.recordsAsDoctor)
            ? patient.recordsAsDoctor
            : [];

          return records.map((record: any) => ({
            patientId: patient.patientId,
            name: patient.name ?? 'Sem nome',
            lastName: patient.lastName ?? '',
            level: typeof record.level === 'number' ? record.level : null,
            symptom: record.symptom ?? '-',
            allergy: patient.allergy ?? '-',
            birthDate: patient.birthDate ?? null,
            cpf: patient.cpf ?? '-',
            email: patient.email ?? '-',
            phone: patient.phone ?? '-',
            annotation: record.annotationTraige ?? '-',//pegar do edu da triagem
            appointmentDate: record.appointmentDate || patient.appointmentDate,
            recentMedicine: record.recentMedicine || patient.recentMedicine,
            situation: record.situation || patient.situation,
          }));
        });

        // 🔽 Ordena do maior para o menor nível de forma segura
        const sorted = simplified.sort((a, b) => {
          const nivelA = a?.level ?? 0;
          const nivelB = b?.level ?? 0;
          return nivelB - nivelA;
        });

        setPatients(sorted);
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.tabelaWrapper}>
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
            {patients.map((item) => (
              <tr
                key={`${item.patientId}-${item.level}-${item.symptom}`}
                className={item.level === 5 ? styles.nivelAlto : ''}
              >
                <td>{item.name} {item.lastName}</td>
                <td>{item.level ?? '-'}</td>
                <td>{item.symptom ?? '-'}</td>
                <td>{item.annotation ?? '-'}</td>
                <td>
                  <Button
                    onClick={() => {
                      localStorage.setItem('currentPatientId', JSON.stringify(item));
                      onIniciar(item);
                    }}
                    style={{ borderRadius: "12px" }}
                  >
                    INICIAR
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
