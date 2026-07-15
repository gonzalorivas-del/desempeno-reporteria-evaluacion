import styles from './GraficoBarrasAgrupado.module.css';

export interface GraficoBarrasAgrupadoSerie {
  key: string;
  label: string;
  /** Color de la barra. Usar un token de colors.* (ej. tokens.colors.primario.$value) */
  color: string;
}

export interface GraficoBarrasAgrupadoDatum {
  group: string;
  /** Valores por serie, indexados por `GraficoBarrasAgrupadoSerie.key` */
  values: Record<string, number>;
}

export interface GraficoBarrasAgrupadoProps {
  series: GraficoBarrasAgrupadoSerie[];
  data: GraficoBarrasAgrupadoDatum[];
  /** Rango de valores del eje Y. Default: [0, 100] */
  domain?: [number, number];
  /** Marcas de referencia horizontales dentro del dominio. Default: 4 pasos equidistantes */
  gridlines?: number[];
  /** Alto del área de trazado en px. Default: 180 */
  height?: number;
  className?: string;
}

/**
 * GraficoBarrasAgrupado — gráfico de barras verticales agrupadas (sin librería externa).
 * Fuente: Figma nodo 921:8393 ("VBarchart", sección "Direcciones de Evaluación").
 */
export function GraficoBarrasAgrupado({
  series,
  data,
  domain = [0, 100],
  gridlines,
  height = 180,
  className,
}: GraficoBarrasAgrupadoProps) {
  const [min, max] = domain;
  const range = max - min || 1;
  const ticks = gridlines ?? [
    max,
    Math.round(max - range / 3),
    Math.round(max - (2 * range) / 3),
    min,
  ];

  function toPercent(value: number) {
    return Math.max(0, Math.min(100, ((value - min) / range) * 100));
  }

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      <div className={styles.plotArea} style={{ height }}>
        {ticks.map((tick) => (
          <div key={tick} className={styles.gridline} style={{ bottom: `${toPercent(tick)}%` }}>
            <span className={styles.gridlineLabel}>{tick}</span>
            <span className={styles.gridlineRule} />
          </div>
        ))}

        <div className={styles.groups}>
          {data.map((datum) => (
            <div className={styles.group} key={datum.group}>
              <div className={styles.bars}>
                {series.map((serie) => (
                  <div
                    key={serie.key}
                    className={styles.bar}
                    style={{
                      height: `${toPercent(datum.values[serie.key] ?? 0)}%`,
                      backgroundColor: serie.color,
                    }}
                    title={`${serie.label}: ${datum.values[serie.key] ?? 0}`}
                  />
                ))}
              </div>
              <span className={styles.groupLabel}>{datum.group}</span>
            </div>
          ))}
        </div>
      </div>

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
