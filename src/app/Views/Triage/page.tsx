'use client'
import { Header } from "@/components/Header";
import TextField, { TextFieldPesquisa, TextFieldReception } from "@/components/TextField";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import axios, { AxiosResponse } from 'axios';
import styles from '@/app/Views/Triage/styles.module.css'
import Select from "@/components/Select";
import { PiCpuFill } from "react-icons/pi";

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
        axios.get(`https://projeto-integrador-lf6v.onrender.com/users?cpf=${cpf}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                setPaciente({
                    id: response.data[0].id,
                    name: response.data[0].name,
                    lastName: response.data[0].lastName,
                    cpf: response.data[0].cpf,
                    phone: response.data[0].phone,
                    email: response.data[0].email,
                    allergy: response.data[0].allergy,
                    birthDate: response.data[0].birthDate
                })
                setTelaCadastro(true)
            })
    }

    const [level, setLevel] = useState("");

    const [symptom, setSymptom] = useState("");

    const [recentMedicine, setRecentMedicine] = useState("");

    function classificar() {
        console.log(paciente.id)
        console.log(level)
        console.log(symptom)
        console.log(recentMedicine)
        console.log(new Date().toISOString().split('T')[0])

        axios.post('http://projeto-integrador-lf6v.onrender.com/records', {
            patientId: paciente.id,
            appointmentDate: new Date().toISOString().split('T')[0],
            level: level,
            symptom: symptom,
            recentMedicine: recentMedicine
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('Resposta do servidor:', response.data);
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
            });

        if (paciente.allergy) {
            atualizaAlergia(paciente.allergy, paciente.id)
        }

    }

    function atualizaAlergia(alergia: string, id: Number) {
        axios.put(`http://projeto-integrador-lf6v.onrender.com/users/${id}`,
            {
                allergy: alergia
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
            .then(response => {
                console.log('Resposta:', response.data);
            })
            .catch(error => {
                console.error('Erro:', error.response ? error.response.data : error.message);
            });
    }


    return (

        <>
            <Header name={usuario?.name || "Usuário"} />

            <div className={styles.space}>

            <h1 className={styles.titulo} >Classificação de Paciente</h1>

                <div className={styles.pesquisaField}>
                    <TextFieldPesquisa type="text" placeholder="Pesquise pelo CPF do Paciente" onChange={setCpf} text={cpf} />
                    <Button onClick={pesquisar} className={styles.buttonPesquisar}>Pesquisar</Button>
                </div>

            </div>

            {
                telaCadastro && (
                    <>
                        <div className={styles.space}>
                            <h3 className={styles.name}>{paciente.name}</h3>


                            <div className={styles.container}>

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

                                < TextFieldReception type="text" label="Sintomas:" placeholder="Sintomas" onChange={setSymptom} text={symptom} />

                                < TextFieldReception type="text" label="Medicamento Controlado:" placeholder="Medicamento Controlado" onChange={setRecentMedicine} text={recentMedicine} />

                                < TextFieldReception type="text" label="Alergia:" onChange={allergy => setPaciente({ ...paciente, allergy: allergy })} text={paciente.allergy} />

                            </div>
                                <Button className={styles.buttonForm} onClick={classificar}>Classificar</Button>
                        </div>

                    </>
                )
            }


        </>
    );
}