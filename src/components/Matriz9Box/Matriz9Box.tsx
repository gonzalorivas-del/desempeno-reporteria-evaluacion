import { useState } from 'react';
import { Filtro } from '../Filtro';
import { InputField } from '../InputField';
import avatarWoman from '../../assets/avatars/avatar-woman-1.png';
import avatarMan from '../../assets/avatars/avatar-man-1.png';
import styles from './Matriz9Box.module.css';

function IconSearch() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 20L15.8 15.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconUserCircle() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 19c1.2-2.4 3.4-3.7 6-3.7s4.8 1.3 6 3.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9.5L12 15.5L18 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const AVATAR_SRC = { man: avatarMan, woman: avatarWoman } as const;

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface Matriz9BoxColaborador {
  name: string;
  role: string;
  avatar: 'man' | 'woman';
}

/** Nivel de la celda: determina el color de borde. `neutro` = sin categorizar aún. */
export type Matriz9BoxTier = 'neutro' | 'critico' | 'medio' | 'optimo';

export interface Matriz9BoxCell {
  label: string;
  tier: Matriz9BoxTier;
  colaboradores?: Matriz9BoxColaborador[];
}

export interface Matriz9BoxProps {
  /** Grid 3×3 de celdas. Fila 0 = "Alto", fila 2 = "Bajo" (eje Y — Competencias) */
  rows?: Matriz9BoxCell[][];
  totalColaboradores?: number;
  onVerTodos?: () => void;
  onVerParticipantes?: (cell: Matriz9BoxCell) => void;
  /** Callback al hacer clic en el nombre de un colaborador dentro de una celda. */
  onSelectColaborador?: (persona: Matriz9BoxColaborador, cell: Matriz9BoxCell) => void;
  className?: string;
}

const ROW_LABELS = ['Alto', 'Esperado', 'Bajo'];
const COL_LABELS = ['Bajo', 'Esperado', 'Alto'];
/** Color de franja por fila/columna: Alto → óptimo (verde), Esperado → medio (naranjo), Bajo → crítico (rojo) */
const ROW_TIER: Matriz9BoxTier[] = ['optimo', 'medio', 'critico'];
const COL_TIER: Matriz9BoxTier[] = ['critico', 'medio', 'optimo'];

const DEFAULT_ROWS: Matriz9BoxCell[][] = [
  [
    { label: 'Necesita Entrenamiento', tier: 'neutro' },
    { label: 'Nuevas oportunidades', tier: 'optimo' },
    {
      label: 'Mejor talento',
      tier: 'optimo',
      colaboradores: [
        { name: 'Jennifer Valenzuela Lizama', role: 'QA', avatar: 'woman' },
        { name: 'Jonathan Barra Barrientos', role: 'Desarrollador', avatar: 'man' },
      ],
    },
  ],
  [
    { label: 'Nuevo Rol', tier: 'medio' },
    { label: 'Miembro clave', tier: 'medio' },
    { label: 'Líder emergente', tier: 'optimo' },
  ],
  [
    { label: 'Rendimiento limitado', tier: 'critico' },
    { label: 'Rendimiento sólido', tier: 'medio' },
    { label: 'Sobresaliente', tier: 'optimo' },
  ],
];

/**
 * Matriz9Box — matriz de talento 9-Box (Potencial × Resultado de Competencias).
 * Fuente: Figma nodo 997:6872.
 */
export function Matriz9Box({
  rows = DEFAULT_ROWS,
  totalColaboradores = 300,
  onVerTodos,
  onVerParticipantes,
  onSelectColaborador,
  className,
}: Matriz9BoxProps) {
  const [search, setSearch] = useState('');

  return (
    <section className={[styles.card, className].filter(Boolean).join(' ')}>
      <div className={styles.headerRow}>
        <div className={styles.titleFilters}>
          <h3 className={styles.title}>Matriz 9-Box</h3>
          <Filtro />
        </div>
        <InputField
          label="Buscar un colaborador"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<IconSearch />}
          className={styles.searchInput}
        />
      </div>

      <button type="button" className={styles.verTodosButton} onClick={onVerTodos}>
        Ver todos los colaboradores ({totalColaboradores})
      </button>

      <div className={styles.body}>
        <div className={styles.yAxis}>
          <span className={styles.yAxisArrow} aria-hidden="true">▲</span>
          <span className={styles.yAxisLabel}>Resultado de Competencias</span>
        </div>

        <div className={styles.grid}>
          {rows.map((row, rowIndex) => (
            <div className={styles.gridRow} key={ROW_LABELS[rowIndex]}>
              <div
                className={styles.strip}
                style={{ backgroundColor: `var(--tier-${ROW_TIER[rowIndex]})` }}
              >
                <span className={styles.stripLabel}>{ROW_LABELS[rowIndex]}</span>
              </div>

              {row.map((cell, colIndex) => (
                <div
                  key={cell.label}
                  className={[
                    styles.cell,
                    rowIndex === 0 && colIndex === 2 ? styles.cellRoundedTR : '',
                    rowIndex === rows.length - 1 && colIndex === 2 ? styles.cellRoundedBR : '',
                  ].filter(Boolean).join(' ')}
                  style={{ borderColor: `var(--tier-${cell.tier})` }}
                >
                  <div className={styles.cellHeader}>
                    <span className={styles.cellLabel}>{cell.label}</span>
                    {cell.colaboradores && (
                      <span className={styles.cellCount}>
                        <IconUserCircle />
                        ({cell.colaboradores.length})
                      </span>
                    )}
                  </div>

                  {cell.colaboradores && (
                    <>
                      <div className={styles.colaboradoresList}>
                        {cell.colaboradores.map((persona) => (
                          <div className={styles.colaborador} key={persona.name}>
                            <img className={styles.avatar} src={AVATAR_SRC[persona.avatar]} alt="" />
                            <div className={styles.colaboradorInfo}>
                              <button
                                type="button"
                                className={styles.colaboradorName}
                                onClick={() => onSelectColaborador?.(persona, cell)}
                              >
                                {persona.name}
                              </button>
                              <span className={styles.colaboradorRole}>{persona.role}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        className={styles.verParticipantesButton}
                        onClick={() => onVerParticipantes?.(cell)}
                      >
                        <IconUserCircle />
                        Ver todos los participantes
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}

          <div className={styles.gridRow}>
            <div className={styles.spacer} aria-hidden="true" />
            {COL_LABELS.map((label, colIndex) => (
              <div
                key={label}
                className={styles.colLabel}
                style={{ backgroundColor: `var(--tier-${COL_TIER[colIndex]})` }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <button type="button" className={styles.footerToggle}>
        Resultados de Objetivos <IconChevronDown />
      </button>
    </section>
  );
}
