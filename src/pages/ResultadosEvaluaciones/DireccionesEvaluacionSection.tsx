import { GraficoBarrasAgrupado } from '../../components/GraficoBarrasAgrupado';
import type {
  GraficoBarrasAgrupadoSerie,
  GraficoBarrasAgrupadoDatum,
} from '../../components/GraficoBarrasAgrupado';
import styles from './DireccionesEvaluacionSection.module.css';

function IconDownload() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v11M7.5 10.5L12 15l4.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const DEFAULT_SERIES: GraficoBarrasAgrupadoSerie[] = [
  { key: 'competencias', label: 'Competencias', color: '#1E5591' }, // colors.primario
  { key: 'objetivos', label: 'Objetivos', color: '#5780AD' },       // colors.panel
];

const DEFAULT_DATA: GraficoBarrasAgrupadoDatum[] = [
  { group: 'Descendente', values: { competencias: 79, objetivos: 82 } },
  { group: 'Autoevaluación', values: { competencias: 81, objetivos: 83 } },
  { group: 'Pares', values: { competencias: 78, objetivos: 81 } },
  { group: 'Ascendente', values: { competencias: 78, objetivos: 81 } },
];

export interface DireccionesEvaluacionSectionProps {
  title?: string;
  subtitle?: string;
  series?: GraficoBarrasAgrupadoSerie[];
  data?: GraficoBarrasAgrupadoDatum[];
}

/**
 * Sección "Direcciones de Evaluación" — comparación de Competencias vs. Objetivos
 * según la dirección de evaluación (descendente, autoevaluación, pares, ascendente).
 * Fuente: Figma nodo 921:8390 (Vista Empresa) / 869:9869 (Vista Área-Gerencia).
 */
export function DireccionesEvaluacionSection({
  title = 'Direcciones de Evaluación',
  subtitle = 'Comparación por Ámbitos de Evaluación',
  series = DEFAULT_SERIES,
  data = DEFAULT_DATA,
}: DireccionesEvaluacionSectionProps) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <p className={styles.title}>{title}</p>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <button type="button" className={styles.downloadButton} aria-label="Descargar">
          <IconDownload />
        </button>
      </div>

      <GraficoBarrasAgrupado series={series} data={data} domain={[50, 100]} height={180} />
    </section>
  );
}
