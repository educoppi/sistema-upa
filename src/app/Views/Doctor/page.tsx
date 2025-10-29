'use client';
import { useState, useEffect } from "react";
import { Tabs, Tab } from 'react-bootstrap';
import { Header } from '@/components/Header';
import TabelaIniciar from '@/components/TabelaIniciar';
import Atendimento from "@/components/Atendimento";
import Historico from '@/components/Historico';

export default function Doctor() {

  const [token, setToken] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<any>(null);
  const [iniciado, setIniciado] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState("atendimento");

  // Carregar token e usuário do localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const usuarioString = localStorage.getItem('usuario');
    setToken(storedToken);
    setUsuario(usuarioString ? JSON.parse(usuarioString) : null);
  }, []);

  // Paciente padrão (usado apenas para ID)
  const pacientePadrao = { id: 1 };

  // Histórico local para controle de finalizações recentes
  const [historicoAtendimentos, setHistoricoAtendimentos] = useState<any[]>([]);

  function finalizarAtendimento(anotacoes: string) {
    const hojeStr = new Date().toISOString().split("T")[0];
    const novaEntrada = {
      id: historicoAtendimentos.length + 1,
      titulo: `Consulta – anotação`,
      data: hojeStr,
      descricao: anotacoes || "Sem anotações."
    };
    setHistoricoAtendimentos([novaEntrada, ...historicoAtendimentos]);
    setIniciado(false);
    setAbaAtiva("atendimento");
  }

  if (!token) {
    return <p>Carregando ou usuário não autenticado...</p>;
  }

  return (
    <>
      <Header name={usuario?.name || "Usuário"} />

      {!iniciado ? (
        <TabelaIniciar onIniciar={() => setIniciado(true)} />
      ) : (
        <Tabs
          activeKey={abaAtiva}
          onSelect={(a) => setAbaAtiva(a || "atendimento")}
          className="mb-3"
        >
          <Tab eventKey="atendimento" title="ATENDIMENTO">
            <Atendimento
              patientId={pacientePadrao.id}
              token={token}
              onVoltar={() => setIniciado(false)}
              onFinalizar={finalizarAtendimento}
            />
          </Tab>

          <Tab eventKey="historico" title="HISTÓRICO">
            <Historico token={token} />
          </Tab>
        </Tabs>
      )}
    </>
  );
}
