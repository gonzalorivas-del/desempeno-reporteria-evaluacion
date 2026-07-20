import { useMemo } from 'react';
import { IndicadorCard } from '../../components/IndicadorCard';
import { GraficoAraniaSection } from './GraficoAraniaSection';
import { ObjetivosEquipoSection } from './ObjetivosEquipoSection';
import type { ObjetivoRow } from './ObjetivosEquipoSection';
import { ColaboradoresEquipoTable } from './ColaboradoresEquipoTable';
import type { ColaboradorEquipoRow } from './ColaboradoresEquipoTable';
import type { OrganizacionNode } from './OrganizacionSection';
import { AXES, hashString, clamp } from './mockDataUtils';
import styles from './EquipoDetalle.module.css';

function IconDownload() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v11M7.5 10.5L12 15l4.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconMoreVertical() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <circle cx="10" cy="4" r="1.6" />
      <circle cx="10" cy="10" r="1.6" />
      <circle cx="10" cy="16" r="1.6" />
    </svg>
  );
}

const NOMBRES_POOL = [
  'Javiera Rojas', 'Matías Silva', 'Constanza Bravo', 'Tomás Herrera', 'Antonia Pizarro',
  'Vicente Castro', 'Emilia Cortés', 'Benjamín Rivas', 'Florencia Vera', 'Agustín Molina',
  'Isidora Campos', 'Maximiliano Godoy', 'Amanda Sepúlveda', 'Joaquín Leiva', 'Renata Fuentes',
  'Ignacio Salinas', 'Martina Guzmán', 'Cristóbal Parra', 'Josefa Núñez', 'Felipe Ortiz',
];

const CARGOS_POOL = [
  'Analista de Procesos', 'Coordinador/a de Equipo', 'Especialista Técnico/a', 'Ejecutivo/a de Cuentas',
  'Supervisor/a de Operaciones', 'Asistente Administrativo/a', 'Consultor/a Senior', 'Encargado/a de Proyectos',
];

function buildTitle(jefatura: string): string {
  if (/^Equipo\b/.test(jefatura)) return `Vista - ${jefatura}`;
  if (/^Depto\./.test(jefatura)) return `Vista - Equipo ${jefatura}`;
  return `Vista - Equipo Gerencia ${jefatura}`;
}

interface EquipoData {
  titulo: string;
  responsableLine: string;
  kpis: { calificacionFinal: number; logroObjetivos: number; logroCompetencias: number; numColaboradores: number };
  radarLogrado: Record<string, number>;
  radarEsperado: Record<string, number>;
  objetivos: ObjetivoRow[];
  colaboradores: ColaboradorEquipoRow[];
}

const GENERIC_OBJETIVOS: { label: string; unidad: string; metaValor: number }[] = [
  { label: 'Cumplimiento de plazos', unidad: '%', metaValor: 100 },
  { label: 'Satisfacción de stakeholders', unidad: '%', metaValor: 90 },
  { label: 'Capacitaciones completadas', unidad: ' cursos', metaValor: 6 },
  { label: 'Reducción de incidencias', unidad: '%', metaValor: 15 },
];

/**
 * Genera data ilustrativa determinística (misma semilla → mismo resultado) para
 * cualquier nodo de Organización que no sea el ejemplo exacto de Figma.
 */
function buildGeneratedData(node: OrganizacionNode): EquipoData {
  const seed = hashString(node.jefatura);
  const promedio = node.promedio;

  const logroObjetivos = clamp(promedio + ((seed % 7) - 3), 40, 100);
  const logroCompetencias = clamp(promedio + (((seed >>> 3) % 7) - 3), 40, 100);

  const radarLogrado: Record<string, number> = {};
  const radarEsperado: Record<string, number> = {};
  AXES.forEach((axis, i) => {
    const offset = ((seed >>> (i * 3)) % 21) - 10; // -10..10
    const logrado = clamp(promedio + offset, 35, 98);
    radarLogrado[axis.key] = logrado;
    radarEsperado[axis.key] = clamp(logrado + 6 + ((seed >>> (i + 2)) % 8), logrado, 100);
  });

  const objetivos: ObjetivoRow[] = GENERIC_OBJETIVOS.map((tpl, i) => {
    // Variación proporcional (%) en vez de absoluta: evita que metas pequeñas
    // (ej. "6 cursos") caigan a 0 con un offset pensado para metas de "100%".
    const variacionPct = ((seed >>> (i * 4)) % 41) - 15; // -15%..+25%
    const logradoValor = Math.max(1, Math.round(tpl.metaValor * (1 + variacionPct / 100)));
    const porcentaje = Math.round((logradoValor / tpl.metaValor) * 100);
    return {
      label: tpl.label,
      meta: `${tpl.metaValor}${tpl.unidad}`,
      logrado: `${logradoValor}${tpl.unidad}`,
      porcentaje,
    };
  });

  const count = Math.max(1, node.colaboradores);
  const colaboradores: ColaboradorEquipoRow[] = Array.from({ length: count }, (_, i) => {
    const nombreIdx = (seed + i * 7) % NOMBRES_POOL.length;
    const cargoIdx = (seed + i * 5) % CARGOS_POOL.length;
    const jitter = ((seed >>> i) % 15) - 7;
    return {
      nombre: NOMBRES_POOL[nombreIdx],
      cargo: CARGOS_POOL[cargoIdx],
      notaFinal: clamp(promedio + jitter, 40, 100),
      logroObjetivo: clamp(promedio + jitter - 3, 40, 100),
      logroCompetencia: clamp(promedio + jitter + 2, 40, 100),
    };
  });

  const responsableLine = node.responsable && node.responsable !== '—'
    ? `Responsable: ${node.responsable} — Proceso 2025`
    : 'Proceso 2025';

  return {
    titulo: buildTitle(node.jefatura),
    responsableLine,
    kpis: {
      calificacionFinal: promedio,
      logroObjetivos,
      logroCompetencias,
      numColaboradores: node.colaboradores,
    },
    radarLogrado,
    radarEsperado,
    objetivos,
    colaboradores,
  };
}

