'use client'
import styles from '@/app/Views/Farmacia/styles.module.css'
import { useState } from "react";
import { Header } from "@/components/Header";
import Tab from "@/components/Tab";
import TabGroup from "@/components/TabGroup";
import TextField from "@/components/TextField";
import Button from '@/components/Button';
import Select from '@/components/Select';

export default function Farmacia() {

  // const tabs = [{ "label": "ESTOQUE", "value": "estoque" }, { "label": "SOLICITAÇÕES", "value": "solicitacoes" }, { "label": "VENCIMENTOS", "value": "vencimentos" }]

  return (
    <>
      < Header />

      <nav>
        <div className="nav nav-tabs" id="nav-tab" role="tablist">
          <button className="nav-link active" id="nav-solicitacao-tab" data-bs-toggle="tab" data-bs-target="#nav-solicitacao" type="button" role="tab" aria-controls="nav-solicitacao" aria-selected="true">SOLICITAÇÕES</button>
          <button className="nav-link active" id="nav-cadastrar-tab" data-bs-toggle="tab" data-bs-target="#nav-cadastrar" type="button" role="tab" aria-controls="nav-cadastrar" aria-selected="true">CADASTRAR</button>
                    <button className="nav-link" id="nav-buscar-tab" data-bs-toggle="tab" data-bs-target="#nav-buscar" type="button" role="tab" aria-controls="nav-buscar" aria-selected="false">BUSCAR</button>
          <button className="nav-link" id="nav-estoque-tab" data-bs-toggle="tab" data-bs-target="#nav-estoque" type="button" role="tab" aria-controls="nav-estoque" aria-selected="false">ESTOQUE</button>
        </div>
      </nav>
      <div className="tab-content" id="nav-tabContent">
        <div className="tab-pane fade show active" id="nav-solicitacao" role="tabpanel" aria-labelledby="nav-solicitacao-tab" tabindex="0">...</div>
        <div className="tab-pane fade show active" id="nav-cadastrar" role="tabpanel" aria-labelledby="nav-cadastrar-tab" tabindex="0">...</div>
        <div className="tab-pane fade" id="nav-buscar" role="tabpanel" aria-labelledby="nav-buscar-tab" tabindex="0">...</div>
        <div className="tab-pane fade" id="nav-estoque" role="tabpanel" aria-labelledby="nav-estoque-tab" tabindex="0">...</div>
      </div>

      <div className={styles.container}>
        <h2>CADASTRO DE MEDICAMENTOS</h2>

        <div className={styles.form}>
          <TextField type="text" label="Nome" />
          <TextField type="text" label="Dosagem" />
          <Select
            label="Tipo"
            name="type"
            placeholder="Tipo"
            campo="tipo"
            options={[
              { value: 'comprimido', label: 'Comprimidos' },
              { value: 'capsula', label: 'Cápsulas' },
              { value: 'gotas', label: 'Gotas' },
              { value: 'intravenoso', label: 'Intravenoso' },

            ]}
          />
          <TextField type="text" label="Quantidade" />
          <TextField type="date" label="Vencimento" />

          <Button>CADASTRAR</Button>
        </div>
      </div>

<br /><br /><br />

      <div className={styles.container}>
        <h2>PESQUISA DE MEDICAMENTOS</h2>

        <div className={styles.form}>
          <TextField type="text" label="Nome" />
          <TextField type="text" label="Dosagem" />
          <Select
            label="Tipo"
            name="type"
            placeholder="Tipo"
            campo="tipo"
            options={[
              { value: 'comprimido', label: 'Comprimidos' },
              { value: 'capsula', label: 'Cápsulas' },
              { value: 'gotas', label: 'Gotas' },
              { value: 'intravenoso', label: 'Intravenoso' },

            ]}
          />

          <Button>BUSCAR</Button>
        </div>
      </div>





    </>
  );
}