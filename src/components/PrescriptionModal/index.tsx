import { useEffect, useState } from 'react';
import styles from './styles.module.css';

interface PrescriptionModalProps {
  onClose: () => void;
  patientName: string;
  onSave: (receitaTexto: string) => void;
  doctorName?: string;
}

export default function PrescriptionModal({ onClose, patientName, onSave, doctorName}: PrescriptionModalProps) {
  const [medications, setMedications] = useState('');
  const [observations, setObservations] = useState('');
  const now = new Date();
  const dataFormatada = now.toLocaleDateString('pt-BR');
  const horaFormatada = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });


  const handleFinalize = () => {
  const receitaCompleta = `
    Paciente: ${patientName}
    Data: ${dataFormatada} ${horaFormatada}
    
    Medicamentos:
    ${medications}
    
    Observações:
    ${observations}

    Assinatura: 
    ${doctorName}
  `;

    

    onSave(receitaCompleta.trim());
};

  const [dateTime, setDateTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString('pt-BR');
      const formattedTime = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
  });
  setDateTime(`${formattedDate} ${formattedTime}`);
};
    updateDateTime();
    const interval = setInterval(updateDateTime, 6000); 
    return () => clearInterval(interval);
}, []);

  return (
    <div className={styles.overlay}>
      <div className={styles.page}>
        {/* Cabeçalho */}
        <header className={styles.header}>
          <div className={styles.logoArea}>
            <img src="/images/logo.png" alt="Logo SisUPA" className={styles.logo} />
            <div className={styles.headerText}>
              <h1>SisUPA</h1>
              <p>Unidade de Pronto</p>
              <p>Atendimento</p>
            </div>
          </div>
          <div className={styles.headerTitle}>PRESCRIÇÃO</div>
        </header>

        {/* Conteúdo da Receita */}
        <main className={styles.content}>
          <h2>Receita do Paciente</h2>

          <div className={styles.fieldGroup}>
            <label>Data e Hora:</label>
            <input type="text" value={dateTime} readOnly/>
          </div>

          <div className={styles.fieldGroup}>
            <label>Paciente:</label>
            <input type="text" value={patientName} readOnly/>
          </div>

          <div className={styles.fieldGroup}>
            <label>Medicamentos:</label>
            <textarea
                value={medications}
                onChange={(e) => setMedications(e.target.value)}
                placeholder={`Exemplo:
                  • Omeprazol 20 mg (comprimidos)
                  Tomar 1 comprimido oral, por 30 dias. Quantidade: 30 unidades.`}
              />
          </div>

          <div className={styles.obsBox}>
            <strong>Orientações / Observações:</strong>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Ex: Iniciar 1h antes do café. Evitar álcool."
            />
          </div>

          <div className={styles.signature}>
            <p>_________________________________</p>
            <span>Dr.{doctorName}</span>
          </div>
        </main>

        {/* Rodapé com Botões */}
        <footer className={styles.footer}>
          <button className={styles.cancel} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.finalize} 
                  onClick={handleFinalize}   
                  disabled={!medications.trim()}
              >
                Finalizar
              </button>
        </footer>
      </div>
    </div>
  );
}