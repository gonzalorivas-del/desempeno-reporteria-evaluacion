import { GraficoLinea } from '../../components/GraficoLinea';
import type { GraficoLineaCategoria } from '../../components/GraficoLinea';
import styles from './ComparativoObtenidoAutoevalSection.module.css';

export interface ComparativoObtenidoAutoevalSectionProps {
  proceso: string;
  fechaEvaluacion: string;
  categorias: GraficoLineaCategoria[];
  obtenido: Record<string, number>;
  autoevaluacion: Record<string, number>;
  /** Competencias cuyo valor "Obtenido" proviene de pocas respuestas — se marcan con un punto hueco. */
  obtenidoTestimonial?: Record<string, boolean>;
}

const DOMAIN: [number, number] = [3.5, 7];
const TICKS = [7, 6.5, 6, 5.5, 5, 4.5, 4, 3.5];

/**
 * Comparativo Obtenido vs. Autoevaluación — valor logrado por el colaborador en
 * cada competencia, contra su propia autoevaluación. Se ubica debajo del
 * gráfico de Direcciones de Evaluación, por criterio de aceptación.
 * Fuente: Figma nodo 1128:9. Requerimiento: ticket RDV-2529 (Jira).
 */
export function ComparativoObtenidoAutoevalSection({
  proceso,
  fechaEvaluacion,
  categorias,
  obtenido,
  autoevaluacion,
  obtenidoTestimonial,
}: ComparativoObtenidoAutoevalSectionProps) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <p className={styles.title}>Comparativo Obtenido vs. Autoevaluación</p>
        <p className={styles.subtitle}>Proceso {proceso} · Fecha evaluación: {fechaEvaluacion}</p>
      </div>

      <GraficoLinea
        categorias={categorias}
        series={[
          { key: 'obtenido', label: 'Obtenido', color: '#FFB800' },
          { key: 'autoevaluacion', label: 'Autoevaluación', color: '#E24C4C' },
        ]}
        values={{ obtenido, autoevaluacion }}
        testimonial={obtenidoTestimonial ? { obtenido: obtenidoTestimonial } : undefined}
        domain={DOMAIN}
        ticks={TICKS}
        twoRowLabels
      />
    </section>
  );
}