/**
 * Data exacta del diseño de Figma (nodo 869:11774), aplicada al nodo raíz
 * "Comercial" — el único ejemplo con datos 1:1 provistos en el archivo de
 * origen. El resto de los nodos usa buildGeneratedData (ilustrativa).
 */
const COMERCIAL_OVERRIDE: EquipoData = {
  titulo: 'Vista - Equipo Gerencia Comercial',
  responsableLine: 'Responsable: Rodrigo Paz — Proceso 2025',
  kpis: { calificacionFinal: 85, logroObjetivos: 86, logroCompetencias: 84, numColaboradores: 4 },
  radarLogrado: { liderazgo: 68, comunicacion: 88, trabajoEquipo: 58, resolucion: 55, adaptabilidad: 78 },
  radarEsperado: { liderazgo: 88, comunicacion: 90, trabajoEquipo: 85, resolucion: 82, adaptabilidad: 85 },
  objetivos: [
    { label: 'Disponibilidad de red', meta: '99.5%', logrado: '99.8%', porcentaje: 100 },
    { label: 'Tiempo resolución incidentes (prom.)', meta: '4 hrs', logrado: '3.2 hrs', porcentaje: 80 },
    { label: 'Certificaciones técnicas completadas', meta: '8 cert.', logrado: '7 cert.', porcentaje: 88 },
    { label: 'Reducción tickets escalados', meta: '20%', logrado: '28%', porcentaje: 120 },
  ],
  colaboradores: [
    { nombre: 'Pedro Soto', cargo: 'Analista de Redes', notaFinal: 88, logroObjetivo: 90, logroCompetencia: 86 },
    { nombre: 'Ana Torres', cargo: 'Desarrolladora Backend', notaFinal: 91, logroObjetivo: 94, logroCompetencia: 88 },
    { nombre: 'Carlos Méndez', cargo: 'Arquitecto de Software', notaFinal: 76, logroObjetivo: 72, logroCompetencia: 80 },
    { nombre: 'Laura Vega', cargo: 'Ingeniera DevOps', notaFinal: 85, logroObjetivo: 88, logroCompetencia: 82 },
  ],
};

export interface EquipoDetalleProps {
  node: OrganizacionNode;
  /** Callback al hacer clic en "Ver detalle" de un colaborador — navega a Vista Colaborador. */
  onSelectColaborador?: (row: ColaboradorEquipoRow) => void;
}

/**
 * Vista Equipo — detalle de una jefatura/equipo específico dentro de Organización.
 * Fuente: Figma nodo 869:11774 ("Vista Equipo — Redes e Infraestructura", contenido
 * de ejemplo: Gerencia Comercial / Rodrigo Paz).
 */
export function EquipoDetalle({ node, onSelectColaborador }: EquipoDetalleProps) {
  const data = useMemo(
    () => (node.jefatura === 'Comercial' ? COMERCIAL_OVERRIDE : buildGeneratedData(node)),
    [node]
  );

  return (
    <div className={styles.root}>
      <div className={styles.titleRow}>
        <div className={styles.titleGroup}>
          <p className={styles.title}>{data.titulo}</p>
          <p className={styles.subtitle}>{data.responsableLine}</p>
        </div>
        <button type="button" className={styles.exportLink}>
          <IconDownload />
          Exportar
        </button>
      </div>

      <div className={styles.kpiRow}>
        <IndicadorCard
          title="Calificación Final Promedio"
          value={data.kpis.calificacionFinal}
          icon={<IconMoreVertical />}
          valueColor="#0069FF"
        />
        <IndicadorCard
          title="Logro Objetivos Promedio"
          value={`${data.kpis.logroObjetivos}%`}
          icon={<IconMoreVertical />}
          valueColor="#00B4FF"
        />
        <IndicadorCard
          title="Logro Competencias Promedio"
          value={`${data.kpis.logroCompetencias}%`}
          icon={<IconMoreVertical />}
          valueColor="#00B4FF"
        />
        <IndicadorCard
          title="Número de Colaboradores"
          value={data.kpis.numColaboradores}
          icon={<IconMoreVertical />}
          valueColor="#1E5591"
        />
      </div>

      <div className={styles.chartRow}>
        <GraficoAraniaSection axes={AXES} logrado={data.radarLogrado} esperado={data.radarEsperado} />
        <ObjetivosEquipoSection rows={data.objetivos} />
      </div>

      <ColaboradoresEquipoTable rows={data.colaboradores} onVerDetalle={onSelectColaborador} />
    </div>
  );
}
