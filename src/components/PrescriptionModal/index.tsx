
import styles from './styles.module.css';

interface PrescriptionModalProps {
    onClose: () => void;
  }
 
  export default function PrescriptionModal({ onClose }: PrescriptionModalProps) {
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
            <input type="text" placeholder="__/__/____" />
          </div>
 
          <div className={styles.fieldGroup}>
            <label>Paciente:</label>
            <input type="text" placeholder="Nome do paciente" />
          </div>
 
          <div className={styles.fieldGroup}>
            <label>Medicamentos:</label>
            <textarea
              placeholder={`Exemplo:
• Omeprazol 20 mg (comprimidos)
Tomar 1 comprimido oral, por 30 dias. Quantidade: 30 unidades.
 
• Ondansetrona 8 mg (comprimidos)
Tomar se necessário.`}
            />
          </div>
 
          <div className={styles.obsBox}>
            <strong>Orientações / Observações:</strong>
            <textarea placeholder="Ex: Iniciar 1h antes do café. Evitar álcool." />
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
          <button className={styles.finalize}>Finalizar</button>
        </footer>
      </div>
    </div>
  );
}