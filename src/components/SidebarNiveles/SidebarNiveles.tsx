import styles from './SidebarNiveles.module.css';

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

export interface SidebarNivelesItem {
  label: string;
  active?: boolean;
}

export interface SidebarEquipoItem {
  label: string;
  active?: boolean;
  /** true cuando este es el equipo del colaborador seleccionado — anida `colaboradorActivo` debajo, aunque `active` sea false (el equipo vuelve a su estado default una vez hay un colaborador seleccionado). */
  colaboradorAnidado?: boolean;
}

export interface SidebarAreaItem {
  label: string;
  active?: boolean;
  /** true mientras el área esté desplegada en modo acordeón (aunque `active` — el resaltado de color — ya haya pasado a un equipo o colaborador más profundo). Controla la orientación del chevron. */
  expanded?: boolean;
  /** Equipos visibles bajo esta área — solo el área activa lista todos los suyos (acordeón). */
  equipos: SidebarEquipoItem[];
}

export interface SidebarNivelesProps {
  /** Ítems del grupo "Niveles" */
  niveles: SidebarNivelesItem[];
  /** Ítems del grupo "Áreas / Gerencias", cada uno con sus equipos anidados */
  areas: SidebarAreaItem[];
  /** Nombre del colaborador seleccionado — se muestra como 3er nivel bajo el equipo activo */
  colaboradorActivo?: string | null;
  onSelectNivel?: (label: string) => void;
  onSelectArea?: (label: string) => void;
  onSelectEquipo?: (areaLabel: string, equipoLabel: string) => void;
  className?: string;
}

/**
 * SidebarNiveles — navegación lateral de niveles y áreas/gerencias.
 * Fuente: Figma nodo 664:1253 ("Sidebar") y 1141:6827 (ejemplo con área activa).
 */
export function SidebarNiveles({
  niveles,
  areas,
  colaboradorActivo,
  onSelectNivel,
  onSelectArea,
  onSelectEquipo,
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
        {areas.map((area) => (
          <div key={area.label} className={styles.areaBlock}>
            <button
              type="button"
              className={[styles.areaItem, area.active ? styles.itemActive : ''].filter(Boolean).join(' ')}
              onClick={() => onSelectArea?.(area.label)}
              aria-expanded={!!area.expanded}
            >
              <span className={styles.areaLabel}>{area.label}</span>
              <span className={styles.areaChevron}>
                {area.expanded ? <IconChevronUp /> : <IconChevronDown />}
              </span>
            </button>
            {area.equipos.map((equipo) => (
              <div key={equipo.label} className={styles.equipoBlock}>
                <button
                  type="button"
                  title={equipo.label}
                  className={[styles.equipoItem, equipo.active ? styles.itemActive : ''].filter(Boolean).join(' ')}
                  onClick={() => onSelectEquipo?.(area.label, equipo.label)}
                >
                  <span className={styles.dot} aria-hidden="true" />
                  <span className={styles.equipoLabelText}>{equipo.label}</span>
                </button>
                {equipo.colaboradorAnidado && colaboradorActivo ? (
                  <p className={styles.colaboradorItem}>
                    <span className={styles.dot} aria-hidden="true" />
                    {colaboradorActivo}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
}
