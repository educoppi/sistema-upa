import React from 'react';
import styles from './Styles.module.css';

function Tabela() {
    const dados = [
        { id: 1, nome: 'João', nivel: 5 }
    ];
    return (
        <div className={styles.container}>
            <table className={styles.tabela}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Nivel</th>
                    </tr>
                </thead>
                <tbody>
                    {dados.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.nome}</td>
                            <td>{item.nivel}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default Tabela;