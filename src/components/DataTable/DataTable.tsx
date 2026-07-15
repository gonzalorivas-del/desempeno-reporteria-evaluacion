import { useState, useRef, useEffect, cloneElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import styles from './DataTable.module.css';
import { FilterApp } from '../FilterApp';
import type { FilterField } from '../FilterApp';
import { Badge } from '../Badge';
import type { BadgeVariant } from '../Badge';

// ─── Icons (inline SVG, sin dependencias externas) ───────────────────────────

function IconSortUp({ active }: { active?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M7 11V3M3.5 6.5L7 3l3.5 3.5"
        stroke={active ? '#1E5591' : '#B6CEE7'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconCheckCircle() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconMore() {
  return (
    <svg width="20" height="5" viewBox="0 0 20 5" fill="currentColor" aria-hidden="true">
      <circle cx="2.5" cy="2.5" r="2" />
      <circle cx="10" cy="2.5" r="2" />
      <circle cx="17.5" cy="2.5" r="2" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg width="8" height="13" viewBox="0 0 8 13" fill="none" aria-hidden="true">
      <path d="M1 1l6 5.5L1 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg width="8" height="13" viewBox="0 0 8 13" fill="none" aria-hidden="true">
      <path d="M7 1L1 6.5L7 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type DataTableColumnType =
  | 'text'
  | 'avatar-text'
  | 'checkbox'
  | 'check-icon'
  | 'progress'
  | 'actions'
  | 'link'
  | 'metric'
  | 'badge';

export interface DataTableColumn {
  /** Identificador único de la columna */
  key: string;
  /** Texto del encabezado */
  title?: string;
  /** Tipo de renderizado de la celda */
  type?: DataTableColumnType;
  /** Muestra ícono de ordenamiento. Default: true para columnas de tipo text/avatar-text */
  sortable?: boolean;
  /** Solo para type='link': muestra el avatar de la fila (row.avatar) junto al texto */
  showAvatar?: boolean;
  /** Solo para type='progress': muestra el valor numérico junto a la barra */
  showValue?: boolean;
  /** Solo para type='badge': variante del Badge. Default: 'solid-primary' */
  badgeVariant?: BadgeVariant;
  /** Sin ancho fijo: reparte el espacio sobrante de la tabla junto con las demás
   *  columnas 'grow' (a partes iguales, vía table-layout: fixed). Default: false. */
  grow?: boolean;
  /** Solo para type='link': agrega una pill/CTA independiente a la derecha del texto
   *  (ej. "Ver detalles"). Tiene su propio manejador — no dispara onLinkClick. */
  actionLabel?: string;
  /** Variante del Badge de la pill de actionLabel. Default: 'outline-importante' */
  actionVariant?: BadgeVariant;
}

export interface DataTableRow {
  id: string | number;
  /** URL de avatar (para columnas tipo avatar-text) */
  avatar?: string;
  /** Valor de progreso 0-100 (para columnas tipo progress) */
  [key: string]: unknown;
}

export interface DataTableProps {
  /** Definición de columnas */
  columns: DataTableColumn[];
  /** Datos de filas */
  rows: DataTableRow[];
  /** Total de registros (para texto del paginador) */
  total?: number;
  /** Página actual (1-based) */
  currentPage?: number;
  /** Callback al cambiar página */
  onPageChange?: (page: number) => void;
  /** Callback al escribir en el buscador */
  onSearch?: (query: string) => void;
  /** Campos de filtro del panel FilterApp */
  filterFields?: FilterField[];
  /** Callback al hacer clic en un campo de filtro */
  onFilterFieldClick?: (key: string, field: FilterField) => void;
  /** Callback al hacer clic en un header ordenable */
  onSort?: (key: string) => void;
  /** Callback al hacer clic en el botón de acciones de una fila */
  onRowAction?: (rowId: string | number) => void;
  /** Callback al cambiar la selección de checkboxes */
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  /** Callback al hacer clic en una celda de tipo 'link' */
  onLinkClick?: (rowId: string | number, key: string) => void;
  /** Callback al hacer clic en la pill de col.actionLabel (independiente de onLinkClick) */
  onActionClick?: (rowId: string | number, key: string) => void;
  /** Muestra el trigger de FilterApp dentro del header de la tabla. Default: true.
   *  Poner en false cuando el filtro se renderiza fuera de la tabla (ej. panel lateral). */
  showFilterTrigger?: boolean;
  /** Placeholder del buscador. Default: 'Buscar' */
  searchPlaceholder?: string;
  /** Filas por página, para el paginador y el selector "Filas". Default: rows.length */
  rowsPerPage?: number;
  /** Opciones del selector "Filas". Default: [8, 16, 24] */
  rowsPerPageOptions?: number[];
  /** Callback al cambiar las filas por página */
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  /** Título en línea dentro del header (ej. "Organización" o un breadcrumb navegable),
   *  a la izquierda del buscador. Se muestra en lugar del trigger de FilterApp cuando
   *  showFilterTrigger=false. Acepta cualquier ReactNode, no solo texto plano. */
  title?: ReactNode;
  /** Oculta el paginador completo. Útil para tablas compactas sin necesidad de paginar. */
  hideFooter?: boolean;
  className?: string;
}

const DEFAULT_FILTER_FIELDS: FilterField[] = [
  { key: 'empresa',          label: 'Empresa'         },
  { key: 'centro-de-costo',  label: 'Centro de costo' },
  { key: 'por-tipo',         label: 'Por tipo'        },
];

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * DataTable (Type=Portal) — Tabla de datos del sistema Zafiro (Rex+).
 *
 * Soporta columnas tipo: checkbox, avatar-text, text, check-icon, progress, actions.
 * Incluye header con FilterApp (panel desplegable sobre la tabla) y búsqueda,
 * y paginador con contador de registros.
 */
const DEFAULT_ROWS_PER_PAGE_OPTIONS = [8, 16, 24];

// table-layout: fixed usa el ancho de las celdas del header para fijar el ancho
// de cada columna — sin esto, columnas sin ancho explícito se reparten el
// espacio sobrante en partes iguales, sea cual sea su contenido real.
const THEAD_WIDTH_CLASS: Partial<Record<DataTableColumnType, string>> = {
  'check-icon': styles.thIcon,
  progress: styles.thProgress,
  'avatar-text': styles.thAvatarText,
  text: styles.thText,
  metric: styles.thMetric,
  badge: styles.thBadge,
};

export function DataTable({
  columns,
  rows,
  total,
  currentPage = 1,
  onPageChange,
  onSearch,
  filterFields = DEFAULT_FILTER_FIELDS,
  onFilterFieldClick,
  onSort,
  onRowAction,
  onSelectionChange,
  onLinkClick,
  onActionClick,
  showFilterTrigger = true,
  searchPlaceholder = 'Buscar',
  rowsPerPage,
  rowsPerPageOptions = DEFAULT_ROWS_PER_PAGE_OPTIONS,
  onRowsPerPageChange,
  title,
  hideFooter = false,
  className,
}: DataTableProps) {
  const [searchValue, setSearchValue] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [filterOpen, setFilterOpen] = useState(false);

  const filterWrapperRef = useRef<HTMLDivElement>(null);

  // Cierra el panel al hacer clic fuera del área de filtro
  useEffect(() => {
    if (!filterOpen) return;
    function onPointerDown(e: PointerEvent) {
      if (filterWrapperRef.current && !filterWrapperRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [filterOpen]);

  // Total pages, basadas en rowsPerPage (o en rows.length si no se especifica)
  const totalRecords = total ?? rows.length;
  const pageSize = rowsPerPage ?? rows.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize || 1));

  // Lista de páginas a mostrar en el paginador, con elipsis para rangos largos.
  function getPageList(current: number, total: number): (number | '...')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages = new Set([1, 2, total, total - 1, current - 1, current, current + 1]);
    const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

    const result: (number | '...')[] = [];
    sorted.forEach((p, i) => {
      if (i > 0 && p - (sorted[i - 1] as number) > 1) result.push('...');
      result.push(p);
    });
    return result;
  }

  const pageList = getPageList(currentPage, totalPages);

  function handleSearch(value: string) {
    setSearchValue(value);
    onSearch?.(value);
  }

  function handleSort(key: string) {
    setSortKey(key);
    onSort?.(key);
  }

  function handleSelectAll(checked: boolean) {
    const next = checked ? new Set(rows.map((r) => r.id)) : new Set<string | number>();
    setSelectedIds(next);
    onSelectionChange?.([...next]);
  }

  function handleSelectRow(id: string | number, checked: boolean) {
    const next = new Set(selectedIds);
    if (checked) next.add(id); else next.delete(id);
    setSelectedIds(next);
    onSelectionChange?.([...next]);
  }

  const allSelected = rows.length > 0 && rows.every((r) => selectedIds.has(r.id));
  const someSelected = rows.some((r) => selectedIds.has(r.id)) && !allSelected;

  function renderCell(col: DataTableColumn, row: DataTableRow) {
    const value = row[col.key];

    switch (col.type) {
      case 'checkbox':
        return (
          <td key={col.key} className={`${styles.td} ${styles.tdCheckbox}`}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={selectedIds.has(row.id)}
              onChange={(e) => handleSelectRow(row.id, e.target.checked)}
              aria-label="Seleccionar fila"
            />
          </td>
        );

      case 'avatar-text':
        return (
          <td key={col.key} className={`${styles.td} ${styles.tdAvatarText}`}>
            <div className={styles.cellAvatarInner}>
              {row.avatar && (
                <img src={row.avatar as string} alt="" className={styles.avatar} />
              )}
              <span title={String(value ?? '')}>{String(value ?? '')}</span>
            </div>
          </td>
        );

      case 'check-icon':
        return (
          <td key={col.key} className={`${styles.td} ${styles.tdIcon}`}>
            {value !== false && (
              <span className={styles.checkIcon} aria-label="Completado">
                <IconCheckCircle />
              </span>
            )}
          </td>
        );

      case 'progress': {
        const pct = Math.min(100, Math.max(0, Number(value ?? 0)));
        return (
          <td key={col.key} className={`${styles.td} ${styles.tdProgress}`}>
            <div className={styles.progressCell}>
              <div className={styles.progressBar} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                <div className={styles.progressFill} style={{ width: `${pct}%` }} />
              </div>
              {col.showValue && <span className={styles.progressValue}>{pct}</span>}
            </div>
          </td>
        );
      }

      case 'actions':
        return (
          <td key={col.key} className={`${styles.td} ${styles.tdActions}`}>
            <button
              className={styles.moreBtn}
              type="button"
              aria-label="Más acciones"
              onClick={() => onRowAction?.(row.id)}
            >
              <IconMore />
            </button>
          </td>
        );

      case 'link':
        return (
          <td
            key={col.key}
            className={`${styles.td} ${styles.tdLink}${col.showAvatar ? ` ${styles.tdLinkAvatar}` : ''}`}
          >
            <div className={styles.linkCellRow}>
              <button
                type="button"
                className={styles.linkCell}
                onClick={() => onLinkClick?.(row.id, col.key)}
              >
                {col.showAvatar && row.avatar && (
                  <img src={row.avatar as string} alt="" className={styles.avatar} />
                )}
                <span title={String(value ?? '')}>{String(value ?? '')}</span>
              </button>
              {col.actionLabel && (
                <button
                  type="button"
                  className={styles.linkActionBtn}
                  onClick={() => onActionClick?.(row.id, col.key)}
                >
                  <Badge variant={col.actionVariant ?? 'outline-importante'} label={col.actionLabel} size="sm" />
                </button>
              )}
            </div>
          </td>
        );

      case 'metric':
        return (
          <td key={col.key} className={`${styles.td} ${styles.tdMetric}`}>
            {String(value ?? '')}
          </td>
        );

      case 'badge': {
        // Permite anular la variante por fila (ej. distintos estados en una misma
        // columna) vía row[`${key}Variant`]; si no existe, usa col.badgeVariant.
        const rowVariant = row[`${col.key}Variant`] as BadgeVariant | undefined;
        return (
          <td key={col.key} className={`${styles.td} ${styles.tdBadge}`}>
            <Badge variant={rowVariant ?? col.badgeVariant ?? 'solid-primary'} label={String(value ?? '')} size="md" />
          </td>
        );
      }

      default:
        return (
          <td key={col.key} className={`${styles.td} ${styles.tdText}`} title={String(value ?? '')}>
            {String(value ?? '')}
          </td>
        );
    }
  }

  function renderHeaderCell(col: DataTableColumn) {
    const isSortable =
      col.sortable !== false &&
      (col.type === 'text' ||
        col.type === 'avatar-text' ||
        col.type === 'check-icon' ||
        col.type === 'progress' ||
        col.type === 'link' ||
        col.type === 'metric' ||
        col.type === 'badge' ||
        col.sortable === true);

    if (col.type === 'checkbox') {
      return (
        <th key={col.key} className={`${styles.th} ${styles.thCheckbox}`}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={allSelected}
            ref={(el) => { if (el) el.indeterminate = someSelected; }}
            onChange={(e) => handleSelectAll(e.target.checked)}
            aria-label="Seleccionar todo"
          />
        </th>
      );
    }

    if (col.type === 'actions') {
      return <th key={col.key} className={`${styles.th} ${styles.thActions}`} />;
    }

    const linkWidthClass = col.type === 'link' ? (col.showAvatar ? styles.thLinkAvatar : styles.thLink) : undefined;
    const thClass = [
      styles.th,
      col.grow ? undefined : col.type ? THEAD_WIDTH_CLASS[col.type] : undefined,
      col.grow ? undefined : linkWidthClass,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <th key={col.key} className={thClass}>
        {col.title && (
          <div className={styles.thInner}>
            {isSortable ? (
              <button
                className={styles.thSortBtn}
                type="button"
                onClick={() => handleSort(col.key)}
                aria-label={`Ordenar por ${col.title}`}
              >
                <IconSortUp active={sortKey === col.key} />
                {col.title}
              </button>
            ) : (
              col.title
            )}
          </div>
        )}
      </th>
    );
  }

  return (
    <div className={[styles.card, className].filter(Boolean).join(' ')}>

      {/* ── Header ── */}
      <div className={`${styles.header}${!showFilterTrigger && !title ? ` ${styles.headerSearchOnly}` : ''}`}>

        {title && <div className={styles.tableTitle}>{title}</div>}

        {/* Filtro — trigger siempre visible, panel se despliega sobre la tabla */}
        {showFilterTrigger && (
          <div className={styles.filterWrapper} ref={filterWrapperRef}>
            <FilterApp
              expanded={false}
              onToggle={() => setFilterOpen((prev) => !prev)}
            />
            {filterOpen && (
              <div className={styles.filterPanel} role="dialog" aria-label="Opciones de filtro">
                <FilterApp
                  expanded={true}
                  fields={filterFields}
                  onFieldClick={(key, field) => onFilterFieldClick?.(key, field)}
                />
              </div>
            )}
          </div>
        )}

        <div className={styles.searchWrapper} role="search">
          <span className={styles.searchIcon}>
            <IconSearch />
          </span>
          <input
            className={styles.searchInput}
            type="search"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Buscar en la tabla"
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className={styles.tableWrapper}>
        <table className={styles.table} aria-label="Tabla de datos">
          <thead>
            <tr>{columns.map((col) => renderHeaderCell(col))}</tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => {
              const isLastRow = rowIndex === rows.length - 1;
              return (
                <tr key={row.id}>
                  {columns.map((col, colIndex) => {
                    const cell = renderCell(col, row) as ReactElement<{ className?: string }>;
                    if (!isLastRow) return cell;

                    const isFirstCol = colIndex === 0;
                    const isLastCol = colIndex === columns.length - 1;
                    const extraClass = [
                      styles.tdLastRow,
                      isFirstCol ? styles.tdLastRowFirst : '',
                      isLastCol ? styles.tdLastRowLast : '',
                    ]
                      .filter(Boolean)
                      .join(' ');

                    return cloneElement(cell, {
                      className: `${cell.props.className ?? ''} ${extraClass}`.trim(),
                    });
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Paginator ── */}
      {!hideFooter && (
      <div className={styles.paginator}>
        <p className={styles.paginatorTotal}>Total registros : {totalRecords}</p>

        <div className={styles.paginatorControls}>
          {rowsPerPage !== undefined && (
            <div className={styles.rowsPerPage}>
              <span className={styles.rowsPerPageLabel}>Filas</span>
              <select
                className={styles.rowsPerPageSelect}
                value={rowsPerPage}
                onChange={(e) => onRowsPerPageChange?.(Number(e.target.value))}
                aria-label="Filas por página"
              >
                {rowsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className={styles.paginatorPages}>
            <button
              className={styles.paginatorNav}
              type="button"
              onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
              aria-label="Página anterior"
              disabled={currentPage <= 1}
            >
              <IconChevronLeft />
            </button>

            {pageList.map((p, i) =>
              p === '...' ? (
                <span key={`ellipsis-${i}`} className={styles.pageEllipsis}>
                  …
                </span>
              ) : (
                <button
                  key={p}
                  className={`${styles.pageBtn}${p === currentPage ? ` ${styles.active}` : ''}`}
                  type="button"
                  onClick={() => onPageChange?.(p)}
                  aria-label={`Página ${p}`}
                  aria-current={p === currentPage ? 'page' : undefined}
                >
                  {p}
                </button>
              )
            )}

            <button
              className={styles.paginatorNav}
              type="button"
              onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
              aria-label="Siguiente página"
              disabled={currentPage >= totalPages}
            >
              <IconChevronRight />
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
