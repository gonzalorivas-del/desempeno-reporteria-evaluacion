import { useState } from 'react';
import styles from './GraficoLinea.module.css';

export interface GraficoLineaCategoria {
  key: string;
  label: string;
}

export interface GraficoLineaSerie {
  key: string;
  label: string;
  /** Color de línea y marcadores. Usar un token de colors.* */
  color: string;
}

export interface GraficoLineaProps {
  /** Categorías del eje X, en orden */
  categorias: GraficoLineaCategoria[];
  series: GraficoLineaSerie[];
  /** Valores por serie y por categoría. values[serieKey][categoriaKey] = número dentro de domain */
  values: Record<string, Record<string, number>>;
  /** Puntos "testimoniales" (pocas respuestas) — se dibujan con marcador hueco
   *  en vez de sólido. Mismo shape que `values`: testimonial[serieKey][categoriaKey]. */
  testimonial?: Record<string, Record<string, boolean>>;
  /** Rango de valores del eje Y. Default: [0, 100] */
  domain?: [number, number];
  /** Marcas del eje Y. Default: 5 pasos equidistantes dentro de domain */
  ticks?: number[];
  /** Alto del área de trazado en px. Default: 200 */
  height?: number;
  /** Alterna las etiquetas del eje X en 2 filas — evita solapamiento cuando hay
   *  muchas categorías con nombres largos. Default: false */
  twoRowLabels?: boolean;
  className?: string;
}

const PLOT_WIDTH = 983;
const Y_AXIS_WIDTH = 40;
const X_LABELS_HEIGHT = { oneRow: 20, twoRow: 34 };
const TOOLTIP_WIDTH = 168;
const TOOLTIP_HEIGHT = 58;

function defaultTicks(min: number, max: number): number[] {
  const range = max - min;
  return [0, 0.25, 0.5, 0.75, 1].map((f) => min + f * range).reverse();
}

