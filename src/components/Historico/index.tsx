'use client';
import React, { useState, useEffect, useRef } from "react";
import styles from "./style.module.css";

interface HistoricoItem {
  id: number;
  titulo: string;
  descricao?: string;
  sintomas?: string;
  data?: string;
  receita?: string;
  encaminhamento?: string;
}

export default function Historico() {
  const hoje = new Date();
  const [selecionado, setSelecionado] = useState<HistoricoItem[] | null>(null);
  const [meses, setMeses] = useState<{nome:string, ano:number, mes:number}[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cria meses iniciais (6 meses atrás até mês atual), mas o mês atual vem primeiro
  useEffect(() => {
    const tempMeses = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      return {
        nome: d.toLocaleString("pt-BR", { month: "long", year: "numeric" }),
        ano: d.getFullYear(),
        mes: d.getMonth()
      };
    });
    setMeses(tempMeses); // já vem do mais recente ao mais antigo
  }, []);

  // Histórico: 2 consultas por mês
  const itens: HistoricoItem[] = [];
  meses.forEach((m,i)=>{
    const ano = m.ano;
    const mes = m.mes;
    itens.push(
      {id: i*2+1, titulo:`Consulta 1`, descricao:"Anotação da consulta 1", sintomas:"Sintomas leves", data: `${ano}-${String(mes+1).padStart(2,"0")}-05`, receita:"Remédio A", encaminhamento:"Especialista A"},
      {id: i*2+2, titulo:`Consulta 2`, descricao:"Anotação da consulta 2", sintomas:"Sintomas moderados", data: `${ano}-${String(mes+1).padStart(2,"0")}-20`, receita:"Remédio B", encaminhamento:"Especialista B"}
    )
  });

  const getEventosPorMes = (ano:number, mes:number) =>
    itens.filter(i => i.data && new Date(i.data).getFullYear()===ano && new Date(i.data).getMonth()===mes);

  const handleDiaClick = (eventos:HistoricoItem[])=>{
    if(eventos.length>0) setSelecionado(eventos);
  }

  // Atualiza meses automaticamente se o mês mudou
  useEffect(() => {
    const timer = setInterval(() => {
      const agora = new Date();
      const ultimoMes = meses[meses.length - 1];
      if(ultimoMes && (ultimoMes.ano !== agora.getFullYear() || ultimoMes.mes !== agora.getMonth())){
        // Remove o mês mais antigo e adiciona o novo mês no início
        setMeses(prev => {
          const novoMes = { 
            nome: agora.toLocaleString("pt-BR",{month:"long",year:"numeric"}), 
            ano: agora.getFullYear(), 
            mes: agora.getMonth() 
          };
          return [novoMes, ...prev.slice(0,5)]; // novo mês entra primeiro
        });
      }
    }, 1000*60*60); // verifica a cada hora

    return () => clearInterval(timer);
  }, [meses]);

  return (
    <div className={styles.container}>
      <h2>Histórico (últimos 6 meses)</h2>
      <div className={styles.mesesGrid} ref={containerRef}>
        {meses.map((m,i)=>{
          const eventos = getEventosPorMes(m.ano,m.mes);
          const diasNoMes = new Date(m.ano,m.mes+1,0).getDate();
          const dias = Array.from({length:diasNoMes},(_,i)=>i+1);
          const atual = m.mes === hoje.getMonth() && m.ano === hoje.getFullYear();

          return (
            <div key={m.nome} className={`${styles.mesCard} ${atual ? styles.mesAtual : ""}`}>
              <h3>{m.nome.charAt(0).toUpperCase()+m.nome.slice(1)}</h3>
              <div className={styles.diasGrid}>
                {dias.map(d=>{
                  const eventosDia = eventos.filter(e=>new Date(e.data!).getDate()===d);
                  const temEvento = eventosDia.length>0;
                  return <div key={d} className={`${styles.dia} ${temEvento?styles.comEvento:""}`} onClick={()=>handleDiaClick(eventosDia)}>{d}</div>
                })}
              </div>
            </div>
          )
        })}
      </div>

      {selecionado && (
        <div className={styles.modalOverlay} onClick={()=>setSelecionado(null)}>
          <div className={styles.modalCard} onClick={e=>e.stopPropagation()}>
            <h3>Histórico do dia {new Date(selecionado[0].data!).toLocaleDateString("pt-BR")}</h3>
            {selecionado.map(item=>(
              <div key={item.id} className={styles.itemCard}>
                <p><strong>{item.titulo}</strong></p>
                <div className={styles.infoBox}>
                  <h4>Anotação</h4>
                  <p>{item.descricao??"Nenhuma anotação registrada"}</p>
                </div>
                <div className={styles.infoBox}>
                  <h4>Sintomas</h4>
                  <p>{item.sintomas??"Nenhum sintoma informado"}</p>
                </div>
                <div className={styles.infoBox}>
                  <h4>Receita</h4>
                  <p>{item.receita??"Nenhuma receita registrada"}</p>
                </div>
                <div className={styles.infoBox}>
                  <h4>Encaminhamento</h4>
                  <p>{item.encaminhamento??"Nenhum encaminhamento"}</p>
                </div>
              </div>
            ))}
            <button className={styles.fecharBtn} onClick={()=>setSelecionado(null)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}
