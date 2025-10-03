"use client";

import styles from './Styles.module.css';
import Button from '../Button';
import { useState } from "react";

function Tabela() {
  const [mostrarFicha, setMostrarFicha] = useState(false);

  const dados = [
    { id: 1, nome: "João coppi soares", nivel: 5 },
  ];

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

          <Button onClick={() => setMostrarFicha(true)}>INICIAR</Button>
        </div>
      ) : (
        <div>
          <h2>Ficha Médica</h2>
          <p>Aqui vai aparecer as informações do paciente selecionado...</p>

          <Button onClick={() => setMostrarFicha(false)}>VOLTAR</Button>
        </div>
      )}
    </div>
  );
}

export default Tabela;
