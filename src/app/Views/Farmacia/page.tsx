'use client'
import styles from '@/app/Views/Farmacia/styles.module.css'
import { useState } from "react";
import { Header } from "@/components/Header";
import TextField from "@/components/TextField";
import Button from '@/components/Button';
import Select from '@/components/Select';
import { Tabs, Tab } from 'react-bootstrap';
import axios, { AxiosResponse } from 'axios';

export default function Farmacia() {

  async function cadastrar() {
    axios.post("http://localhost:3000/medications", cadastrarMedicamento)
      .then(function (response: AxiosResponse) {
        console.log("deu certo");
      })
      .catch(function () {
        console.log()
      })
  }

  const [cadastrarMedicamento, setCadastrarMedicamento] = useState({
    name: '',
    dosage: '',
    type: '',
    quantity: '',
    expiresAt: ''
  });

  return (
    <>
      < Header />
      <Tabs
        defaultActiveKey="solicitacoes"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="solicitacoes" title="SOLICITAÇÕES">
        </Tab>
        <Tab eventKey="cadastro" title="CADASTRO">
          <div className={styles.container}>
            <h2>CADASTRO DE MEDICAMENTOS</h2>

            <div className={styles.form}>
              <TextField type="text" label="Nome" onChange={name => setCadastrarMedicamento({ ...cadastrarMedicamento, name: name })} text={cadastrarMedicamento.name} />
              <TextField type="text" label="Dosagem" onChange={dosage => setCadastrarMedicamento({ ...cadastrarMedicamento, dosage: dosage })} text={cadastrarMedicamento.dosage} />
              <Select
                label="Tipo"
                name="type"
                placeholder="Selecione um tipo"
                campo="tipo"
                options={[
                  { value: 'comprimido', label: 'Comprimidos' },
                  { value: 'capsula', label: 'Cápsulas' },
                  { value: 'gotas', label: 'Gotas' },
                  { value: 'intravenoso', label: 'Intravenoso' },
                ]}
                value={cadastrarMedicamento.type}
                onChange={type => setCadastrarMedicamento({ ...cadastrarMedicamento, type: type })}
              />
              <TextField type="text" label="Quantidade" onChange={quantity => setCadastrarMedicamento({ ...cadastrarMedicamento, quantity: quantity })} text={cadastrarMedicamento.quantity} />
              <TextField type="date" label="Vencimento" onChange={expiresAt => setCadastrarMedicamento({ ...cadastrarMedicamento, expiresAt: expiresAt })} text={cadastrarMedicamento.expiresAt} />

              <Button onClick={cadastrar}>CADASTRAR</Button>
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
                onChange={type => setCadastrarMedicamento({ ...cadastrarMedicamento, type: type })} value={''} />

              <Button>BUSCAR</Button>
            </div>
          </div>
        </Tab>

        <Tab eventKey="estoque" title="ESTOQUE">

        </Tab>
      </Tabs>




      <br /><br /><br />







    </>
  );
}