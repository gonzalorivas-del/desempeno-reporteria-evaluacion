import { Badge } from '../../components/Badge';
import styles from './ColaboradoresEquipoTable.module.css';

export interface ColaboradorEquipoRow {
  nombre: string;
  cargo: string;
  /** Nota final sobre 100 */
  notaFinal: number;
  /** % de logro de objetivos */
  logroObjetivo: number;
  /** % de logro de competencias */
  logroCompetencia: number;
}

export interface ColaboradoresEquipoTableProps {
  rows: ColaboradorEquipoRow[];
  onVerDetalle?: (row: ColaboradorEquipoRow) => void;
}

function iniciales(nombre: string) {
  const partes = nombre.trim().split(/\s+/);
  return ((partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')).toUpperCase();
}

/**
 * Tabla "Colaboradores" de Vista Equipo — listado de personas del equipo con
 * su nota final y logros de objetivo/competencia.
 * Fuente: Figma nodo 869:11894 ("Colaboradores-Panel").
 */
export function ColaboradoresEquipoTable({ rows, onVerDetalle }: ColaboradoresEquipoTableProps) {
  return (
    <section className={styles.card}>
      <p className={styles.title}>Colaboradores ({rows.length}-{rows.length})</p>

      <div className={styles.headerRow}>
        <span className={styles.colColaborador}>Colaborador</span>
        <span className={styles.colCargo}>Cargo</span>
        <span className={styles.colNota}>Nota final</span>
        <span className={styles.colLogro}>Logro objetivo</span>
        <span className={styles.colLogro}>Logro de competencia</span>
        <span className={styles.colAction} aria-hidden="true" />
      </div>

      {rows.map((row, i) => (
        <div
          key={row.nombre}
          className={`${styles.row}${i === rows.length - 1 ? ` ${styles.rowLast}` : ''}`}
        >
          <div className={styles.colColaborador}>
            <span className={styles.avatar}>{iniciales(row.nombre)}</span>
            <button type="button" className={styles.nombre} onClick={() => onVerDetalle?.(row)}>
              {row.nombre}
            </button>
          </div>
          <span className={`${styles.colCargo} ${styles.cargoText}`}>{row.cargo}</span>
          <span className={`${styles.colNota} ${styles.notaText}`}>{row.notaFinal}/100</span>
          <span className={`${styles.colLogro} ${styles.logroText}`}>{row.logroObjetivo}%</span>
          <span className={`${styles.colLogro} ${styles.logroText}`}>{row.logroCompetencia}%</span>
          <div className={styles.colAction}>
            <button type="button" className={styles.actionBtn} onClick={() => onVerDetalle?.(row)}>
              <Badge variant="outline-importante" label="Ver detalle" size="sm" />
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}
