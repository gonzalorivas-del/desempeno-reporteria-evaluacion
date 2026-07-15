import styles from './ColaboradorHeaderCard.module.css';

export interface ColaboradorHeaderCardProps {
  nombre: string;
  cargo: string;
  estado: string;
  proceso: string;
  fechaEvaluacion: string;
  competenciasPct: number;
  objetivosPct: number;
  /** Calificación final, 0-100 */
  calificacionFinal: number;
}

function iniciales(nombre: string) {
  const partes = nombre.trim().split(/\s+/);
  return ((partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')).toUpperCase();
}

/**
 * Tarjeta de cabecera de Vista Colaborador — identidad, metadatos del proceso
 * y calificación final.
 * Fuente: Figma nodo 869:12668 ("Header-Colaborador").
 */
export function ColaboradorHeaderCard({
  nombre,
  cargo,
  estado,
  proceso,
  fechaEvaluacion,
  competenciasPct,
  objetivosPct,
  calificacionFinal,
}: ColaboradorHeaderCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <span className={styles.avatar}>{iniciales(nombre)}</span>
        <div className={styles.info}>
          <div className={styles.identity}>
            <p className={styles.nombre}>{nombre}</p>
            <p className={styles.cargo}>{cargo}</p>
          </div>
          <div className={styles.meta}>
            <p><span className={styles.metaLabel}>Estado:</span> {estado}</p>
            <p><span className={styles.metaLabel}>Proceso:</span> {proceso}</p>
            <p><span className={styles.metaLabel}>Fecha evaluación:</span> {fechaEvaluacion}</p>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <p className={styles.statLabel}>Competencias</p>
              <p className={styles.statValue}>{competenciasPct}%</p>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <p className={styles.statLabel}>Objetivos</p>
              <p className={styles.statValue}>{objetivosPct}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.scoreCircle}>
          <span className={styles.scoreValue}>{calificacionFinal}</span>
          <span className={styles.scoreSuffix}>/100</span>
        </div>
        <p className={styles.scoreCaption}>Calificación final</p>
      </div>
    </div>
  );
}
