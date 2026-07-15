import styles from './BarraAmbito.module.css';

function IconChevronRight() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9.5 6L15.5 12L9.5 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export interface BarraAmbitoProps {
  /** Nombre de la gerencia/área. Ej: "Comercial" */
  label: string;
  /** Valor logrado (0–100). Determina el ancho de la barra de relleno */
  logrado: number;
  /** Valor esperado (0–100). Determina la posición de la marca de referencia */
  esperado: number;
  /** Texto de variación vs. período anterior. Ej: "-5" */
  delta?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * BarraAmbito — fila de barra comparativa horizontal (logrado vs. esperado) por gerencia.
 * Fuente: Figma nodo 664:1363 ("Gerencia1", sección "Ámbitos de Evaluación").
 */
export function BarraAmbito({ label, logrado, esperado, delta, onClick, className }: BarraAmbitoProps) {
  return (
    <button
      type="button"
      className={[styles.row, className].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <span className={styles.meta}>
          Logrado: {logrado} &nbsp;&nbsp;Esp: {esperado}
          {delta && <>&nbsp;&nbsp;{delta}</>}
        </span>
      </div>

      <div className={styles.barContainer}>
        <div className={styles.track}>
          <div className={styles.fill} style={{ width: `${logrado}%` }} />
          <div className={styles.tick} style={{ left: `${esperado}%` }} />
        </div>
        <span className={styles.value}>{logrado}</span>
        <span className={styles.chevron} aria-hidden="true"><IconChevronRight /></span>
      </div>
    </button>
  );
}
