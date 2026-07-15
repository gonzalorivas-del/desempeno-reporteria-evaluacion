import type { MouseEvent } from 'react';

export interface FiltroField {
  key: string;
  label: string;
  value?: string;
  placeholder?: string;
}

export interface FiltroProps {
  /** Texto del trigger. Default: 'Filtros' */
  label?: string;
  /** Ítems del panel desplegable */
  fields?: FiltroField[];
  /** Estado controlado (abierto/cerrado) */
  expanded?: boolean;
  /** Estado inicial no controlado. Default: false */
  defaultExpanded?: boolean;
  /** Deshabilita la interacción. Default: false */
  disabled?: boolean;
  onToggle?: () => void;
  onFieldClick?: (key: string, field: FiltroField, event: MouseEvent) => void;
  className?: string;
}

export function Filtro(props: FiltroProps): JSX.Element;
