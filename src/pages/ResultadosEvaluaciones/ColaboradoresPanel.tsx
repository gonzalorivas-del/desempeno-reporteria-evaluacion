import { useEffect, useMemo, useRef, useState } from 'react';
import { DataTable } from '../../components/DataTable';
import type { DataTableColumn, DataTableRow } from '../../components/DataTable';
import { FilterApp } from '../../components/FilterApp';
import { ALL_ROWS } from './colaboradoresMockData';
import styles from './ColaboradoresPanel.module.css';

function IconDownload() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v11M7.5 10.5L12 15l4.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const COLUMNS: DataTableColumn[] = [
  { key: 'rut',                    title: 'Rut',                          type: 'text'   },
  { key: 'nombre',                 title: 'Colaborador',                  type: 'link', showAvatar: true },
  { key: 'cargo',                  title: 'Cargo',                        type: 'text'   },
  { key: 'area',                   title: 'Área',                         type: 'text'   },
  { key: 'jefatura',               title: 'Jefatura',                     type: 'text'   },
  { key: 'ninebox',                title: 'Ninebox',                      type: 'link'   },
  { key: 'calificacionFinal',      title: 'Calificación final',           type: 'metric' },
  { key: 'calificacionCalibrada',  title: 'Calificación final calibrada', type: 'metric' },
];

export interface ColaboradoresPanelProps {
  /** Callback al hacer clic en un colaborador o su ninebox (navegar a su ficha) */
  onSelectRow?: (row: DataTableRow, key: string) => void;
  /** Si se define, muestra solo los colaboradores cuyo nombre esté en esta lista. */
  filterNames?: string[];
}

/**
 * Contenido del side-panel "Total colaboradores" — listado general de
 * colaboradores que participaron de la evaluación de desempeño.
 * Fuente: Figma nodo 976:4834 ("Modal") / 976:4835 ("Table").
 */
export function ColaboradoresPanel({ onSelectRow, filterNames }: ColaboradoresPanelProps) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterWrapperRef = useRef<HTMLDivElement>(null);

  const sourceRows = useMemo(() => {
    if (!filterNames || filterNames.length === 0) return ALL_ROWS;
    const names = new Set(filterNames);
    return ALL_ROWS.filter((row) => names.has(row.nombre as string));
  }, [filterNames]);

  // Cierra el panel de filtros al hacer clic fuera (mismo patrón que DataTable).
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

  const rows = useMemo(
    () => sourceRows.slice((page - 1) * rowsPerPage, page * rowsPerPage),
    [sourceRows, page, rowsPerPage]
  );

  function handleRowsPerPageChange(next: number) {
    setRowsPerPage(next);
    setPage(1);
  }

  function handleLinkClick(rowId: string | number, key: string) {
    const row = sourceRows.find((r) => r.id === rowId);
    if (row) onSelectRow?.(row, key);
  }

  return (
    <div className={styles.root}>
      <p className={styles.subtitle}>
        Listado general de colaboradores y su calificación final - haz click en un colaborador para ir a su ficha
      </p>

      <div className={styles.toolbar}>
        <div className={styles.filterWrapper} ref={filterWrapperRef}>
          <FilterApp
            label="Filtros"
            expanded={false}
            onToggle={() => setFilterOpen((prev) => !prev)}
          />
          {filterOpen && (
            <div className={styles.filterPanel} role="dialog" aria-label="Opciones de filtro">
              <FilterApp label="Filtros" expanded={true} />
            </div>
          )}
        </div>
        <button type="button" className={styles.downloadLink}>
          <IconDownload />
          Descargar
        </button>
      </div>

      <DataTable
        columns={COLUMNS}
        rows={rows}
        total={sourceRows.length}
        currentPage={page}
        onPageChange={setPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        onLinkClick={handleLinkClick}
        showFilterTrigger={false}
        searchPlaceholder="Buscar contenido"
      />
    </div>
  );
}
