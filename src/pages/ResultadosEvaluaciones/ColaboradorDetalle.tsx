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
import { ComparativoObtenidoAutoevalSection } from './ComparativoObtenidoAutoevalSection';
import { ResumenAspectosGeneralesSection } from './ResumenAspectosGeneralesSection';
import { DimensionesAccordion } from './DimensionesAccordion';
import type { DimensionItem } from './DimensionesAccordion';
import { CompetenciasAccordion } from './CompetenciasAccordion';
import type { CompetenciaItem } from './CompetenciasAccordion';
import { ObjetivosIndividualesTable } from './ObjetivosIndividualesTable';
import type { ObjetivoIndividualRow } from './ObjetivosIndividualesTable';
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

/**
 * Competencias evaluadas — tab "Competencias" (nodo 869:10853). Las 5
 * primeras son el mismo set exacto que "Principales brechas identificadas"
 * (tab Resumen) ya usaba — de hecho esas 5 son, dentro de estas 12, las de
 * mayor brecha negativa (-22,-20,-17,-13,-10 vs. -5,-5,+1,+2,+3,+5,+10), así
 * que "brechas" se deriva de esta misma lista más abajo en vez de mantenerse
 * como un dataset aparte.
 *
 * El nodo Figma repite "Adaptabilidad" dos veces con valores idénticos
 * (869:10919 y 869:10928) — un evidente error de copy-paste en el archivo de
 * origen. Se sustituyó el segundo por "Autonomía" (un nombre de competencia
 * distinto y plausible) en vez de replicar el duplicado literal.
 */
const COMPETENCIAS_EVALUADAS = [
  { key: 'gestionCambio', label: 'Gestión del Cambio' },
  { key: 'innovacion', label: 'Innovación' },
  { key: 'orientacionCliente', label: 'Orientación al Cliente' },
  { key: 'liderazgoComp', label: 'Liderazgo' },
  { key: 'desarrolloOtrosComp', label: 'Desarrollo de Otros' },
  { key: 'adaptabilidadComp', label: 'Adaptabilidad' },
  { key: 'autonomiaComp', label: 'Autonomía' },
  { key: 'orientacionResultados', label: 'Orientación a Resultados' },
  { key: 'comunicacionComp', label: 'Comunicación' },
  { key: 'resolucionProblemas', label: 'Resolución de Problemas' },
  { key: 'planificacion', label: 'Planificación' },
  { key: 'trabajoEquipoComp', label: 'Trabajo en Equipo' },
];

/** Competencias del gráfico "Comparativo Obtenido vs. Autoevaluación" (mismo set y orden que el ejemplo de Figma, nodo 1128:9). */
const COMPARATIVO_CATEGORIAS = [
  { key: 'iniciativa', label: 'Iniciativa' },
  { key: 'seguimientoAutogestion', label: 'Seguimiento y autogestión' },
  { key: 'atencionDetalle', label: 'Atención al detalle' },
  { key: 'concrecionTiempo', label: 'Concreción a tiempo' },
  { key: 'gestionTiempo', label: 'Gestión del tiempo' },
  { key: 'desarrolloOtros', label: 'Desarrollo de Otros' },
  { key: 'trabajoEquipo', label: 'Trabajo en Equipo' },
  { key: 'sinergia', label: 'Sinergia' },
  { key: 'relacionesInterpersonales', label: 'Relaciones Interpersonales' },
  { key: 'comunicacion', label: 'Comunicación' },
  { key: 'manejoEmociones', label: 'Manejo de las emociones' },
  { key: 'autonomia', label: 'Autonomía' },
  { key: 'liderazgo', label: 'Liderazgo' },
  { key: 'aspectosTecnicos', label: 'Aspectos técnicos' },
];

const COMPARATIVO_LABEL_BY_KEY: Record<string, string> = Object.fromEntries(
  COMPARATIVO_CATEGORIAS.map((c) => [c.key, c.label])
);

/**
 * Dimensiones de la tab "Dimensión" — agrupan las mismas 14 competencias del
 * gráfico "Comparativo Obtenido vs. Autoevaluación" (mismo set y orden que el
 * ejemplo de Figma, nodo 1116:6287). Solo "Metodología de trabajo" tiene sus 5
 * competencias 1:1 desde el diseño; el resto de la agrupación (Habilidades
 * Blandas Laborales / Liderazgo / Transferencia a la Operación) es una
 * clasificación razonable por semántica del nombre, ya que Figma solo muestra
 * esas 3 dimensiones colapsadas (sin su detalle de competencias).
 */
