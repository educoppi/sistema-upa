'use client'
import { useState } from 'react';
import styles from './styles.module.css';
import TextField from '../TextField';
import Select from '../Select';


export default function MeuModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>Edição de </h2>
                <div className={styles.container}>
                    <TextField type="text" label="Nome:" />
                    <TextField type="text" label="Dosagem:" />
                    <Select
                        label="Tipo"
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

                    />
                    <TextField type="date" label="Vencimento:" />
                </div>




                <p>Deseja confirmar esta ação?</p>
                <div className={styles.actions}>
                    <button onClick={onConfirm}>Salvar</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>

    );

}
