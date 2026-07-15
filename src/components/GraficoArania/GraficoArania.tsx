import styles from './GraficoArania.module.css';

export interface GraficoAraniaAxis {
  key: string;
  label: string;
}

export interface GraficoAraniaSerie {
  key: string;
  label: string;
  /** Color de línea/relleno. Usar un token de colors.* */
  color: string;
  /** 'filled': línea sólida + relleno translúcido + marcadores por eje (ej. "Valor Logrado").
   *  'outline': línea punteada, sin relleno ni marcadores (ej. "Valor Esperado"). Default: 'filled' */
  variant?: 'filled' | 'outline';
}

export interface GraficoAraniaProps {
  /** Ejes del gráfico, en orden (se distribuyen a partes iguales alrededor del centro) */
  axes: GraficoAraniaAxis[];
  series: GraficoAraniaSerie[];
  /** Valores por serie y por eje. values[serieKey][ejeKey] = número dentro de domain */
  values: Record<string, Record<string, number>>;
  /** Rango de valores. Default: [0, 100] */
  domain?: [number, number];
  /** Diámetro del área de trazado (polígonos), en px. Default: 200 */
  size?: number;
  className?: string;
}

const RING_COUNT = 4;
// Margen reservado a cada lado para las etiquetas de eje (ej. "Trabajo en equipo",
// "Comunicación") — sin esto, las etiquetas más largas se cortan contra el borde del SVG.
const LABEL_MARGIN = 78;

/**
 * GraficoArania — gráfico de araña / radar (sin librería externa).
 * Fuente: Figma nodo 869:11817 ("Group-chart", sección "Gráfico de Araña — Equipo").
 */
export function GraficoArania({
  axes,
  series,
  values,
  domain = [0, 100],
  size = 200,
  className,
}: GraficoAraniaProps) {
  const [min, max] = domain;
  const range = max - min || 1;
  const viewSize = size + LABEL_MARGIN * 2;
  const center = viewSize / 2;
  const radius = size / 2;
  const n = axes.length;

  function angleFor(i: number) {
    return -Math.PI / 2 + (i * 2 * Math.PI) / n;
  }

  function pointFor(i: number, valueFraction: number) {
    const angle = angleFor(i);
    const r = radius * Math.max(0, Math.min(1, valueFraction));
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  }

  function polygonPoints(serieKey: string) {
    return axes
      .map((axis, i) => {
        const raw = values[serieKey]?.[axis.key] ?? min;
        const fraction = (raw - min) / range;
        const { x, y } = pointFor(i, fraction);
        return `${x},${y}`;
      })
      .join(' ');
  }

  const rings = Array.from({ length: RING_COUNT }, (_, i) => (i + 1) / RING_COUNT);

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      <svg
        width={viewSize}
        height={viewSize}
        viewBox={`0 0 ${viewSize} ${viewSize}`}
        role="img"
        aria-label="Gráfico de araña de competencias del equipo"
        className={styles.svg}
      >
        {/* Grillas concéntricas */}
        {rings.map((fraction) => (
          <polygon
            key={fraction}
            points={axes.map((_, i) => {
              const { x, y } = pointFor(i, fraction);
              return `${x},${y}`;
            }).join(' ')}
            className={styles.grid}
          />
        ))}

        {/* Ejes */}
        {axes.map((axis, i) => {
          const { x, y } = pointFor(i, 1);
          return <line key={axis.key} x1={center} y1={center} x2={x} y2={y} className={styles.axisLine} />;
        })}

        {/* Series */}
        {series.map((serie) => (
          <polygon
            key={serie.key}
            points={polygonPoints(serie.key)}
            fill={serie.variant === 'outline' ? 'none' : serie.color}
            fillOpacity={serie.variant === 'outline' ? 0 : 0.25}
            stroke={serie.color}
            strokeWidth={2}
            strokeDasharray={serie.variant === 'outline' ? '5 4' : undefined}
            strokeLinejoin="round"
          />
        ))}

        {/* Marcadores (solo series 'filled') */}
        {series
          .filter((serie) => serie.variant !== 'outline')
          .map((serie) =>
            axes.map((axis, i) => {
              const raw = values[serie.key]?.[axis.key] ?? min;
              const fraction = (raw - min) / range;
              const { x, y } = pointFor(i, fraction);
              return <circle key={`${serie.key}-${axis.key}`} cx={x} cy={y} r={3.5} fill={serie.color} />;
            })
          )}

        {/* Etiquetas de eje — a un margen fijo (no proporcional) más allá del anillo 100% */}
        {axes.map((axis, i) => {
          const angle = angleFor(i);
          const labelR = radius + 20;
          const x = center + labelR * Math.cos(angle);
          const y = center + labelR * Math.sin(angle);
          const anchor = Math.abs(Math.cos(angle)) < 0.3 ? 'middle' : Math.cos(angle) > 0 ? 'start' : 'end';
          return (
            <text key={axis.key} x={x} y={y} textAnchor={anchor} className={styles.axisLabel}>
              {axis.label}
            </text>
          );
        })}
      </svg>

      <div className={styles.legend}>
        {series.map((serie) => (
          <div className={styles.legendItem} key={serie.key}>
            <span className={styles.legendSwatch} style={{ backgroundColor: serie.color }} />
            <span className={styles.legendLabel}>{serie.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
