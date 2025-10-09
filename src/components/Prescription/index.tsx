"use client";
import React from "react";
import styles from "./styles.module.css";
 
export default function Prescription() {
  return (
    <div className={styles.container}>
      <main className={styles.card}>
        <h2 className={styles.title}>Receita do Paciente</h2>
 
        <div className={styles.info}>
          <p><strong>Data:</strong> ___ / ___ / _____</p>
          <p><strong>Paciente:</strong> ______________________________</p>
        </div>
 
        <div className={styles.section}>
          <h3 className={styles.subtitle}>Medicamentos:</h3>
          <ul>
            <li>_________________________________________</li>
            <p>_________________________________________</p>
            <li>_________________________________________</li>
            <p>_________________________________________</p>
          </ul>
        </div>
 
        <div className={styles.observacoes}>
          <h4>Orientações / Observações:</h4>
          <p>_________________________________________</p>
          <p>_________________________________________</p>
        </div>
 
        <div className={styles.assinatura}>
          <p className={styles.linha}></p>
          <p>Dr. ___________________________________</p>
        </div>
 
        <div className={styles.botaoArea}>
          <button className={styles.botao}>Finalizar</button>
        </div>
      </main>
    </div>
  );
}
 