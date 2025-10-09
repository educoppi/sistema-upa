'use client';
import React, { useState } from "react";
import styles from "./style.module.css";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface HistoricoItem {
  id: number;
  titulo: string;
  descricao?: string;
  data?: string; // formato "YYYY-MM-DD"
}

interface Props {
  titulo?: string;
  itens?: HistoricoItem[];
}

export default function Historico({ titulo = "Histórico", itens = [] }: Props) {
  const hoje = new Date();
  const [mesAtual, setMesAtual] = useState(hoje.getMonth());
  const [anoAtual, setAnoAtual] = useState(hoje.getFullYear());

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  // --- navegação entre meses ---
  function voltarMes() {
    if (mesAtual === 0) {
      setMesAtual(11);
      setAnoAtual(anoAtual - 1);
    } else {
      setMesAtual(mesAtual - 1);
    }
  }

  function avancarMes() {
    const mesReal = hoje.getMonth();
    const anoReal = hoje.getFullYear();

    if (anoAtual < anoReal || (anoAtual === anoReal && mesAtual < mesReal)) {
      if (mesAtual === 11) {
        setMesAtual(0);
        setAnoAtual(anoAtual + 1);
      } else {
        setMesAtual(mesAtual + 1);
      }
    }
  }

  // --- filtra itens do mês e ano atual ---
  const itensDoMes = itens.filter((item) => {
    if (!item.data) return false;
    const dataItem = new Date(item.data);
    return (
      dataItem.getMonth() === mesAtual &&
      dataItem.getFullYear() === anoAtual
    );
  });

  return (
    <div className={styles.historicoContainer}>
      {titulo && <h3 className={styles.titulo}>{titulo}</h3>}

      <div className={styles.mesBox}>
        <button className={styles.btnSeta} onClick={voltarMes}>
          <ArrowLeft size={22} />
        </button>

        <div className={styles.mesInfo}>
          <strong>{meses[mesAtual]}</strong>
          <span>{anoAtual}</span>
        </div>

        {!(
          anoAtual === hoje.getFullYear() && mesAtual === hoje.getMonth()
        ) ? (
          <button className={styles.btnSeta} onClick={avancarMes}>
            <ArrowRight size={22} />
          </button>
        ) : (
          <div style={{ width: 22 }} />
        )}
      </div>

      <div className={styles.grid}>
        {itensDoMes.length > 0 ? (
          itensDoMes.map((item) => (
            <div key={item.id} className={styles.card}>
              <strong>{item.titulo}</strong>
              {item.data && <span className={styles.data}>{item.data}</span>}
              {item.descricao && (
                <p className={styles.descricao}>{item.descricao}</p>
              )}
            </div>
          ))
        ) : (
          [...Array(9)].map((_, i) => (
            <div key={i} className={styles.cardVazio}></div>
          ))
        )}
      </div>
    </div>
  );
}
