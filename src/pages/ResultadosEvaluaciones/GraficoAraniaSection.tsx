import { useState } from 'react';
import { GraficoArania } from '../../components/GraficoArania';
import type { GraficoAraniaAxis } from '../../components/GraficoArania';
import styles from './GraficoAraniaSection.module.css';

export interface GraficoAraniaSectionProps {
  axes: GraficoAraniaAxis[];
  logrado: Record<string, number>;
  esperado: Record<string, number>;
  /** Ej. "Perfil de Competencias del Equipo" vs "... del Colaborador". Default: Equipo. */
  subtitle?: string;
  /** Chips de competencias a mostrar bajo la leyenda (ej. brechas principales). Opcional. */
  chips?: string[];
}

const TOGGLES = [
  { key: 'competencias', label: 'Competencias' },
  { key: 'objetivos', label: 'Objetivos' },
];

/**
 * Sección "Gráfico de Araña — Equipo" de Vista Equipo — perfil de competencias
 * del equipo (Valor Logrado vs. Valor Esperado). El toggle Competencias/Objetivos
 * es solo presentacional: los Objetivos ya tienen su propio panel de barras
 * (ObjetivosEquipoSection) junto a esta tarjeta, así que no hay un segundo
 * dataset de radar que mostrar.
 * Fuente: Figma nodo 869:11810 ("Gráfico de Araña").
 */
export function GraficoAraniaSection({
  axes,
  logrado,
  esperado,
  subtitle = 'Perfil de Competencias del Equipo',
  chips,
}: GraficoAraniaSectionProps) {
  const [active, setActive] = useState('competencias');

  return (
    <section className={styles.card}>
      <p className={styles.title}>Gráfico de Araña — Equipo</p>
      <p className={styles.subtitle}>{subtitle}</p>
      <p className={styles.subsubtitle}>Top 5 Brechas de Competencias</p>

      <div className={styles.toggles} role="tablist" aria-label="Vista del gráfico">
        {TOGGLES.map((toggle) => (
          <button
            key={toggle.key}
            type="button"
            role="tab"
            aria-selected={active === toggle.key}
            className={[styles.toggleChip, active === toggle.key ? styles.toggleChipActive : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => setActive(toggle.key)}
          >
            {toggle.label}
          </button>
        ))}
      </div>

      <GraficoArania
        axes={axes}
        series={[
          { key: 'logrado', label: 'Valor Logrado', color: '#0069FF', variant: 'filled' },
          { key: 'esperado', label: 'Valor Esperado', color: '#B6CEE7', variant: 'outline' },
        ]}
        values={{ logrado, esperado }}
      />

      {chips && chips.length > 0 && (
        <div className={styles.chips}>
          {chips.map((chip) => (
            <span className={styles.chip} key={chip}>{chip}</span>
          ))}
        </div>
      )}
    </section>
  );
}
