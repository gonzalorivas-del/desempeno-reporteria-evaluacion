import { useState } from 'react';
import styles from './CompetenciasAccordion.module.css';

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

export interface CompetenciaDireccionValores {
  descendente: number;
  autoevaluacion: number;
  pares: number;
}

export interface CompetenciaItem {
  key: string;
  label: string;
  /** Valor logrado, 0-100 */
  logrado: number;
  /** Valor esperado, 0-100 */
  esperado: number;
  direcciones: CompetenciaDireccionValores;
}

export interface CompetenciasAccordionProps {
  competencias: CompetenciaItem[];
}

function ProgressBar({ valor, esperado, small }: { valor: number; esperado: number; small?: boolean }) {
  const positivo = valor >= esperado;
  return (
    <div className={small ? styles.trackSmall : styles.track}>
      <div
        className={styles.fill}
        style={{
          width: `${Math.max(0, Math.min(100, valor))}%`,
          backgroundColor: positivo ? '#ACCA54' : '#5780AD',
        }}
      />
      <div className={styles.tick} style={{ left: `${Math.max(0, Math.min(100, esperado))}%` }} />
    </div>
  );
}

function DeltaText({ logrado, esperado }: { logrado: number; esperado: number }) {
  const delta = logrado - esperado;
  const positivo = delta >= 0;
  return (
    <span className={styles.deltaText} style={{ color: positivo ? '#6C7E01' : '#666666' }}>
      {logrado} / {esperado} ({positivo ? `+${delta}` : delta})
    </span>
  );
}

/**
 * Listado acordeón de competencias evaluadas — Vista Colaborador, tab
 * Competencias. Cada competencia muestra su barra logrado/esperado; al
 * expandirla se ven las cards por dirección de evaluación, cada una con su
 * propia barra (mismo esperado de referencia).
 * Fuente: Figma nodo 869:10853 ("Panel-Accordion") — solo un acordeón
 * abierto a la vez, igual que la tab Dimensión.
 */
export function CompetenciasAccordion({ competencias }: CompetenciasAccordionProps) {
  const [expandedKey, setExpandedKey] = useState<string | null>(competencias[0]?.key ?? null);

  return (
    <div className={styles.panel}>
      <div className={styles.files}>
        {competencias.map((competencia, i) => {
          const isExpanded = expandedKey === competencia.key;
          const isLast = i === competencias.length - 1;
          return (
            <div
              key={competencia.key}
              className={[styles.group, !isLast ? styles.groupDivider : ''].filter(Boolean).join(' ')}
            >
              <button
                type="button"
                className={styles.header}
                aria-expanded={isExpanded}
                onClick={() => setExpandedKey(isExpanded ? null : competencia.key)}
              >
                <span className={styles.chevron}>{isExpanded ? <IconChevronUp /> : <IconChevronDown />}</span>
                <span className={styles.label}>{competencia.label}</span>
                <span className={styles.progArea}>
                  <ProgressBar valor={competencia.logrado} esperado={competencia.esperado} />
                  <DeltaText logrado={competencia.logrado} esperado={competencia.esperado} />
                </span>
              </button>

              {isExpanded && (
                <div className={styles.body}>
                  <div className={styles.direccionCard}>
                    <p className={styles.direccionLabel}>Descendente (Jefe)</p>
                    <p className={styles.direccionValor}>{competencia.direcciones.descendente}</p>
                    <ProgressBar valor={competencia.direcciones.descendente} esperado={competencia.esperado} small />
                  </div>
                  <div className={styles.direccionCard}>
                    <p className={styles.direccionLabel}>Autoevaluación</p>
                    <p className={styles.direccionValor}>{competencia.direcciones.autoevaluacion}</p>
                    <ProgressBar valor={competencia.direcciones.autoevaluacion} esperado={competencia.esperado} small />
                  </div>
                  <div className={styles.direccionCard}>
                    <p className={styles.direccionLabel}>Pares</p>
                    <p className={styles.direccionValor}>{competencia.direcciones.pares}</p>
                    <ProgressBar valor={competencia.direcciones.pares} esperado={competencia.esperado} small />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
