'use client'
import styles from '@/app/Views/Farmacia/styles.module.css'
import { useState } from "react";
import { Header } from "@/components/Header";
import Tab from "@/components/Tab";
import TabGroup from "@/components/TabGroup";
import TextField from "@/components/TextField";
import Button from '@/components/Button';

export default function Farmacia() {

  const tabs = [{ "label": "ESTOQUE", "value": "estoque" }, { "label": "SOLICITAÇÕES", "value": "solicitacoes" }, { "label": "VENCIMENTOS", "value": "vencimentos" }]

  return (
    <>
      < Header />
      <TabGroup tabs={tabs} name="farmacia" />

      <h2>CONTROLE DE MEDICAMENTOS</h2>

      <div className={styles.form}>
        <TextField label="Nome" />
        <TextField label="Dosagem" />



        <TextField label="Quantidade" />
        <TextField label="Vencimento" />

        <Button>CADASTRAR</Button>
      </div>




    </>
  );
}