import styles from './ObjetivosEquipoSection.module.css';

export interface ObjetivoRow {
  label: string;
  /** Texto de la meta, ej. "99.5%", "4 hrs", "8 cert." */
  meta: string;
  /** Texto de lo logrado, ej. "99.8%", "3.2 hrs", "7 cert." */
  logrado: string;
  /** Porcentaje de cumplimiento respecto a la meta. Puede superar 100. */
  porcentaje: number;
}

export interface ObjetivosEquipoSectionProps {
  rows: ObjetivoRow[];
}

const META_TICK_PCT = 98;

/**
 * Sección "Objetivos del equipo" de Vista Equipo — barras de cumplimiento
 * logrado vs. meta, con marca de meta (100%) y check cuando se cumple/supera.
 * Fuente: Figma nodo 869:11849 ("Objetivos-Panel").
 */
export function ObjetivosEquipoSection({ rows }: ObjetivosEquipoSectionProps) {
  return (
    <section className={styles.card}>
      <p className={styles.title}>Objetivos del equipo</p>
      <p className={styles.subtitle}>Logrado vs. Meta — Proceso 2025</p>
      <div className={styles.divider} />

      {rows.map((row) => {
        const fillPct = Math.max(0, Math.min(100, row.porcentaje));
        const metCumplida = row.porcentaje >= 100;
        const tickOverFill = fillPct >= META_TICK_PCT;

        return (
          <div className={styles.row} key={row.label}>
            <div className={styles.rowHeader}>
              <p className={styles.rowLabel}>{row.label}</p>
              <p className={styles.rowMeta}>
                {`Meta: ${row.meta}  Logrado: ${row.logrado}  ${row.porcentaje}%`}
                {metCumplida && ' ✓'}
              </p>
            </div>
            <div className={styles.track}>
              <div className={styles.fill} style={{ width: `${fillPct}%` }} />
              <div
                className={`${styles.metaTick}${tickOverFill ? ` ${styles.metaTickLight}` : ''}`}
                style={{ left: `${META_TICK_PCT}%` }}
              />
            </div>
          </div>
        );
      })}

      <p className={styles.footnote}>--- línea = meta (100% cumplimiento)</p>
    </section>
  );
}
