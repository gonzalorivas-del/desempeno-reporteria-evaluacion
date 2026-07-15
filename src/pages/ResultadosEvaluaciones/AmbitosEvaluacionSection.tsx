import { useState } from 'react';
import { BarraAmbito } from '../../components/BarraAmbito';
import styles from './AmbitosEvaluacionSection.module.css';

function IconDownload() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v11M7.5 10.5L12 15l4.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const FILTERS = [
  { key: 'calificacion', label: 'Calificación final' },
  { key: 'competencias', label: 'Competencias' },
  { key: 'objetivos', label: 'Objetivos' },
  { key: 'otros', label: 'Otros' },
];

const GERENCIAS = [
  { label: 'Comercial', logrado: 85, esperado: 90, delta: '-5' },
  { label: 'Tecnología', logrado: 70, esperado: 70, delta: '-20' },
  { label: 'RRHH', logrado: 65, esperado: 65, delta: '-25' },
  { label: 'Finanzas', logrado: 80, esperado: 90, delta: '-10' },
  { label: 'Operaciones', logrado: 80, esperado: 90, delta: '-10' },
];

export interface AmbitosEvaluacionSectionProps {
  /** Callback al hacer clic en una fila de gerencia — navega al detalle del área. */
  onSelectGerencia?: (label: string) => void;
}

/**
 * Sección "Ámbitos de Evaluación" — comparativa logrado/esperado por gerencia.
 * Fuente: Figma nodo 664:1357.
 */
export function AmbitosEvaluacionSection({ onSelectGerencia }: AmbitosEvaluacionSectionProps) {
  const [activeFilter, setActiveFilter] = useState('calificacion');

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <p className={styles.title}>Ámbitos de Evaluación</p>
          <p className={styles.subtitle}>
            Ámbitos de Evaluación por gerencia - Haz click en una fila para ver más detalles
          </p>
        </div>
        <button type="button" className={styles.downloadButton} aria-label="Descargar">
          <IconDownload />
        </button>
      </div>

      <div className={styles.filters} role="tablist" aria-label="Ámbito a comparar">
        {FILTERS.map((filter) => (
          <button
            key={filter.key}
            type="button"
            role="tab"
            aria-selected={activeFilter === filter.key}
            className={[styles.filterChip, activeFilter === filter.key ? styles.filterChipActive : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => setActiveFilter(filter.key)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {GERENCIAS.map((gerencia) => (
          <BarraAmbito
            key={gerencia.label}
            {...gerencia}
            onClick={() => onSelectGerencia?.(gerencia.label)}
          />
        ))}
      </div>

      <p className={styles.legend}>
        <span className={styles.legendTick} aria-hidden="true" />
        línea = valor esperado por ámbito
      </p>
    </section>
  );
}