const DIMENSIONES = [
  {
    key: 'metodologiaTrabajo',
    label: 'Metodología de trabajo',
    competencias: ['iniciativa', 'seguimientoAutogestion', 'atencionDetalle', 'concrecionTiempo', 'gestionTiempo'],
  },
  {
    key: 'habilidadesBlandas',
    label: 'Habilidades Blandas Laborales',
    competencias: ['desarrolloOtros', 'trabajoEquipo', 'sinergia', 'relacionesInterpersonales', 'comunicacion', 'manejoEmociones'],
  },
  {
    key: 'liderazgoDimension',
    label: 'Liderazgo',
    competencias: ['liderazgo'],
  },
  {
    key: 'transferenciaOperacion',
    label: 'Transferencia a la Operación',
    competencias: ['autonomia', 'aspectosTecnicos'],
  },
];

/**
 * Plantilla genérica de objetivos individuales — tab "Objetivos" (nodo
 * 869:11034). Solo Pedro Soto tiene sus 4 objetivos 1:1 desde el diseño
 * (específicos de su rol de Analista de Redes); para cualquier otro
 * colaborador se generan objetivos genéricos (independientes del rol),
 * mismo patrón de variación proporcional ya usado en EquipoDetalle.
 */
const OBJETIVOS_GENERICOS_TEMPLATE: { descripcion: string; unidad: string; metaValor: number }[] = [
  { descripcion: 'Cumplimiento de plazos', unidad: '%', metaValor: 100 },
  { descripcion: 'Satisfacción de stakeholders', unidad: '%', metaValor: 90 },
  { descripcion: 'Capacitaciones completadas', unidad: ' cursos', metaValor: 6 },
  { descripcion: 'Reducción de incidencias', unidad: '%', metaValor: 15 },
];

const ESTADOS = ['Destacado', 'En línea', 'En desarrollo'];

interface ColaboradorDetalleData {
  estado: string;
  proceso: string;
  fechaEvaluacion: string;
  direcciones: { descendente: number; autoevaluacion: number; pares: number };
  radarLogrado: Record<string, number>;
  radarEsperado: Record<string, number>;
  /** Tab "Competencias" — logrado/esperado/direcciones (0-100) por competencia, keyed por COMPETENCIAS_EVALUADAS[].key. "Principales brechas identificadas" (tab Resumen) se deriva de esto, no se guarda aparte. */
  competenciasEvaluadas: Record<string, { logrado: number; esperado: number; direcciones: { descendente: number; autoevaluacion: number; pares: number } }>;
  comparativoObtenido: Record<string, number>;
  comparativoAutoevaluacion: Record<string, number>;
  /** Competencias cuyo "Obtenido" proviene de pocas respuestas (testimoniales). */
  comparativoObtenidoTestimonial: Record<string, boolean>;
  /** Tab "Dimensión" — resultado ponderado (0-100) por dimensión, keyed por DIMENSIONES[].key. */
  dimensionesValores: Record<string, number>;
  /** Tab "Dimensión" — resultado (0-100) por dirección de evaluación, por dimensión. */
  dimensionesDirecciones: Record<string, { descendente: number; autoevaluacion: number; pares: number }>;
  /** Tab "Dimensión" — resultado (0-100) por competencia (mismas keys que COMPARATIVO_CATEGORIAS). */
  competenciasValores: Record<string, number>;
  /** Tab "Dimensión" — gráfico "Resumen Aspectos Generales": 4 series en escala 1,00-7,00 por dimensión. */
  resumenAspectos: {
    esperado: Record<string, number>;
    minimo: Record<string, number>;
    obtenido: Record<string, number>;
    autoevaluacion: Record<string, number>;
  };
  /** Tab "Objetivos" — objetivos individuales del proceso (descripción/meta/logrado/cumplimiento). */
  objetivosIndividuales: ObjetivoIndividualRow[];
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

