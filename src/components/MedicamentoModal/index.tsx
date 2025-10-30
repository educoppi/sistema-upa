'use client'
import { useState } from 'react';
import styles from './styles.module.css';
import TextField from '../TextField';
import Select from '../Select';
import Medication from '@/models/Medication';
import Button from '../Button';

type Props = {
    onClose: () => void;
    onConfirm: () => void;
    medicamento: Medication;
}


export default function MedicamentoModal({ onClose, onConfirm, medicamento }: Props) {

    const [name, setName] = useState(medicamento.name)
    const [dosage, setDosage] = useState(medicamento.dosage)
    const [type, setType] = useState(medicamento.type)
    
    const [expiresAt, setExpiresAt] = useState(() => {
        const date = new Date(medicamento.expiresAt);
        if (isNaN(date.getTime())) return '';


        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    });

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>EDITAR</h2>
                <div className={styles.container}>
                    <TextField type="text" placeholder="Nome:" text={medicamento.name} onChange={setName} />
                    <TextField type="text" placeholder="Dosagem:" text={medicamento.dosage} onChange={setDosage} />
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
                        value={medicamento.type}
                        onChange={setType}

                    />
                    <TextField
                        type="date"
                        text={expiresAt}
                        onChange={setExpiresAt}
                    />
                </div>
                <p>Deseja confirmar esta ação?</p>
                <div className={styles.actions}>
                    <Button className={styles.button} onClick={onConfirm}>SALVAR</Button>
                    <Button className={styles.button} onClick={onClose}>CANCELAR</Button>
                </div>
            </div>
        </div>

    );

}
