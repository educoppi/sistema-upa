import { useEffect, useState } from 'react';
import styles from './styles.module.css';

interface PrescriptionModalProps {
  onClose: () => void;
  patientName: string;
  onSave: (receitaTexto: string) => void;
}

export default function PrescriptionModal({ onClose, patientName, onSave }: PrescriptionModalProps) {
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
  `;

    onSave(receitaCompleta.trim());
};


  const [date, setDate] = useState('');

  useEffect(() => {
    const today = new Date();
    const formatted = today.toLocaleDateString('pt-BR');
    setDate(formatted);
  }, []);
  
  return (
    <div className={styles.overlay}>
      <div className={styles.page}>
        {/* Cabeçalho */}
        <header className={styles.header}>
          <div className={styles.logoArea}>
            <img src="/images/logo.png" alt="Logo São Lucas" className={styles.logo} />
            <div className={styles.headerText}>
              <h1>São Lucas</h1>
              <p>Pronto Atendimento</p>
            </div>
          </div>
          <div className={styles.headerTitle}>PRESCRIÇÃO</div>
        </header>

        {/* Conteúdo da Receita */}
        <main className={styles.content}>
          <h2>Receita do Paciente</h2>

          <div className={styles.fieldGroup}>
            <label>Data:</label>
            <input type="text" value={date} readOnly/>
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
                  Tomar 1 comprimido oral, por 30 dias. Quantidade: 30 unidades.
                  
                  • Ondansetrona 8 mg (comprimidos)
                  Tomar se necessário.`}
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
            <span>Dr. Osvaldo Mendes</span>
          </div>
        </main>

        {/* Rodapé com Botões */}
        <footer className={styles.footer}>
          <button className={styles.cancel} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.finalize} onClick={handleFinalize}>Finalizar</button>
        </footer>
      </div>
    </div>
  );
}