  const competenciasEvaluadas: ColaboradorDetalleData['competenciasEvaluadas'] = {};
  COMPETENCIAS_EVALUADAS.forEach((comp, i) => {
    const offset = ((seed >>> (i * 4)) % 16) - 8;
    const logrado = clamp(row.logroCompetencia + offset, 30, 95);
    const gap = ((seed >>> (i + 3)) % 26) - 10; // -10..+15 — permite brechas positivas y negativas
    const esperado = clamp(logrado - gap, 30, 100);
    competenciasEvaluadas[comp.key] = {
      logrado,
      esperado,
      direcciones: {
        descendente: clamp(logrado + (((seed >>> (i + 6)) % 9) - 4), 30, 100),
        autoevaluacion: clamp(logrado + (((seed >>> (i + 7)) % 9) - 4), 30, 100),
        pares: clamp(logrado + (((seed >>> (i + 8)) % 9) - 4), 30, 100),
      },
    };
  });

  // Escala de "Comparativo Obtenido vs. Autoevaluación": 1,00 a 7,00 (nota de
  // proceso), no el 0-100% usado en el resto de la vista — se mapea logroCompetencia
  // proporcionalmente a ese rango. Autoevaluación se muestra plana (un solo valor
  // de autopercepción general, no varía por competencia, igual que en el ejemplo de Figma).
  const toEscala7 = (pct: number) => Math.round(clamp(1 + (pct / 100) * 6, 1, 7) * 10) / 10;
  const comparativoObtenido: Record<string, number> = {};
  const comparativoAutoevaluacion: Record<string, number> = {};
  // Testimonial: menos de 3 evaluadores respondieron esa competencia — mock
  // determinístico (no hay dato real de N° de evaluadores por competencia en
  // este prototipo), ~1 de cada 5 competencias.
  const comparativoObtenidoTestimonial: Record<string, boolean> = {};
  const autoevaluacionPlana = toEscala7(direcciones.autoevaluacion);
  COMPARATIVO_CATEGORIAS.forEach((cat, i) => {
    const offset = (((seed >>> ((i % 6) * 5)) + i * 13) % 21) / 10 - 1;
    comparativoObtenido[cat.key] = Math.round(clamp(toEscala7(row.logroCompetencia) + offset, 1, 7) * 10) / 10;
    comparativoAutoevaluacion[cat.key] = autoevaluacionPlana;
    comparativoObtenidoTestimonial[cat.key] = (seed >>> i) % 5 === 0;
  });

  // Tab "Dimensión" (0-100%, como el resto de la vista — no la escala 1-7 del
  // "Comparativo"): agregado por dimensión + desglose por dirección, y valor
  // individual por competencia. No se derivan por promedio uno del otro — el
  // propio ejemplo de Figma tiene un agregado (75) que no coincide con el
  // promedio de sus 5 competencias (55,60,65,50,60 → 58), así que ambos se
  // generan de forma independiente aquí también.
  const competenciasValores: Record<string, number> = {};
  COMPARATIVO_CATEGORIAS.forEach((cat, i) => {
    const offset = ((seed >>> ((i % 5) * 6)) + i * 11) % 31 - 15;
    competenciasValores[cat.key] = clamp(row.logroCompetencia + offset, 30, 98);
  });

  const dimensionesValores: Record<string, number> = {};
  const dimensionesDirecciones: Record<string, { descendente: number; autoevaluacion: number; pares: number }> = {};
  DIMENSIONES.forEach((dim, i) => {
    const base = clamp(row.logroCompetencia + (((seed >>> (i * 6)) % 21) - 10), 40, 100);
    dimensionesValores[dim.key] = base;
    dimensionesDirecciones[dim.key] = {
      descendente: clamp(base + (((seed >>> (i + 1)) % 9) - 4), 40, 100),
      autoevaluacion: clamp(base + (((seed >>> (i + 2)) % 9) - 4), 40, 100),
      pares: clamp(base + (((seed >>> (i + 3)) % 9) - 4), 40, 100),
    };
  });

  const resumenAspectos = {
    esperado: {} as Record<string, number>,
    minimo: {} as Record<string, number>,
    obtenido: {} as Record<string, number>,
    autoevaluacion: {} as Record<string, number>,
  };
  DIMENSIONES.forEach((dim) => {
    const dimValor = dimensionesValores[dim.key];
    resumenAspectos.esperado[dim.key] = toEscala7(clamp(dimValor + 15, 0, 100));
    resumenAspectos.minimo[dim.key] = toEscala7(clamp(dimValor - 15, 0, 100));
    resumenAspectos.obtenido[dim.key] = toEscala7(dimValor);
    resumenAspectos.autoevaluacion[dim.key] = toEscala7(dimensionesDirecciones[dim.key].autoevaluacion);
  });

