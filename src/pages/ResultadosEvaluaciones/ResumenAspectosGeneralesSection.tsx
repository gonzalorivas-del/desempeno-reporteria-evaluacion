import { GraficoLinea } from '../../components/GraficoLinea';
import type { GraficoLineaCategoria } from '../../components/GraficoLinea';
import styles from './ResumenAspectosGeneralesSection.module.css';

export interface ResumenAspectosGeneralesSectionProps {
  proceso: string;
  fechaEvaluacion: string;
  dimensiones: GraficoLineaCategoria[];
  esperado: Record<string, number>;
  minimo: Record<string, number>;
  obtenido: Record<string, number>;
  autoevaluacion: Record<string, number>;
}

const DOMAIN: [number, number] = [3.5, 7];
const TICKS = [7, 6.5, 6, 5.5, 5, 4.5, 4, 3.5];

/**
 * Resumen Aspectos Generales — tab "Dimensión" de Vista Colaborador. Compara
 * 4 series (Esperado / Mínimo / Obtenido / Autoevaluación) a través de las
 * dimensiones evaluadas.
 * Fuente: Figma nodo 1123:9 ("Contenido-grafico"). Requerimiento: ticket
 * RDV-2528 (Jira).
 */
export function ResumenAspectosGeneralesSection({
  proceso,
  fechaEvaluacion,
  dimensiones,
  esperado,
  minimo,
  obtenido,
  autoevaluacion,
}: ResumenAspectosGeneralesSectionProps) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <p className={styles.title}>Resumen Aspectos Generales</p>
        <p className={styles.subtitle}>Proceso {proceso} · Fecha evaluación: {fechaEvaluacion}</p>
      </div>

      <GraficoLinea
        categorias={dimensiones}
        series={[
          { key: 'esperado', label: 'Esperado', color: '#1E5591' },
          { key: 'minimo', label: 'Mínimo', color: '#0069FF' },
          { key: 'obtenido', label: 'Obtenido', color: '#FFB800' },
          { key: 'autoevaluacion', label: 'Autoevaluación', color: '#E28888' },
        ]}
        values={{ esperado, minimo, obtenido, autoevaluacion }}
        domain={DOMAIN}
        ticks={TICKS}
      />
    </section>
  );
}
