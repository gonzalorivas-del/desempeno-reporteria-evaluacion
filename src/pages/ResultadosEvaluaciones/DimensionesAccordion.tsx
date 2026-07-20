import { useState } from 'react';
import styles from './DimensionesAccordion.module.css';

function IconChevronDown() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9.5L12 15.5L18 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconChevronUp() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 14.5L12 8.5L18 14.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export interface DimensionDireccionValores {
  descendente: number;
  autoevaluacion: number;
  pares: number;
}

export interface DimensionCompetencia {
  key: string;
  label: string;
  valor: number;
}

export interface DimensionItem {
  key: string;
  label: string;
  /** Resultado ponderado de la dimensión (0-100). */
  valor: number;
  direcciones: DimensionDireccionValores;
  competencias: DimensionCompetencia[];
}

export interface DimensionesAccordionProps {
  dimensiones: DimensionItem[];
}

/**
 * Listado acordeón de dimensiones — Vista Colaborador, tab Dimensión. Cada
 * dimensión muestra su resultado ponderado; al expandirla se ven las cards
 * por dirección de evaluación y el detalle por competencia asociada.
 * Fuente: Figma nodo 1116:6287 ("Panel-Accordion"). Requerimiento: ticket
 * RDV-2528 (Jira) — solo un acordeón abierto a la vez.
 */
export function DimensionesAccordion({ dimensiones }: DimensionesAccordionProps) {
  const [expandedKey, setExpandedKey] = useState<string | null>(dimensiones[0]?.key ?? null);

  return (
    <div className={styles.panel}>
      <div className={styles.files}>
        {dimensiones.map((dimension, i) => {
          const isExpanded = expandedKey === dimension.key;
          const isLast = i === dimensiones.length - 1;
          return (
            <div
              key={dimension.key}
              className={[styles.group, !isLast ? styles.groupDivider : ''].filter(Boolean).join(' ')}
            >
              <button
                type="button"
                className={styles.header}
                aria-expanded={isExpanded}
                onClick={() => setExpandedKey(isExpanded ? null : dimension.key)}
              >
                <span className={styles.chevron}>{isExpanded ? <IconChevronUp /> : <IconChevronDown />}</span>
                <span className={styles.label}>{dimension.label}</span>
                <span className={styles.valor}>{dimension.valor}</span>
              </button>

              {isExpanded && (
                <div className={styles.body}>
                  <div className={styles.direccionesRow}>
                    <div className={styles.direccionCard}>
                      <p className={styles.direccionLabel}>Descendente (Jefe)</p>
                      <p className={styles.direccionValor}>{dimension.direcciones.descendente}</p>
                    </div>
                    <div className={styles.direccionCard}>
                      <p className={styles.direccionLabel}>Autoevaluación</p>
                      <p className={styles.direccionValor}>{dimension.direcciones.autoevaluacion}</p>
                    </div>
                    <div className={styles.direccionCard}>
                      <p className={styles.direccionLabel}>Pares</p>
                      <p className={styles.direccionValor}>{dimension.direcciones.pares}</p>
                    </div>
                  </div>

                  {dimension.competencias.map((competencia) => (
                    <div key={competencia.key} className={styles.competenciaRow}>
                      <span className={styles.competenciaLabel}>{competencia.label}</span>
                      <span className={styles.competenciaValor}>{competencia.valor}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
