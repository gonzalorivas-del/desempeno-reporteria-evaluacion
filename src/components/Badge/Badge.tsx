import styles from './Badge.module.css';

export type BadgeVariant = 'solid-success' | 'solid-error' | 'solid-alert' | 'solid-primary' | 'outline-alert' | 'outline-importante';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  /** Variante de color del badge */
  variant: BadgeVariant;
  /** Texto visible del badge */
  label: string;
  /** Tamaño. Default: 'md' */
  size?: BadgeSize;
}

const ARIA_LABELS: Record<BadgeVariant, string> = {
  'solid-success': 'éxito',
  'solid-error': 'error',
  'solid-alert': 'alerta',
  'solid-primary': 'activo',
  'outline-alert': 'pendiente',
  'outline-importante': 'acción',
};

export function Badge({ variant, label, size = 'md' }: BadgeProps) {
  // outline-importante es un CTA (ej. "Ver detalles"), no un indicador de estado:
  // se usa siempre envuelto en un <button>, cuyo nombre accesible ya es el label.
  const isAction = variant === 'outline-importante';

  return (
    <span
      className={[styles.badge, styles[variant], styles[`size-${size}`]].join(' ')}
      role={isAction ? undefined : 'status'}
      aria-label={isAction ? undefined : `Estado ${ARIA_LABELS[variant]}: ${label}`}
    >
      {label}
    </span>
  );
}
