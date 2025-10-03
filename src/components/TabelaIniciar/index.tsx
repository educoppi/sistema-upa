"use client";

import { useState } from "react";
import styles from "./styles.module.css";
import Button from "../Button";
import FichaMedica from "../Atendimento";

type Paciente = {
  id: number;
  nome: string;
  nivel: number;
  dataNascimento?: string;
  sintomas?: string;
  alergias?: string;
  remedioControlado?: string;
  anotacoes?: string;
};

export default function TabelaIniciar() {
  const [mostrarFicha, setMostrarFicha] = useState(false);

  // dados de exemplo (pode vir da API)
  const dados: Paciente[] = [
    {
      id: 1,
      nome: "João Coppi Soares",
      nivel: 5,
      dataNascimento: "1990-05-10",
      sintomas: "Dor de cabeça",
      alergias: "Nenhuma",
      remedioControlado: "Não",
      anotacoes: "Paciente relatou dor a 3 dias..."
    },
  ];

  // paciente fixo que será usado ao iniciar por enquanto
  const pacientePadrao = dados[0];

  function iniciarAtendimento() {
    setMostrarFicha(true);
  }

  return (
    <div className={styles.container}>
      {!mostrarFicha ? (
        <div className={styles.tabelaWrapper}>
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Nível</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.nome}</td>
                  <td>{item.nivel}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
            <Button onClick={iniciarAtendimento}>INICIAR</Button>
          </div>
        </div>
      ) : (
        <FichaMedica
          paciente={pacientePadrao}
          onVoltar={() => setMostrarFicha(false)}
        />
      )}
    </div>
  );
}
