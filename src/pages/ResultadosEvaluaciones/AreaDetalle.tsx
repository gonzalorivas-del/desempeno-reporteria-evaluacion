import { AmbitosDetalleSection } from './AmbitosDetalleSection';
import { OrganizacionSection } from './OrganizacionSection';
import type { OrganizacionNode } from './OrganizacionSection';
import { DireccionesEvaluacionSection } from './DireccionesEvaluacionSection';
import { AREA_DATA } from './areaData';
import styles from './AreaDetalle.module.css';

function IconDownload() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v11M7.5 10.5L12 15l4.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const DIRECCIONES_SERIES = [
  { key: 'competencias', label: 'Competencias', color: '#1E5591' }, // colors.primario
  { key: 'objetivos', label: 'Objetivos', color: '#5780AD' },       // colors.panel
];

export interface AreaDetalleProps {
  area: string;
  /** Callback al hacer clic en "Ver detalles" de un registro de Organización — navega a Vista Equipo. */
  onSelectEquipo?: (node: OrganizacionNode) => void;
  /** Notifica el nivel de drill-down actual de Organización — el sidebar lo refleja. */
  onOrganizacionPathChange?: (path: OrganizacionNode[]) => void;
}

/**
 * Vista Área / Gerencia — detalle de una gerencia específica.
 * Fuente: Figma nodo 869:9702 ("Vista area/gerencia - Tecnologia", contenido de ejemplo: Comercial).
 */
export function AreaDetalle({ area, onSelectEquipo, onOrganizacionPathChange }: AreaDetalleProps) {
  const data = AREA_DATA[area] ?? AREA_DATA.Comercial;

  return (
    <div className={styles.root}>
      <div className={styles.titleRow}>
        <div className={styles.titleGroup}>
          <p className={styles.title}>Vista Área / Gerencia {area}</p>
          <p className={styles.subtitle}>Proceso: 2025</p>
        </div>
        <button type="button" className={styles.exportLink}>
          <IconDownload />
          Exportar
        </button>
      </div>

      <AmbitosDetalleSection rows={data.ambitos} />

      {/* key=area: reinicia el drill-down de Organización al cambiar de área */}
      <OrganizacionSection
        key={area}
        rows={data.organizacion}
        onSelectEquipo={onSelectEquipo}
        onPathChange={onOrganizacionPathChange}
      />

      <DireccionesEvaluacionSection
        title="Direcciones de Evaluación"
        subtitle="Comparación por Fuente de Evaluación"
        series={DIRECCIONES_SERIES}
        data={data.direcciones}
      />
    </div>
  );
}
