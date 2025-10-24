'use client'
import { useState } from 'react';
import styles from './styles.module.css';
import TextField from '../TextField';
import Select from '../Select';


export default function MeuModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>EDITAR</h2>
                <div className={styles.container}>
                    <TextField type="text" placeholder="Nome:" />
                    <TextField type="text" placeholder="Dosagem:" />
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

                    />
                    <TextField type="date" />
                </div>
                <p>Deseja confirmar esta ação?</p>
                <div className={styles.actions}>
                    <button className={styles.button} onClick={onConfirm}>SALVAR</button>
                    <button className={styles.button} onClick={onClose}>CANCELAR</button>
                </div>
            </div>
        </div>

    );

}
