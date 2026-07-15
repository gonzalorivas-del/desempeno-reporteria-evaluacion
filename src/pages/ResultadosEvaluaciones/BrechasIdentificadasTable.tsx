import styles from './BrechasIdentificadasTable.module.css';

export interface BrechaRow {
  competencia: string;
  /** Valor logrado, 0-100 */
  logrado: number;
  /** Valor esperado, 0-100 */
  esperado: number;
}

export interface BrechasIdentificadasTableProps {
  rows: BrechaRow[];
}

/**
 * Tabla "Principales brechas identificadas" de Vista Colaborador — compara el
 * valor logrado vs. esperado por competencia, con una barra de progreso visual
 * (relleno = logrado%, marca = esperado%, ambos sobre una escala 0-100).
 * Fuente: Figma nodo 869:12786 ("Brechas-Panel").
 */
export function BrechasIdentificadasTable({ rows }: BrechasIdentificadasTableProps) {
  return (
    <section className={styles.card}>
      <p className={styles.title}>Principales brechas identificadas</p>

      <div className={styles.headerRow}>
        <span className={styles.colCompetencia}>Competencia</span>
        <span className={styles.colValor}>Logrado</span>
        <span className={styles.colValor}>Esperado</span>
        <span className={styles.colValor}>Brecha</span>
        <span className={styles.colProgreso}>Progreso visual</span>
      </div>

      {rows.map((row, i) => {
        const brecha = row.logrado - row.esperado;
        const isLast = i === rows.length - 1;
        return (
          <div
            key={row.competencia}
            className={`${styles.row}${isLast ? ` ${styles.rowLast}` : ''}`}
          >
            <span className={`${styles.colCompetencia} ${styles.competenciaText}`}>{row.competencia}</span>
            <span className={`${styles.colValor} ${styles.logradoText}`}>{row.logrado}</span>
            <span className={`${styles.colValor} ${styles.esperadoText}`}>{row.esperado}</span>
            <span className={`${styles.colValor} ${styles.brechaText}`}>{brecha > 0 ? `+${brecha}` : brecha}</span>
            <div className={styles.colProgreso}>
              <div className={styles.track}>
                <div className={styles.fill} style={{ width: `${Math.max(0, Math.min(100, row.logrado))}%` }} />
                <div className={styles.tick} style={{ left: `${Math.max(0, Math.min(100, row.esperado))}%` }} />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
