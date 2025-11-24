'use client'
import { Header } from "@/components/Header";
import TextField, { TextFieldAnnotation, TextFieldPesquisa, TextFieldReception } from "@/components/TextField";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import axios, { AxiosResponse } from 'axios';
import styles from '@/app/Views/Triage/styles.module.css'
import Select from "@/components/Select";
import Swal from 'sweetalert2';

export default function Triage() {

    const [token, setToken] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [usuario, setUsuario] = useState<any>(null);

    useEffect(() => {
        // Só executa no cliente
        const t = localStorage.getItem('token');
        const u = localStorage.getItem('usuario');
        setToken(t);
        setUsuario(u ? JSON.parse(u) : null);
    }, []);

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

    const [annotationTriage, setAnnotationTriage] = useState("");

    const [recentMedicine, setRecentMedicine] = useState("");

    function classificar() {
        axios.post('https://projeto-integrador-lf6v.onrender.com/records', {
            patientId: paciente.id,
            appointmentDate: new Date().toISOString().split('T')[0],
            level: level,
            symptom: symptom,
            recentMedicine: recentMedicine,
            annotationTriage: annotationTriage
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                        Swal.fire({
                          icon: 'success',
                          title: 'Sucesso!',
                          text: 'Paciente classificado com sucesso!',
                          confirmButtonColor: '#3085d6',
                        });
            })
            .catch(error => {
                              Swal.fire({
                                icon: 'error',
                                title: 'Erro!',
                                text: 'Erro ao classificar Paciente.',
                                confirmButtonColor: '#d33',
                              });
            });

        if (paciente.allergy) {
            atualizaAlergia(paciente.allergy, paciente.id)
        }

    }

    function atualizaAlergia(alergia: string, id: number) {
        axios.put(`https://projeto-integrador-lf6v.onrender.com/users/${id}`,
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
                            <h3 className={styles.name}>{paciente.name + " " + paciente.lastName}</h3>


                            <div className={styles.container}>

                                <Select
                                    label="Nível de Urgência"
                                    name="level"
                                    placeholder="Selecione um nível"
                                    campo="Nível"
                                    options={[
                                        { value: '5', label: 'Prioridade Máxima' },
                                        { value: '4', label: 'Prioridade Alta' },
                                        { value: '3', label: 'Prioridade Média' },
                                        { value: '2', label: 'Prioridade Baixa' },
                                        { value: '1', label: 'Prioridade Mínima' },
                                    ]}
                                    value={level}
                                    onChange={setLevel}
                                />

                                < TextFieldReception type="text" label="Sintomas:" placeholder="Sintomas" onChange={setSymptom} text={symptom} />

                                < TextFieldReception type="text" label="Medicamento Controlado:" placeholder="Medicamento Controlado" onChange={setRecentMedicine} text={recentMedicine} />

                                < TextFieldReception type="text" label="Alergia:" onChange={allergy => setPaciente({ ...paciente, allergy: allergy })} text={paciente.allergy} />

                                < TextFieldAnnotation type="text" label="Anotação:" placeholder="Anotação" onChange={setAnnotationTriage} text={annotationTriage} />

                            </div>
                                <Button className={styles.buttonForm} onClick={classificar}>Classificar</Button>
                        </div>

                    </>
                )
            }


        </>
    );
}