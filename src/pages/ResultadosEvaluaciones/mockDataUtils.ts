import type { GraficoAraniaAxis } from '../../components/GraficoArania';

/** Ejes de competencia usados por los gráficos de araña de Vista Equipo y Vista Colaborador. */
export const AXES: GraficoAraniaAxis[] = [
  { key: 'liderazgo', label: 'Liderazgo' },
  { key: 'comunicacion', label: 'Comunicación' },
  { key: 'trabajoEquipo', label: 'Trabajo en equipo' },
  { key: 'resolucion', label: 'Resolución' },
  { key: 'adaptabilidad', label: 'Adaptabilidad' },
];

/** Hash simple y determinístico (no Math.random) para variar la data mock por registro. */
export function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
