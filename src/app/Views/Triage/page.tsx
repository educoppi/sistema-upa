'use client'
import { Header } from "@/components/Header";
import TextField from "@/components/TextField";
import { useState } from "react";
import { Button } from "react-bootstrap";
import axios, { AxiosResponse } from 'axios';
import styles from '@/app/Views/Farmacia/styles.module.css'
import Select from "@/components/Select";

export default function Triage() {

    const token = localStorage.getItem('token');
    const usuarioString = localStorage.getItem('usuario');
    const usuario = usuarioString ? JSON.parse(usuarioString) : null;

    const [cpf, setCpf] = useState("");

    const [paciente, setPaciente] = useState({
        id: 0,
        name: '',
        lastName: '',
        cpf: '',
        phone: '',
        email: '',
        allergy: '',
        birthDate: ''
    });

    const [telaCadastro, setTelaCadastro] = useState(false);

    function pesquisar() {
        axios.get(`http://localhost:3000/users?cpf=${cpf}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response.data)
                setPaciente({
                    id: response.data.id,
                    name: response.data.name,
                    lastName: response.data.lastName,
                    cpf: response.data.cpf,
                    phone: response.data.phone,
                    email: response.data.email,
                    allergy: response.data.allergy,
                    birthDate: response.data.birthDate
                })
                setTelaCadastro(true)
            })
    }

    const [level, setLevel] = useState("");

    const [symptom, setSymptom] = useState("");

    const [recentMedicine, setRecentMedicine] = useState("");

    function classificar() {

    }



    return (
        <>
            <Header name={usuario?.name || "Usuário"} />

            <div className={styles.container_pesquisa}>
                < TextField type="text" placeholder="Pesquise pelo CPF do Paciente" onChange={setCpf} text={cpf} />

                <Button onClick={pesquisar}>Pesquisar</Button>


            </div>

            {
                telaCadastro && (
                    <>
                       <Select
                         label="Nível de Urgência"
                         name="level"
                         placeholder="Selecione um nível"
                         campo="Nível"
                         options={[
                           { value: '1', label: 'Prioridade Máxima' },
                           { value: '2', label: 'Prioridade Alta' },
                           { value: '3', label: 'Prioridade Média' },
                           { value: '4', label: 'Prioridade Baixa' },
                           { value: '5', label: 'Prioridade Mínima' },
                         ]}
                         value={level}
                         onChange={setLevel}
                       />

                        < TextField type="text" placeholder="Sintomas" onChange={setSymptom} text={symptom} />

                        < TextField type="text" placeholder="Medicamento Recente" onChange={setRecentMedicine} text={recentMedicine} />

                        <Button onClick={classificar}>Classificar</Button>
                    </>
                )
            }


        </>
    );
}