function formatValor(value: number): string {
  return value.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * GraficoLinea — gráfico de líneas cartesiano (sin librería externa): N series
 * trazadas sobre un mismo eje de categorías, con grillas, etiquetas de eje Y,
 * marcadores "testimoniales" (huecos) y un popup con el valor exacto al pasar
 * el mouse sobre un punto.
 * Fuente: Figma nodo 1128:9 ("Grafico-Comparativo-Obtenido-Autoeval").
 */
export function GraficoLinea({
  categorias,
  series,
  values,
  testimonial,
  domain = [0, 100],
  ticks,
  height = 200,
  twoRowLabels = false,
  className,
}: GraficoLineaProps) {
  const [hover, setHover] = useState<{ serieKey: string; index: number } | null>(null);

  const [min, max] = domain;
  const range = max - min || 1;
  const tickValues = ticks ?? defaultTicks(min, max);
  const n = categorias.length;
  const xLabelsHeight = twoRowLabels ? X_LABELS_HEIGHT.twoRow : X_LABELS_HEIGHT.oneRow;
  const viewWidth = Y_AXIS_WIDTH + PLOT_WIDTH;
  const viewHeight = height + xLabelsHeight;
  const hayTestimoniales = series.some((serie) =>
    categorias.some((cat) => testimonial?.[serie.key]?.[cat.key])
  );

  function yFor(value: number) {
    const fraction = (value - min) / range;
    return height * (1 - Math.max(0, Math.min(1, fraction)));
  }

  function xFor(i: number) {
    return Y_AXIS_WIDTH + (n <= 1 ? PLOT_WIDTH / 2 : (i * PLOT_WIDTH) / (n - 1));
  }

  const hoverSerie = hover ? series.find((s) => s.key === hover.serieKey) : undefined;
  const hoverCategoria = hover ? categorias[hover.index] : undefined;
  const hoverValor = hover && hoverSerie ? values[hoverSerie.key]?.[categorias[hover.index].key] ?? min : undefined;
  const hoverEsTestimonial = hover && hoverSerie ? !!testimonial?.[hoverSerie.key]?.[categorias[hover.index].key] : false;

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      <svg
        width="100%"
        height={viewHeight}
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        role="img"
        aria-label="Gráfico de líneas comparativo"
        className={styles.svg}
        preserveAspectRatio="none"
      >
        {tickValues.map((tick) => {
          const y = yFor(tick);
          return (
            <g key={tick}>
              <line x1={Y_AXIS_WIDTH} y1={y} x2={viewWidth} y2={y} className={styles.gridline} />
              <text x={Y_AXIS_WIDTH - 8} y={y} textAnchor="end" dominantBaseline="middle" className={styles.yLabel}>
                {formatValor(tick)}
              </text>
            </g>
          );
        })}

        {series.map((serie) => (
          <g key={serie.key}>
            <polyline
              points={categorias.map((cat, i) => `${xFor(i)},${yFor(values[serie.key]?.[cat.key] ?? min)}`).join(' ')}
              fill="none"
              stroke={serie.color}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {categorias.map((cat, i) => {
              const isTestimonial = !!testimonial?.[serie.key]?.[cat.key];
              const cx = xFor(i);
              const cy = yFor(values[serie.key]?.[cat.key] ?? min);
              return (
                <g key={cat.key}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={3}
                    fill={isTestimonial ? '#FFFFFF' : serie.color}
                    stroke={isTestimonial ? serie.color : 'none'}
                    strokeWidth={isTestimonial ? 2 : 0}
                  />
                  {/* Área de hover ampliada — el marcador visual (r=3) es muy chico para apuntar con precisión */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={8}
                    fill="transparent"
                    onMouseEnter={() => setHover({ serieKey: serie.key, index: i })}
                    onMouseLeave={() => setHover(null)}
                  />
                </g>
              );
            })}
          </g>
        ))}

        {categorias.map((cat, i) => {
          const row = twoRowLabels ? i % 2 : 0;
          const y = height + 12 + row * 16;
          // Las etiquetas de los extremos se anclan hacia adentro (start/end en
          // vez de middle) para que no queden centradas sobre el borde del
          // viewBox y se corten — mismo tipo de recorte que motivó el margen
          // fijo de etiqueta en GraficoArania.
          const anchor = i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle';
          return (
            <text key={cat.key} x={xFor(i)} y={y} textAnchor={anchor} className={styles.xLabel}>
              {cat.label}
            </text>
          );
        })}

        {hover && hoverSerie && hoverCategoria && hoverValor !== undefined && (() => {
          const px = xFor(hover.index);
          const py = yFor(hoverValor);
          const tooltipX = Math.min(Math.max(px - TOOLTIP_WIDTH / 2, 0), viewWidth - TOOLTIP_WIDTH);
          const flip = py - TOOLTIP_HEIGHT - 10 < 0;
          const tooltipY = flip ? py + 10 : py - TOOLTIP_HEIGHT - 10;
          return (
            <foreignObject x={tooltipX} y={tooltipY} width={TOOLTIP_WIDTH} height={TOOLTIP_HEIGHT} style={{ overflow: 'visible', pointerEvents: 'none' }}>
              <div className={styles.tooltip}>
                <p className={styles.tooltipCategoria}>{hoverCategoria.label}</p>
                <p className={styles.tooltipValor}>
                  <span className={styles.tooltipSwatch} style={{ backgroundColor: hoverSerie.color }} />
                  {hoverSerie.label}: <strong>{formatValor(hoverValor)}</strong>
                </p>
                {hoverEsTestimonial && <p className={styles.tooltipTestimonial}>Testimonial (pocas respuestas)</p>}
              </div>
            </foreignObject>
          );
        })()}
      </svg>

      <div className={styles.legend}>
        {series.map((serie) => (
          <div className={styles.legendItem} key={serie.key}>
            <span className={styles.legendSwatch} style={{ backgroundColor: serie.color }} />
            <span className={styles.legendLabel}>{serie.label}</span>
          </div>
        ))}
        {hayTestimoniales && (
          <div className={styles.legendItem}>
            <span className={[styles.legendSwatch, styles.legendSwatchHollow].join(' ')} />
            <span className={styles.legendLabel}>Testimonial (pocas respuestas)</span>
          </div>
        )}
      </div>
    </div>
  );
}
