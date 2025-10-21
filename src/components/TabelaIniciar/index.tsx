'use client';
import styles from "./styles.module.css";
import Button from "../Button";
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from "react";

type Record = {
  level: number | null;
  symptom: string | null;
};


type SimplifiedPatient = {
  patientId: number;
  level: number | null;
  symptom: string | null;
  annotation: string;
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
      axios.get('https://projeto-integrador-lf6v.onrender.com/users/patient/awaitingAttendance', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          const simplified = response.data.flatMap((patient: { recordsAsDoctor: any[]; patientId: any; name: any; lastName: any; allergy: any, birthDate: any, cpf: any, email: any, phone: any, annotation: any, appointmentDate: any, recentMedicine: any, situation: any  }) =>
            patient.recordsAsDoctor.map(record => ({
              patientId: patient.patientId,
              name: patient.name,
              lastName: patient.lastName,       // se disponível
              level: record.level,
              symptom: record.symptom,
              allergy: patient.allergy,
              birthDate: patient.birthDate,
              cpf: patient.cpf,
              email: patient.email,
              phone: patient.phone,
              annotation: record.annotation,
              appointmentDate: record.appointmentDate || patient.appointmentDate,  // se fizer sentido pegar do record ou do paciente
              recentMedicine: record.recentMedicine || patient.recentMedicine,
              situation: record.situation || patient.situation,
            }))
          );
         
          setPatients(simplified);
        }
      )
      .catch(error => {
          console.error('Erro ao buscar pacientes:', error);
        });
      }
)


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
              <tr key={item.patientId}>
                <td>{item.name}</td>
                <td>{item.level}</td>
                <td>{item.symptom}</td>
                <td>{item.annotation}</td>
                <td>
                  <Button
                    onClick={() => {
                      localStorage.setItem('currentPatientId', JSON.stringify(item));
                      onIniciar(item)
                    }}
                    style={{ borderRadius: "12px" }}>
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
