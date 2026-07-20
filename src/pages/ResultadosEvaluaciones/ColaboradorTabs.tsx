import styles from './ColaboradorTabs.module.css';

export const COLABORADOR_TABS = ['Resumen', 'Dimensión', 'Competencias', 'Objetivos', 'Cualitativas / Feedback'] as const;
export type ColaboradorTab = (typeof COLABORADOR_TABS)[number];

export interface ColaboradorTabsProps {
  active: ColaboradorTab;
  onChange: (tab: ColaboradorTab) => void;
}

/**
 * Barra de tabs de Vista Colaborador. "Resumen" y "Dimensión" tienen contenido
 * desarrollado en este prototipo; el resto cambia el estado activo pero
 * muestra un aviso de contenido no disponible.
 * Fuente: Figma nodo 869:12692 ("Tabs") y 1116:6284 (con "Dimensión" activa).
 */
export function ColaboradorTabs({ active, onChange }: ColaboradorTabsProps) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Secciones de Vista Colaborador">
      {COLABORADOR_TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={active === tab}
          className={[styles.tab, active === tab ? styles.tabActive : ''].filter(Boolean).join(' ')}
          onClick={() => onChange(tab)}
        >
          <span>{tab}</span>
          <span className={[styles.indicator, active === tab ? styles.indicatorActive : ''].filter(Boolean).join(' ')} />
        </button>
      ))}
    </div>
  );
}
