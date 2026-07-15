import { useMemo, useState } from 'react';
import { ColaboradorHeaderCard } from './ColaboradorHeaderCard';
import { ColaboradorTabs, COLABORADOR_TABS } from './ColaboradorTabs';
import type { ColaboradorTab } from './ColaboradorTabs';
import { GraficoAraniaSection } from './GraficoAraniaSection';
import { ResumenEvaluacionPanel } from './ResumenEvaluacionPanel';
import type { ResumenEvaluacionRow } from './ResumenEvaluacionPanel';
import { DireccionesFuentePanel } from './DireccionesFuentePanel';
import type { DireccionFuenteRow } from './DireccionesFuentePanel';
import { BrechasIdentificadasTable } from './BrechasIdentificadasTable';
import type { BrechaRow } from './BrechasIdentificadasTable';
import { AXES, hashString, clamp } from './mockDataUtils';
import type { ColaboradorEquipoRow } from './ColaboradoresEquipoTable';
import styles from './ColaboradorDetalle.module.css';

function IconDownload() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v11M7.5 10.5L12 15l4.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** Chips de competencias mostrados bajo el gráfico de araña. Fijos por diseño (no derivan de la data). */
const COMPETENCY_CHIPS = ['Gestión del cambio', 'Innovación', 'Liderazgo', 'Competencias', 'Desarrollo de otros'];

/** Etiquetas genéricas de competencia para la tabla de brechas (mismo set que el ejemplo exacto de Figma). */
const BRECHA_LABELS = ['Gestión del Cambio', 'Innovación', 'Orientación al Cliente', 'Liderazgo', 'Desarrollo de Otros'];

const ESTADOS = ['Destacado', 'En línea', 'En desarrollo'];

interface ColaboradorDetalleData {
  estado: string;
  proceso: string;
  fechaEvaluacion: string;
  direcciones: { descendente: number; autoevaluacion: number; pares: number };
  radarLogrado: Record<string, number>;
  radarEsperado: Record<string, number>;
  brechas: BrechaRow[];
}

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

/**
 * Genera data ilustrativa determinística (misma semilla → mismo resultado)
 * para cualquier colaborador que no sea el ejemplo exacto de Figma.
 */
function buildGeneratedData(row: ColaboradorEquipoRow): ColaboradorDetalleData {
  const seed = hashString(row.nombre);

  const estado = ESTADOS[seed % ESTADOS.length];
  const dia = 1 + (seed % 28);
  const mes = 1 + ((seed >>> 4) % 12);
  const fechaEvaluacion = `${pad(dia)}/${pad(mes)}/2025`;

  const direcciones = {
    descendente: clamp(row.notaFinal + ((seed % 9) - 4), 40, 100),
    autoevaluacion: clamp(row.notaFinal + (((seed >>> 2) % 9) - 4), 40, 100),
    pares: clamp(row.notaFinal + (((seed >>> 5) % 9) - 4), 40, 100),
  };

  const radarLogrado: Record<string, number> = {};
  const radarEsperado: Record<string, number> = {};
  AXES.forEach((axis, i) => {
    const offset = ((seed >>> (i * 3)) % 21) - 10;
    const logrado = clamp(row.logroCompetencia + offset, 35, 98);
    radarLogrado[axis.key] = logrado;
    radarEsperado[axis.key] = clamp(logrado + 6 + ((seed >>> (i + 2)) % 8), logrado, 100);
  });

  const brechas: BrechaRow[] = BRECHA_LABELS.map((label, i) => {
    const offset = ((seed >>> (i * 4)) % 16) - 8;
    const logrado = clamp(row.logroCompetencia + offset, 30, 95);
    const gap = 8 + ((seed >>> (i + 3)) % 15);
    const esperado = clamp(logrado + gap, logrado, 100);
    return { competencia: label, logrado, esperado };
  });

  return { estado, proceso: '2025', fechaEvaluacion, direcciones, radarLogrado, radarEsperado, brechas };
}

