'use client'
import { Header } from "@/components/Header";
import TextField from "@/components/TextField";
import { useEffect, useState } from "react";
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

        axios.post('http://localhost:3000/records', {
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

            if(paciente.allergy) {
                atualizaAlergia(paciente.allergy, paciente.id)
            }

    }

    function atualizaAlergia(alergia: string, id: Number) {
        axios.put(`http://localhost:3000/users/${id}`, 
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

            <div className={styles.container_pesquisa}>
                < TextField type="text" placeholder="Pesquise pelo CPF do Paciente" onChange={setCpf} text={cpf} />

                <Button onClick={pesquisar}>Pesquisar</Button>


            </div>

            {
                telaCadastro && (
                    <>
                    <h3>{paciente.name}</h3>


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

                        <TextField type="text" label="Alergia" onChange={allergy => setPaciente({ ...paciente, allergy: allergy })} text={paciente.allergy} />

                        <Button onClick={classificar}>Classificar</Button>
                    </>
                )
            }


        </>
    );
}