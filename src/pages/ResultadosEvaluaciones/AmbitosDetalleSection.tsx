import { BarraAmbito } from '../../components/BarraAmbito';
import styles from './AmbitosDetalleSection.module.css';

function IconDownload() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v11M7.5 10.5L12 15l4.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export interface AmbitoDetalleRow {
  label: string;
  logrado: number;
  esperado: number;
  delta?: string;
}

export interface AmbitosDetalleSectionProps {
  rows: AmbitoDetalleRow[];
}

/**
 * Sección "Ámbitos de Evaluación" de la vista Área/Gerencia — desglose de
 * Calificación final, Competencias, Objetivos y Otros para un área específica.
 * Fuente: Figma nodo 961:5449 ("Vista area/gerencia - Tecnologia" / Comercial).
 */
export function AmbitosDetalleSection({ rows }: AmbitosDetalleSectionProps) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <p className={styles.title}>Ámbitos de Evaluación</p>
          <p className={styles.subtitle}>Desglose Calificación por Ámbito</p>
        </div>
        <button type="button" className={styles.downloadButton} aria-label="Descargar">
          <IconDownload />
        </button>
      </div>

      <div className={styles.list}>
        {rows.map((row) => (
          <BarraAmbito key={row.label} {...row} />
        ))}
      </div>

      <p className={styles.legend}>
        <span className={styles.legendTick} aria-hidden="true" />
        línea = valor esperado por ámbito
      </p>
    </section>
  );
}
