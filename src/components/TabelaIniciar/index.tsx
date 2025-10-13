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
  onIniciar: (id: number) => void;
};

export default function TabelaIniciar({ onIniciar }: TabelaIniciarProps) {
  const dados: Paciente[] = [
    {
      id: 1,
      nome: "João Coppi Soares",
      nivel: 5,
      dataNascimento: "1990-05-10",
      sintomas: "Dor de cabeça intensa",
      alergias: "Nenhuma",
      remedioControlado: "Não",
      anotacoes: ""
    },
    {
      id: 2,
      nome: "Maria Silva",
      nivel: 3,
      dataNascimento: "1985-08-22",
      sintomas: "Febre alta e mal-estar",
      alergias: "Penicilina",
      remedioControlado: "Sim",
      anotacoes: "Observação importante"
    },
    {
      id: 3,
      nome: "Carlos Pereira",
      nivel: 2,
      dataNascimento: "2000-01-15",
      sintomas: "Tosse persistente",
      alergias: "Nenhuma",
      remedioControlado: "Não",
      anotacoes: ""
    },
    {
      id: 4,
      nome: "Ana Rodrigues",
      nivel: 4,
      dataNascimento: "1995-11-30",
      sintomas: "Cansaço constante e dor muscular",
      alergias: "Aspirina",
      remedioControlado: "Sim",
      anotacoes: "Verificar histórico"
    }
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
              <th>Sintomas</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.nome}</td>
                <td>{item.nivel}</td>
                <td>{item.sintomas}</td>
                <td>
                  <Button
                   onClick={() => onIniciar(item.id)}
                  style={{ borderRadius: "12px" }}>
                    INICIAR
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
