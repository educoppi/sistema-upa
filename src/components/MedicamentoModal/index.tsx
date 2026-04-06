'use client'
import { useState } from 'react';
import styles from './styles.module.css';
import TextField from '../TextField';
import Select from '../Select';
import Medication from '@/models/Medication';
import Button from '../Button';
import axios from 'axios';

type Props = {
    onClose: () => void;
    onConfirm: () => void;
    medicamento: Medication;
    onShowToast: (message: string, variant: string, title?: string) => void;  // new prop
}

export default function MedicamentoModal({ onClose, onConfirm, medicamento, onShowToast }: Props) {
    const [name, setName] = useState(medicamento.name)
    const [dosage, setDosage] = useState(medicamento.dosage)
    const [type, setType] = useState(medicamento.type)
    const [quantity, setQuantity] = useState(medicamento.quantity)

    const [expiresAt, setExpiresAt] = useState(() => {
        const date = new Date(medicamento.expiresAt);
        if (isNaN(date.getTime())) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });

    async function handleSave() {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `https://projeto-integrador-lf6v.onrender.com/medications/${medicamento.id}`,
                { name, dosage, type, expiresAt: new Date(expiresAt).toISOString(), quantity },
                { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } }
            );
            onShowToast('Medicamento atualizado com sucesso!', 'success');
            onConfirm();
            onClose();
        } catch (err) {
            console.error(err);
            onShowToast('Não foi possível salvar as alterações.', 'danger');
        }
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>EDITAR MEDICAMENTO</h2>
                <div className={styles.container}>
                    <TextField type="text" placeholder="Nome:" text={name} onChange={setName} />
                    <TextField type="text" placeholder="Dosagem:" text={dosage} onChange={setDosage} />
                    <Select
                        name="type"
                        placeholder="Selecione um tipo"
                        campo="tipo"
                        options={[
                            { value: 'comprimido', label: 'Comprimidos' },
                            { value: 'ampola', label: 'Ampola' },
                            { value: 'frasco', label: 'Frasco' },
                            { value: 'capsula', label: 'Cápsulas' },
                            { value: 'outro', label: 'Outro' },
                        ]}
                        value={type}
                        onChange={setType}
                    />
                    <TextField type="date" text={expiresAt} onChange={setExpiresAt} />
                    <TextField type='string' text={quantity.toString()} onChange={(value) => setQuantity(Number(value))} />
                </div>
                <div className={styles.actions}>
                    <Button className={styles.button} onClick={handleSave}>SALVAR</Button>
                    <Button className={styles.button} onClick={onClose}>CANCELAR</Button>
                </div>
            </div>
        </div>
    );
}