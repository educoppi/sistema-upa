'use client';
import styles from "./styles.module.css";
import Button from "../Button";
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from "react";

type Paciente = {
  id: number;
  name: string;
  allergy?: string;
  situation: string;
  birthDate?: Date;
};

type Historico = {
    id: Number,
    userId: Number,
    patientId: Number,
    appointmentDate: Date,
    level: number,
    symptom: string;
    recentMedicine: string;
    annotation: string;
};

type TabelaIniciarProps = {
  onIniciar: (id: number) => void;
};


export default function TabelaIniciar({ onIniciar }: TabelaIniciarProps) {

  console.log(localStorage.getItem('token'));
  
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  function encontraPacientes() {
    axios.get('https://projeto-integrador-lf6v.onrender.com/users?situation=AGUARDANDO TRIAGEM', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log(response.data);

        setPacientes(response.data);
      }
      )
      .catch(error => {
        console.error('Erro ao buscar pacientes:', error);
      });
  }

  function encontraHistoricos() {
    axios.get('https://projeto-integrador-lf6v.onrender.com/records', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        console.log(response.data);

        setPacientes(response.data);
      }
      )
      .catch(error => {
        console.error('Erro ao buscar pacientes:', error);
      });
  }

  useEffect(() => {
    encontraPacientes();
    encontraHistoricos();
  }, []);


  return (
    <div className={styles.container}>
      <div className={styles.tabelaWrapper}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Nível</th>
              <th>Sintomas</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
{/*                 <td>{item.level}</td>
                <td>{item.sintomas}</td> */}
                <td>
                  <Button
                    onClick={() => onIniciar(item.id)}
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
