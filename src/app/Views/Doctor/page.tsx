'use client';
import { useState } from "react";
import { Tabs, Tab } from 'react-bootstrap';
import { Header } from '@/components/Header';
import TabelaIniciar from '@/components/TabelaIniciar';
import FichaMedica from '@/components/Atendimento';
import Historico from '@/components/Historico';

export default function Doctor() {

  const token = localStorage.getItem('token');
  const usuarioString = localStorage.getItem('usuario');
  const usuario = usuarioString ? JSON.parse(usuarioString) : null;

  const [iniciado, setIniciado] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState("atendimento");

  const pacientePadrao = {
    id: 1,
    nome: "João Coppi Soares",
    nivel: 5,
    dataNascimento: "1990-05-10",
    sintomas: "Dor de cabeça",
    alergias: "Nenhuma",
    remedioControlado: "Não",
    anotacoes: ""
  };

  const [historicoAtendimentos, setHistoricoAtendimentos] = useState([
    { id: 1, titulo: "Consulta – Dor de cabeça", data: "2025-10-05", descricao: "Paciente relatou melhora com medicação." },
  ]);
function finalizarAtendimento(anotacoes: string) {
  const hojeStr = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  const novaEntrada = {
    id: historicoAtendimentos.length + 1,
    titulo: `Consulta – ${pacientePadrao.sintomas}`,
    data: hojeStr,
    descricao: anotacoes || "Sem anotações."
  };
  setHistoricoAtendimentos([novaEntrada, ...historicoAtendimentos]);
  setIniciado(false);
  setAbaAtiva("atendimento");
}

//console.log("Token:", token);
//console.log("Usuário:", usuario.);
//console.log("pega a role do user:", usuario.role[0]);

  return (
    <>
      <Header name={usuario?.name || "Usuário"}/>

      {!iniciado ? (
        <TabelaIniciar onIniciar={() => setIniciado(true)} />
      ) : (
        <Tabs
          activeKey={abaAtiva}
          onSelect={(a) => setAbaAtiva(a || "atendimento")}
          className="mb-3"
        >
          <Tab eventKey="atendimento" title="ATENDIMENTO">
            <FichaMedica
              paciente={pacientePadrao}
              onVoltar={() => setIniciado(false)}
              onFinalizar={finalizarAtendimento}
            />
          </Tab>

          <Tab eventKey="historico" title="HISTÓRICO">
            <Historico
            />
          </Tab>
        </Tabs>
      )}
    </>
  );
}
