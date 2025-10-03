'use client'
import { useState } from "react";
import { Header } from "@/components/Header";
import Tab from "@/components/Tab";
import TabGroup from "@/components/TabGroup";

export default function Farmacia() {

const tabs = [{"label": "ESTOQUE", "value": "estoque"}, {"label": "SOLICITAÇÕES", "value" : "solicitacoes"}, {"label": "VENCIMENTOS", "value" : "vencimentos"}]

  return (
    <>
      < Header />
      <TabGroup tabs={tabs} name="farmacia" />

      <h2>CONTROLE DE MEDICAMENTOS</h2>



    </>
  );
}