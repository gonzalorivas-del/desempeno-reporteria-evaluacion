import styles from './ObjetivosIndividualesTable.module.css';

export interface ObjetivoIndividualRow {
  descripcion: string;
  /** Texto de la meta, ej. "99.5 %", "4 hrs", "2 cert." */
  meta: string;
  /** Texto de lo logrado, ej. "99.8 %", "3.2 hrs", "2 cert." */
  logrado: string;
  /** Porcentaje de cumplimiento respecto a la meta, ya acotado a 100 (ej. una reducción que superó la meta se muestra en 100%, no en el ratio crudo). */
  cumplimiento: number;
}

export interface ObjetivosIndividualesTableProps {
  proceso: string;
  objetivos: ObjetivoIndividualRow[];
}

/**
 * Tabla "Objetivos Individuales" — Vista Colaborador, tab Objetivos.
 * Fuente: Figma nodo 869:11034 ("Panel-Objetivos").
 */
export function ObjetivosIndividualesTable({ proceso, objetivos }: ObjetivosIndividualesTableProps) {
  const alcanzados = objetivos.filter((o) => o.cumplimiento >= 100).length;

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <p className={styles.title}>Objetivos Individuales — Proceso {proceso}</p>
        <p className={styles.subtitle}>{alcanzados} de {objetivos.length} objetivos alcanzados</p>
      </div>

      <div className={styles.tableHeader}>
        <span className={styles.colDescripcion}>Descripción del Objetivo</span>
        <span className={styles.colMeta}>Meta</span>
        <span className={styles.colMeta}>Logrado</span>
        <span className={styles.colCumplimiento}>Cumplimiento</span>
        <span className={styles.colProgreso}>Progreso</span>
      </div>

      {objetivos.map((objetivo, i) => {
        const alcanzado = objetivo.cumplimiento >= 100;
        const isLast = i === objetivos.length - 1;
        return (
          <div
            key={objetivo.descripcion}
            className={[styles.row, !isLast ? styles.rowDivider : ''].filter(Boolean).join(' ')}
          >
            <span className={styles.colDescripcion}>{objetivo.descripcion}</span>
            <span className={`${styles.colMeta} ${styles.metaText}`}>{objetivo.meta}</span>
            <span className={`${styles.colMeta} ${styles.logradoText}`}>{objetivo.logrado}</span>
            <span
              className={styles.colCumplimiento}
              style={{ color: alcanzado ? '#6C7E01' : '#5780AD' }}
            >
              {objetivo.cumplimiento}%
            </span>
            <div className={styles.colProgreso}>
              <div className={styles.track}>
                <div
                  className={styles.fill}
                  style={{
                    width: `${Math.max(0, Math.min(100, objetivo.cumplimiento))}%`,
                    backgroundColor: alcanzado ? '#ACCA54' : '#5780AD',
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
