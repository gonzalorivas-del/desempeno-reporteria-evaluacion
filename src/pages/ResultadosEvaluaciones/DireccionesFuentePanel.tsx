import styles from './DireccionesFuentePanel.module.css';

export interface DireccionFuenteRow {
  label: string;
  /** Calificación 0-100 */
  valor: number;
}

export interface DireccionesFuentePanelProps {
  rows: DireccionFuenteRow[];
}

/**
 * Panel "Direcciones de Evaluación" — Calificación por Fuente (Descendente,
 * Autoevaluación, Pares, etc.) de un colaborador.
 * Fuente: Figma nodo 869:12764 ("Direcciones-Panel").
 */
export function DireccionesFuentePanel({ rows }: DireccionesFuentePanelProps) {
  return (
    <section className={styles.card}>
      <p className={styles.title}>Direcciones de Evaluación</p>
      <p className={styles.subtitle}>Calificación por Fuente</p>
      <div className={styles.divider} />

      {rows.map((row) => (
        <div className={styles.row} key={row.label}>
          <div className={styles.rowHeader}>
            <p className={styles.rowLabel}>{row.label}</p>
            <p className={styles.rowValor}>{row.valor}</p>
          </div>
          <div className={styles.track}>
            <div className={styles.fill} style={{ width: `${Math.max(0, Math.min(100, row.valor))}%` }} />
          </div>
        </div>
      ))}
    </section>
  );
}
