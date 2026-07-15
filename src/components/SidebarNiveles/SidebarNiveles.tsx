import styles from './SidebarNiveles.module.css';

export interface SidebarNivelesItem {
  label: string;
  active?: boolean;
}

export interface SidebarNivelesProps {
  /** Ítems del grupo "Niveles" */
  niveles: SidebarNivelesItem[];
  /** Ítems del grupo "Áreas / Gerencias" */
  areas: SidebarNivelesItem[];
  onSelectNivel?: (label: string) => void;
  onSelectArea?: (label: string) => void;
  className?: string;
}

/**
 * SidebarNiveles — navegación lateral de niveles y áreas/gerencias.
 * Fuente: Figma nodo 664:1253 ("Sidebar").
 */
export function SidebarNiveles({
  niveles,
  areas,
  onSelectNivel,
  onSelectArea,
  className,
}: SidebarNivelesProps) {
  return (
    <nav className={[styles.root, className].filter(Boolean).join(' ')} aria-label="Niveles y áreas">
      <div className={styles.group}>
        <p className={styles.groupTitle}>Niveles</p>
        {niveles.map((item) => (
          <button
            key={item.label}
            type="button"
            className={[styles.item, item.active ? styles.itemActive : ''].filter(Boolean).join(' ')}
            onClick={() => onSelectNivel?.(item.label)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className={styles.group}>
        <p className={styles.groupTitle}>Áreas / Gerencias</p>
        {areas.map((item) => (
          <button
            key={item.label}
            type="button"
            className={[styles.item, item.active ? styles.itemActive : ''].filter(Boolean).join(' ')}
            onClick={() => onSelectArea?.(item.label)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
