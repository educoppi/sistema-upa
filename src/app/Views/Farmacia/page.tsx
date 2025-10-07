'use client'
import Nav from 'react-bootstrap/Nav';
import styles from '@/app/Views/Farmacia/styles.module.css'
import { useState } from "react";
import { Header } from "@/components/Header";
import TabGroup from "@/components/TabGroup";
import TextField from "@/components/TextField";
import Button from '@/components/Button';
import Select from '@/components/Select';
import { Tab, Tabs } from 'react-bootstrap';


// const [cadastrarMedicamento, setCadastrarMedicamento] = useState({
//   name: '',
//   dosage: '',
//   type: '',
//   quantity: '',
//   expiresAt:''
// });



export default function Farmacia() {


  return (
    <>
      < Header />
      <Tabs
        defaultActiveKey="cadastro"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="cadastro" title="CADASTRO">
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
        </Tab>
        <Tab eventKey="busca" title="BUSCA">
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
        </Tab>
        <Tab eventKey="solicitacoes" title="SOLICITAÇÕES">

        </Tab>
      </Tabs>




      <br /><br /><br />







    </>
  );
}