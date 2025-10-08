'use client';
import styles from "./styles.module.css";
import Button from "../Button";

type Paciente = {
  id: number;
  nome: string;
  nivel: number;
  dataNascimento?: string;
  sintomas?: string;
  alergias?: string;
  remedioControlado?: string;
  anotacoes?: string;
};

type TabelaIniciarProps = {
  onIniciar: () => void;
};

export default function TabelaIniciar({ onIniciar }: TabelaIniciarProps) {
  const dados: Paciente[] = [
    {
      id: 1,
      nome: "João Coppi Soares",
      nivel: 5,
      dataNascimento: "1990-05-10",
      sintomas: "Dor de cabeça",
      alergias: "Nenhuma",
      remedioControlado: "Não",
      anotacoes: ""
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.tabelaWrapper}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Nível</th>
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

        <Button onClick={onIniciar}>
          INICIAR
        </Button>
      </div>
    </div>
  );
}