/**
 * Data exacta del diseño de Figma (nodo 869:12641), aplicada al colaborador
 * "Pedro Soto" — el único ejemplo con datos 1:1 provistos en el archivo de
 * origen. El gráfico de araña de Figma se exporta como imagen sin valores
 * numéricos por eje; dado que el perfil visual coincide con el del equipo
 * "Comercial" al que pertenece (ver EquipoDetalle.COMERCIAL_OVERRIDE), se
 * reutilizan esos mismos valores medidos como aproximación razonada.
 */
const PEDRO_SOTO_OVERRIDE: ColaboradorDetalleData = {
  estado: 'Destacado',
  proceso: '2025',
  fechaEvaluacion: '13/03/2025',
  direcciones: { descendente: 77, autoevaluacion: 78, pares: 77 },
  radarLogrado: { liderazgo: 68, comunicacion: 88, trabajoEquipo: 58, resolucion: 55, adaptabilidad: 78 },
  radarEsperado: { liderazgo: 88, comunicacion: 90, trabajoEquipo: 85, resolucion: 82, adaptabilidad: 85 },
  brechas: [
    { competencia: 'Gestión del Cambio', logrado: 58, esperado: 80 },
    { competencia: 'Innovación', logrado: 60, esperado: 80 },
    { competencia: 'Orientación al Cliente', logrado: 68, esperado: 85 },
    { competencia: 'Liderazgo', logrado: 72, esperado: 85 },
    { competencia: 'Desarrollo de Otros', logrado: 65, esperado: 75 },
  ],
};

export interface ColaboradorDetalleProps {
  row: ColaboradorEquipoRow;
}

/**
 * Vista Colaborador — detalle individual de un colaborador dentro de Vista Equipo.
 * Fuente: Figma nodo 869:12641 ("Vista Colaborador — Pedro Soto").
 */
export function ColaboradorDetalle({ row }: ColaboradorDetalleProps) {
  const [tab, setTab] = useState<ColaboradorTab>(COLABORADOR_TABS[0]);

  const data = useMemo(
    () => (row.nombre === 'Pedro Soto' ? PEDRO_SOTO_OVERRIDE : buildGeneratedData(row)),
    [row]
  );

  const resumenRows: ResumenEvaluacionRow[] = [
    { label: 'Competencias', ponderacion: 'Ponderación: 60%', valor: row.logroCompetencia },
    { label: 'Objetivos', ponderacion: 'Ponderación: 40%', valor: row.logroObjetivo },
  ];

  const direccionesRows: DireccionFuenteRow[] = [
    { label: 'Descendente (Jefe)', valor: data.direcciones.descendente },
    { label: 'Autoevaluación', valor: data.direcciones.autoevaluacion },
    { label: 'Pares', valor: data.direcciones.pares },
  ];

  return (
    <div className={styles.root}>
      <div className={styles.titleRow}>
        <p className={styles.title}>Vista - Colaborador</p>
        <button type="button" className={styles.exportLink}>
          <IconDownload />
          Exportar
        </button>
      </div>

      <ColaboradorHeaderCard
        nombre={row.nombre}
        cargo={row.cargo}
        estado={data.estado}
        proceso={data.proceso}
        fechaEvaluacion={data.fechaEvaluacion}
        competenciasPct={row.logroCompetencia}
        objetivosPct={row.logroObjetivo}
        calificacionFinal={row.notaFinal}
      />

      <ColaboradorTabs active={tab} onChange={setTab} />

      {tab === 'Resumen' ? (
        <>
          <div className={styles.chartRow}>
            <GraficoAraniaSection
              axes={AXES}
              logrado={data.radarLogrado}
              esperado={data.radarEsperado}
              subtitle="Perfil de Competencias del Colaborador"
              chips={COMPETENCY_CHIPS}
            />
            <div className={styles.rightColumn}>
              <ResumenEvaluacionPanel rows={resumenRows} />
              <DireccionesFuentePanel rows={direccionesRows} />
            </div>
          </div>

          <BrechasIdentificadasTable rows={data.brechas} />
        </>
      ) : (
        <div className={styles.placeholder}>
          <p>Contenido no disponible en este prototipo.</p>
        </div>
      )}
    </div>
  );
}
