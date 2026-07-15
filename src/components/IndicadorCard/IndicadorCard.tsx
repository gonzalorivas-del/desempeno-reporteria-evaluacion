import type { ReactNode } from 'react';
import styles from './IndicadorCard.module.css';

export interface IndicadorCardProps {
  /** Título de la métrica. Ej: "Total colaboradores" */
  title: string;
  /** Valor principal a mostrar. Ej: "300", "85%" */
  value: string | number;
  /** Sufijo secundario junto al valor, en tamaño menor. Ej: "/100" */
  valueSuffix?: string;
  /** Texto del link de acción inferior. Omitir para no mostrarlo */
  linkLabel?: string;
  onLinkClick?: () => void;
  /** Ícono opcional en la cabecera (ej. menú de opciones). Si se define, el título
   *  se alinea a la izquierda en una fila con el ícono, en vez de centrado solo. */
  icon?: ReactNode;
  /** Color del valor principal. Default: colors.primario (#1E5591) */
  valueColor?: string;
  className?: string;
}

/**
 * IndicadorCard — tarjeta de indicador (KPI) del dashboard de Resultados de Evaluaciones.
 * Fuente: Figma nodo 1053:9536 ("Dashboard-container") / 869:11805 (variante con ícono, Vista Equipo).
 */
export function IndicadorCard({
  title,
  value,
  valueSuffix,
  linkLabel,
  onLinkClick,
  icon,
  valueColor,
  className,
}: IndicadorCardProps) {
  return (
    <div className={[styles.card, className].filter(Boolean).join(' ')}>
      {icon ? (
        <div className={styles.header}>
          <p className={styles.titleLeft}>{title}</p>
          <span className={styles.icon}>{icon}</span>
        </div>
      ) : (
        <p className={styles.title}>{title}</p>
      )}
      <p className={styles.value} style={valueColor ? { color: valueColor } : undefined}>
        {value}
        {valueSuffix && <span className={styles.valueSuffix}>{valueSuffix}</span>}
      </p>
      {linkLabel && (
        <button type="button" className={styles.link} onClick={onLinkClick}>
          {linkLabel}
        </button>
      )}
    </div>
  );
}