  // Tab "Objetivos": variación proporcional (%) en vez de absoluta — evita que
  // metas pequeñas (ej. "6 cursos") caigan a 0 con un offset pensado para
  // metas de "100%" (mismo bug ya corregido una vez en EquipoDetalle).
  const objetivosIndividuales: ObjetivoIndividualRow[] = OBJETIVOS_GENERICOS_TEMPLATE.map((tpl, i) => {
    const variacionPct = ((seed >>> (i * 4)) % 41) - 15; // -15%..+25%
    const logradoValor = Math.max(1, Math.round(tpl.metaValor * (1 + variacionPct / 100)));
    const cumplimiento = Math.min(100, Math.round((logradoValor / tpl.metaValor) * 100));
    return {
      descripcion: tpl.descripcion,
      meta: `${tpl.metaValor}${tpl.unidad}`,
      logrado: `${logradoValor}${tpl.unidad}`,
      cumplimiento,
    };
  });

  return {
    estado,
    proceso: '2025',
    fechaEvaluacion,
    direcciones,
    radarLogrado,
    radarEsperado,
    competenciasEvaluadas,
    comparativoObtenido,
    comparativoAutoevaluacion,
    comparativoObtenidoTestimonial,
    dimensionesValores,
    dimensionesDirecciones,
    competenciasValores,
    resumenAspectos,
    objetivosIndividuales,
  };
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
  // "Comparativo Obtenido vs. Autoevaluación" (nodo 1128:9): la línea "Obtenido"
  // se exporta en Figma como imagen (sin valores por punto); estos números
  // aproximan su forma visual dentro del rango exacto medido en el pixel
  // (mínimo ~4,80 en "Atención al detalle", máximo ~5,95 en "Trabajo en
  // Equipo"). "Autoevaluación" sí es exacta: la línea es perfectamente plana
  // en 6,00 en todo el gráfico.
  comparativoObtenido: {
    iniciativa: 5.1,
    seguimientoAutogestion: 4.9,
    atencionDetalle: 4.8,
    concrecionTiempo: 5.3,
    gestionTiempo: 5.3,
    desarrolloOtros: 5.4,
    trabajoEquipo: 5.95,
    sinergia: 5.7,
    relacionesInterpersonales: 5.65,
    comunicacion: 5.75,
    manejoEmociones: 5.7,
    autonomia: 5.3,
    liderazgo: 5.3,
    aspectosTecnicos: 5.2,
  },
  comparativoAutoevaluacion: {
    iniciativa: 6.0,
    seguimientoAutogestion: 6.0,
    atencionDetalle: 6.0,
    concrecionTiempo: 6.0,
    gestionTiempo: 6.0,
    desarrolloOtros: 6.0,
    trabajoEquipo: 6.0,
    sinergia: 6.0,
    relacionesInterpersonales: 6.0,
    comunicacion: 6.0,
    manejoEmociones: 6.0,
    autonomia: 6.0,
    liderazgo: 6.0,
    aspectosTecnicos: 6.0,
  },
  // Sin dato real de N° de evaluadores por competencia en el archivo de
  // origen — "Sinergia" y "Manejo de las emociones" se marcan como
  // ilustración de competencias con pocas respuestas (testimoniales).
  comparativoObtenidoTestimonial: {
    iniciativa: false,
    seguimientoAutogestion: false,
    atencionDetalle: false,
    concrecionTiempo: false,
    gestionTiempo: false,
    desarrolloOtros: false,
    trabajoEquipo: false,
    sinergia: true,
    relacionesInterpersonales: false,
    comunicacion: false,
    manejoEmociones: true,
    autonomia: false,
    liderazgo: false,
    aspectosTecnicos: false,
  },
  // Tab "Dimensión" (nodo 1116:6287): "Metodología de trabajo" es el único
  // ejemplo expandido en Figma — sus 5 competencias, el agregado (75) y las 3
  // direcciones (55/60/59) son exactos. Las otras 3 dimensiones solo muestran
  // su agregado colapsado en el diseño (80/75/75); sus competencias y
  // direcciones son ilustrativas, elegidas para promediar cerca de ese
  // agregado ya conocido.
  dimensionesValores: {
    metodologiaTrabajo: 75,
    habilidadesBlandas: 80,
    liderazgoDimension: 75,
    transferenciaOperacion: 75,
  },
  dimensionesDirecciones: {
    metodologiaTrabajo: { descendente: 55, autoevaluacion: 60, pares: 59 },
    habilidadesBlandas: { descendente: 78, autoevaluacion: 82, pares: 79 },
    liderazgoDimension: { descendente: 73, autoevaluacion: 77, pares: 74 },
    transferenciaOperacion: { descendente: 76, autoevaluacion: 74, pares: 75 },
  },
  competenciasValores: {
    iniciativa: 55,
    seguimientoAutogestion: 60,
    atencionDetalle: 65,
    concrecionTiempo: 50,
    gestionTiempo: 60,
    desarrolloOtros: 78,
    trabajoEquipo: 82,
    sinergia: 80,
    relacionesInterpersonales: 79,
    comunicacion: 83,
    manejoEmociones: 78,
    autonomia: 74,
    liderazgo: 75,
    aspectosTecnicos: 76,
  },
  // "Resumen Aspectos Generales" (nodo 1123:9): mismo caso que el gráfico
  // Comparativo — las 4 líneas se exportan como imagen, sin valores por
  // punto. Estos números aproximan la forma visual dentro del rango medido
  // en pixeles de cada línea (Esperado ~5,95-6,15; Mínimo ~5,05-5,25;
  // Obtenido ~4,95-5,60, más variable; Autoevaluación ~5,95-6,00, casi plana).
  resumenAspectos: {
    esperado: { metodologiaTrabajo: 6.1, habilidadesBlandas: 6.0, liderazgoDimension: 6.15, transferenciaOperacion: 5.95 },
    minimo: { metodologiaTrabajo: 5.2, habilidadesBlandas: 5.1, liderazgoDimension: 5.25, transferenciaOperacion: 5.05 },
    obtenido: { metodologiaTrabajo: 5.0, habilidadesBlandas: 5.55, liderazgoDimension: 5.4, transferenciaOperacion: 5.5 },
    autoevaluacion: { metodologiaTrabajo: 6.0, habilidadesBlandas: 6.0, liderazgoDimension: 6.0, transferenciaOperacion: 6.0 },
  },
  // Tab "Competencias" (nodo 869:10853): "Gestión del Cambio" es el único
  // ejemplo expandido en Figma — su logrado/esperado y sus 3 direcciones
  // (55/60/59) son exactos. Las otras 11 solo muestran logrado/esperado
  // colapsados en el diseño (o, para "Autonomía", son una sustitución del
  // duplicado "Adaptabilidad" — ver nota en COMPETENCIAS_EVALUADAS); sus
  // direcciones son ilustrativas.
  competenciasEvaluadas: {
    gestionCambio: { logrado: 58, esperado: 80, direcciones: { descendente: 55, autoevaluacion: 60, pares: 59 } },
    innovacion: { logrado: 60, esperado: 80, direcciones: { descendente: 58, autoevaluacion: 62, pares: 60 } },
    orientacionCliente: { logrado: 68, esperado: 85, direcciones: { descendente: 66, autoevaluacion: 70, pares: 68 } },
    liderazgoComp: { logrado: 72, esperado: 85, direcciones: { descendente: 70, autoevaluacion: 74, pares: 72 } },
    desarrolloOtrosComp: { logrado: 65, esperado: 75, direcciones: { descendente: 63, autoevaluacion: 67, pares: 65 } },
    adaptabilidadComp: { logrado: 70, esperado: 75, direcciones: { descendente: 68, autoevaluacion: 72, pares: 70 } },
    autonomiaComp: { logrado: 72, esperado: 78, direcciones: { descendente: 70, autoevaluacion: 74, pares: 72 } },
    orientacionResultados: { logrado: 91, esperado: 90, direcciones: { descendente: 89, autoevaluacion: 93, pares: 91 } },
    comunicacionComp: { logrado: 82, esperado: 80, direcciones: { descendente: 80, autoevaluacion: 84, pares: 82 } },
    resolucionProblemas: { logrado: 88, esperado: 85, direcciones: { descendente: 86, autoevaluacion: 90, pares: 88 } },
    planificacion: { logrado: 85, esperado: 80, direcciones: { descendente: 83, autoevaluacion: 87, pares: 85 } },
    trabajoEquipoComp: { logrado: 90, esperado: 80, direcciones: { descendente: 88, autoevaluacion: 92, pares: 90 } },
  },
  // Tab "Objetivos" (nodo 869:11034): los 4 objetivos, específicos de su rol
  // de Analista de Redes, son exactos desde el diseño. "Reducción tickets
  // escalados" logra 28% sobre una meta de 20% (140% de ratio crudo), pero
  // Figma muestra el cumplimiento acotado en 100% — se replica esa misma
  // convención de acotar en vez de mostrar el ratio sin acotar.
  objetivosIndividuales: [
    { descripcion: 'Disponibilidad de red >= 99.5%', meta: '99.5 %', logrado: '99.8 %', cumplimiento: 100 },
    { descripcion: 'Tiempo promedio resolución incidentes', meta: '4 hrs', logrado: '3.2 hrs', cumplimiento: 80 },
    { descripcion: 'Certificaciones técnicas completadas', meta: '2 cert.', logrado: '2 cert.', cumplimiento: 100 },
    { descripcion: 'Reducción tickets escalados', meta: '20 %', logrado: '28 %', cumplimiento: 100 },
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

  const dimensionItems: DimensionItem[] = DIMENSIONES.map((dim) => ({
    key: dim.key,
    label: dim.label,
    valor: data.dimensionesValores[dim.key],
    direcciones: data.dimensionesDirecciones[dim.key],
    competencias: dim.competencias.map((key) => ({
      key,
      label: COMPARATIVO_LABEL_BY_KEY[key],
      valor: data.competenciasValores[key],
    })),
  }));

  const competenciaItems: CompetenciaItem[] = COMPETENCIAS_EVALUADAS.map((comp) => ({
    key: comp.key,
    label: comp.label,
    ...data.competenciasEvaluadas[comp.key],
  }));

  // "Principales brechas identificadas" (tab Resumen) = las 5 competencias
  // con mayor brecha negativa (logrado - esperado), derivadas de esta misma
  // lista — ver nota en COMPETENCIAS_EVALUADAS.
  const brechas: BrechaRow[] = [...competenciaItems]
    .sort((a, b) => (a.logrado - a.esperado) - (b.logrado - b.esperado))
    .slice(0, 5)
    .map((c) => ({ competencia: c.label, logrado: c.logrado, esperado: c.esperado }));

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

          <ComparativoObtenidoAutoevalSection
            proceso={data.proceso}
            fechaEvaluacion={data.fechaEvaluacion}
            categorias={COMPARATIVO_CATEGORIAS}
            obtenido={data.comparativoObtenido}
            autoevaluacion={data.comparativoAutoevaluacion}
            obtenidoTestimonial={data.comparativoObtenidoTestimonial}
          />

          <BrechasIdentificadasTable rows={brechas} />
        </>
      ) : tab === 'Dimensión' ? (
        <>
          <ResumenAspectosGeneralesSection
            proceso={data.proceso}
            fechaEvaluacion={data.fechaEvaluacion}
            dimensiones={DIMENSIONES}
            esperado={data.resumenAspectos.esperado}
            minimo={data.resumenAspectos.minimo}
            obtenido={data.resumenAspectos.obtenido}
            autoevaluacion={data.resumenAspectos.autoevaluacion}
          />

          <p className={styles.dimensionesCaption}>
            ({dimensionItems.length}) dimensiones — clic en cada una para ver el detalle por dirección y sus categorías
          </p>

          <DimensionesAccordion dimensiones={dimensionItems} />
        </>
      ) : tab === 'Competencias' ? (
        <>
          <p className={styles.dimensionesCaption}>
            ({competenciaItems.length}) competencias evaluadas — clic en cada una para ver el detalle por dirección
          </p>

          <CompetenciasAccordion competencias={competenciaItems} />
        </>
      ) : tab === 'Objetivos' ? (
        <ObjetivosIndividualesTable proceso={data.proceso} objetivos={data.objetivosIndividuales} />
      ) : (
        <div className={styles.placeholder}>
          <p>Contenido no disponible en este prototipo.</p>
        </div>
      )}
    </div>
  );
}
