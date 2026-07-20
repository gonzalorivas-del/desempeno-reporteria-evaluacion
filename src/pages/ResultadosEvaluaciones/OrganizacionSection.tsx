import { useEffect, useState } from 'react';
import { DataTable } from '../../components/DataTable';
import type { DataTableColumn, DataTableRow } from '../../components/DataTable';
import type { BadgeVariant } from '../../components/Badge';
import styles from './OrganizacionSection.module.css';

const COLUMNS: DataTableColumn[] = [
  { key: 'jefatura', title: 'Jefatura / Equipo', type: 'link', grow: true, actionLabel: 'Ver detalles' },
  { key: 'responsable',   title: 'Responsable',            type: 'text', grow: true },
  { key: 'colaboradores', title: 'N° Colaboradores',        type: 'text'     },
  { key: 'promedio',      title: 'Promedio calificación',   type: 'progress', showValue: true },
  { key: 'estado',        title: 'Estado avance',           type: 'badge',    badgeVariant: 'outline-alert' },
];

export interface OrganizacionNode {
  jefatura: string;
  responsable: string;
  colaboradores: number;
  promedio: number;
  estado: string;
  /** Variante del badge de "Estado avance" para este nodo. Default: 'outline-alert'
   *  (fracción "X/Y completados"). Los nodos hoja (sin children) suelen usar
   *  'solid-success' para "Completado". */
  estadoVariant?: BadgeVariant;
  /** Sub-jefaturas/equipos bajo este nodo. Si existen, el registro es clickable
   *  y hace drill-down; si no, es el último nivel (hoja). */
  children?: OrganizacionNode[];
}

export interface OrganizacionSectionProps {
  rows: OrganizacionNode[];
  /** Callback al hacer clic en la pill "Ver detalles" de un registro — navega a Vista Equipo. */
  onSelectEquipo?: (node: OrganizacionNode) => void;
  /** Notifica cada vez que cambia el nivel de drill-down (incluyendo el mount inicial, con path=[]) — permite que el sidebar refleje el mismo nivel que esta tabla. */
  onPathChange?: (path: OrganizacionNode[]) => void;
}

/**
 * Sección "Organización" de la vista Área/Gerencia — tabla de jefaturas/equipos
 * bajo el área, con dotación, promedio de calificación y estado de avance.
 * Soporta drill-down: al hacer clic en un registro con sub-niveles, la tabla
 * navega a ese nivel y el título "Organización" se transforma en un breadcrumb
 * navegable (Organización / Nivel 1 / Nivel 2 / ...).
 * Fuente: Figma nodo 1038:8435 ("Table").
 */
export function OrganizacionSection({ rows, onSelectEquipo, onPathChange }: OrganizacionSectionProps) {
  const [path, setPath] = useState<OrganizacionNode[]>([]);

  useEffect(() => {
    onPathChange?.(path);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  const currentLevel = path.length === 0 ? rows : path[path.length - 1].children ?? [];

  const tableRows: DataTableRow[] = currentLevel.map((node, i) => ({
    id: i,
    jefatura: node.jefatura,
    responsable: node.responsable,
    colaboradores: node.colaboradores,
    promedio: node.promedio,
    estado: node.estado,
    estadoVariant: node.estadoVariant ?? 'outline-alert',
  }));

  function handleLinkClick(rowId: string | number) {
    const node = currentLevel[Number(rowId)];
    if (node?.children && node.children.length > 0) {
      setPath((prev) => [...prev, node]);
    }
  }

  function handleActionClick(rowId: string | number) {
    const node = currentLevel[Number(rowId)];
    if (node) onSelectEquipo?.(node);
  }

  const segments = ['Organización', ...path.map((n) => n.jefatura)];

  const isRootOnly = segments.length === 1;

  const title = (
    <div className={styles.breadcrumb}>
      {segments.map((label, i) => {
        const isLast = i === segments.length - 1;
        return (
          <span key={i} className={styles.breadcrumbSegment}>
            {i > 0 && <span className={styles.breadcrumbSeparator}>/</span>}
            {isLast && !isRootOnly ? (
              // Nivel actual (solo cuando ya se hizo drill-down): en negrita, no clicable.
              <span className={styles.breadcrumbCurrent}>{label}</span>
            ) : isLast && isRootOnly ? (
              // "Organización" sola (nivel raíz): mismo estilo que antes del breadcrumb.
              <span className={styles.breadcrumbRoot}>{label}</span>
            ) : (
              <button
                type="button"
                className={styles.breadcrumbLink}
                onClick={() => setPath((prev) => prev.slice(0, i))}
              >
                {label}
              </button>
            )}
          </span>
        );
      })}
    </div>
  );

  return (
    <DataTable
      columns={COLUMNS}
      rows={tableRows}
      title={title}
      showFilterTrigger={false}
      hideFooter
      searchPlaceholder="Buscar contenido"
      onLinkClick={handleLinkClick}
      onActionClick={handleActionClick}
    />
  );
}
