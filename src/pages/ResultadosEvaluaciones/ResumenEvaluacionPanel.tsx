import styles from './ResumenEvaluacionPanel.module.css';

export interface ResumenEvaluacionRow {
  label: string;
  /** Ej. "Ponderación: 60%" */
  ponderacion: string;
  /** % logrado en este ámbito, 0-100 */
  valor: number;
}

export interface ResumenEvaluacionPanelProps {
  rows: ResumenEvaluacionRow[];
}

/** Posición de la marca de referencia, medida en píxeles sobre el diseño de Figma (~82% del track). */
const REFERENCIA_PCT = 82;

/**
 * Panel "Resumen de Evaluación" — Desglose por Ámbito (Competencias / Objetivos)
 * con barra de logro y marca de referencia.
 * Fuente: Figma nodo 869:12742 ("Resumen-Panel").
 */
export function ResumenEvaluacionPanel({ rows }: ResumenEvaluacionPanelProps) {
  return (
    <section className={styles.card}>
      <p className={styles.title}>Resumen de Evaluación</p>
      <p className={styles.subtitle}>Desglose por Ámbito</p>
      <div className={styles.divider} />

      {rows.map((row) => (
        <div className={styles.row} key={row.label}>
          <div className={styles.rowHeader}>
            <p className={styles.rowLabel}>{row.label}</p>
            <div className={styles.rowMetaGroup}>
              <p className={styles.rowPonderacion}>{row.ponderacion}</p>
              <p className={styles.rowValor}>{row.valor}%</p>
            </div>
          </div>
          <div className={styles.track}>
            <div className={styles.fill} style={{ width: `${Math.max(0, Math.min(100, row.valor))}%` }} />
            <div className={styles.tick} style={{ left: `${REFERENCIA_PCT}%` }} />
          </div>
        </div>
      ))}
    </section>
  );
}
