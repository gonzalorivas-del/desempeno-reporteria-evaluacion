import type { AmbitoDetalleRow } from './AmbitosDetalleSection';
import type { OrganizacionNode } from './OrganizacionSection';
import type { GraficoBarrasAgrupadoDatum } from '../../components/GraficoBarrasAgrupado';

export interface AreaData {
  ambitos: AmbitoDetalleRow[];
  organizacion: OrganizacionNode[];
  direcciones: GraficoBarrasAgrupadoDatum[];
}

/**
 * Datos mock por área. Solo "Comercial" — incluyendo el árbol completo de
 * Organización hasta el tercer nivel (Comercial → Depto. Ventas Corporativas →
 * Equipo Ventas Norte/Sur) — proviene 1:1 del diseño de Figma (nodo 869:9702).
 * El resto de las áreas no tiene frame propio en el archivo de origen, así que
 * se generó data ilustrativa siguiendo el mismo patrón y profundidad de 3
 * niveles, para que el drill-down funcione de forma consistente en todas ellas.
 */
export const AREA_DATA: Record<string, AreaData> = {
  Comercial: {
    ambitos: [
      { label: 'Calificación final', logrado: 80, esperado: 85, delta: '-5' },
      { label: 'Competencias', logrado: 70, esperado: 85, delta: '-10' },
      { label: 'Objetivos', logrado: 65, esperado: 85, delta: '-15' },
      { label: 'Otros', logrado: 80, esperado: 85, delta: '-5' },
    ],
    organizacion: [
      {
        jefatura: 'Comercial', responsable: '—', colaboradores: 27, promedio: 80, estado: '1/2 completados',
        children: [
          {
            jefatura: 'Depto. Ventas Corporativas', responsable: '—', colaboradores: 11, promedio: 84, estado: '1/2 completados',
            children: [
              { jefatura: 'Equipo Ventas Norte', responsable: 'Camila Reyes', colaboradores: 6, promedio: 88, estado: 'Completado', estadoVariant: 'solid-success' },
              { jefatura: 'Equipo Ventas Sur', responsable: 'Andrés Vidal', colaboradores: 5, promedio: 70, estado: 'En curso', estadoVariant: 'outline-alert' },
            ],
          },
          {
            jefatura: 'Depto. Retail', responsable: '—', colaboradores: 16, promedio: 78, estado: '1/2 completados',
            children: [
              { jefatura: 'Equipo Retail Norte', responsable: 'Diego Soto', colaboradores: 8, promedio: 82, estado: 'Completado', estadoVariant: 'solid-success' },
              { jefatura: 'Equipo Retail Sur', responsable: 'Fernanda Rojas', colaboradores: 8, promedio: 74, estado: 'En curso', estadoVariant: 'outline-alert' },
            ],
          },
        ],
      },
      {
        jefatura: 'Dirección de Tecnología', responsable: '—', colaboradores: 26, promedio: 71, estado: '1/2 completados',
        children: [
          {
            jefatura: 'Depto. Desarrollo', responsable: '—', colaboradores: 14, promedio: 73, estado: '1/2 completados',
            children: [
              { jefatura: 'Equipo Backend', responsable: 'Jorge Muñoz', colaboradores: 7, promedio: 76, estado: 'Completado', estadoVariant: 'solid-success' },
              { jefatura: 'Equipo Frontend', responsable: 'Valentina Cruz', colaboradores: 7, promedio: 70, estado: 'En curso', estadoVariant: 'outline-alert' },
            ],
          },
          {
            jefatura: 'Depto. Soporte TI', responsable: '—', colaboradores: 12, promedio: 69, estado: '1/2 completados',
            children: [
              { jefatura: 'Equipo Soporte Nivel 1', responsable: 'Ricardo Paz', colaboradores: 6, promedio: 72, estado: 'Completado', estadoVariant: 'solid-success' },
              { jefatura: 'Equipo Soporte Nivel 2', responsable: 'Daniela Ríos', colaboradores: 6, promedio: 66, estado: 'En curso', estadoVariant: 'outline-alert' },
            ],
          },
        ],
      },
    ],
    direcciones: [
      { group: 'Descendente', values: { competencias: 81, objetivos: 89 } },
      { group: 'Autoevaluación', values: { competencias: 83, objetivos: 91 } },
      { group: 'Pares', values: { competencias: 80, objetivos: 87 } },
      { group: 'Ascendente', values: { competencias: 77, objetivos: 85 } },
    ],
  },
  Tecnología: {
    ambitos: [
      { label: 'Calificación final', logrado: 70, esperado: 70, delta: '-5' },
      { label: 'Competencias', logrado: 60, esperado: 70, delta: '-10' },
      { label: 'Objetivos', logrado: 55, esperado: 70, delta: '-15' },
      { label: 'Otros', logrado: 70, esperado: 70, delta: '-5' },
    ],
    organizacion: [
      {
        jefatura: 'Tecnología', responsable: '—', colaboradores: 24, promedio: 74, estado: '2/3 completados',
        children: [
          {
            jefatura: 'Depto. Plataformas', responsable: '—', colaboradores: 13, promedio: 76, estado: '2/3 completados',
            children: [
              { jefatura: 'Equipo Cloud', responsable: 'Simón Herrera', colaboradores: 7, promedio: 80, estado: 'Completado', estadoVariant: 'solid-success' },
              { jefatura: 'Equipo Infraestructura', responsable: 'Paula Vega', colaboradores: 6, promedio: 71, estado: 'En curso', estadoVariant: 'outline-alert' },
            ],
          },
          {
            jefatura: 'Depto. Datos', responsable: '—', colaboradores: 11, promedio: 71, estado: '1/2 completados',
            children: [
              { jefatura: 'Equipo Analítica', responsable: 'Tomás Fuentes', colaboradores: 6, promedio: 74, estado: 'Completado', estadoVariant: 'solid-success' },
              { jefatura: 'Equipo Ingeniería de Datos', responsable: 'Camila Ibarra', colaboradores: 5, promedio: 68, estado: 'En curso', estadoVariant: 'outline-alert' },
            ],
          },
        ],
      },
      {
        jefatura: 'Soporte y Operaciones TI', responsable: '—', colaboradores: 18, promedio: 68, estado: '1/2 completados',
        children: [
          {
            jefatura: 'Depto. Mesa de Ayuda', responsable: '—', colaboradores: 10, promedio: 70, estado: '1/2 completados',
            children: [
              { jefatura: 'Equipo Soporte N1', responsable: 'Matías Contreras', colaboradores: 5, promedio: 73, estado: 'Completado', estadoVariant: 'solid-success' },
              { jefatura: 'Equipo Soporte N2', responsable: 'Josefa Bravo', colaboradores: 5, promedio: 66, estado: 'En curso', estadoVariant: 'outline-alert' },
            ],
          },
          {
            jefatura: 'Depto. Redes y Seguridad', responsable: '—', colaboradores: 8, promedio: 65, estado: '1/2 completados',
            children: [
              { jefatura: 'Equipo Redes', responsable: 'Nicolás Espinoza', colaboradores: 4, promedio: 68, estado: 'Completado', estadoVariant: 'solid-success' },
              { jefatura: 'Equipo Ciberseguridad', responsable: 'Antonia Salas', colaboradores: 4, promedio: 62, estado: 'En curso', estadoVariant: 'outline-alert' },
            ],
          },
        ],
      },
    ],
    direcciones: [
      { group: 'Descendente', values: { competencias: 68, objetivos: 74 } },
      { group: 'Autoevaluación', values: { competencias: 71, objetivos: 76 } },
      { group: 'Pares', values: { competencias: 66, objetivos: 72 } },
      { group: 'Ascendente', values: { competencias: 63, objetivos: 70 } },
    ],
  },
  RRHH: {
    ambitos: [
      { label: 'Calificación final', logrado: 65, esperado: 65, delta: '-5' },
      { label: 'Competencias', logrado: 55, esperado: 65, delta: '-15' },
      { label: 'Objetivos', logrado: 50, esperado: 65, delta: '-20' },
      { label: 'Otros', logrado: 65, esperado: 65, delta: '-5' },
    ],
    organizacion: [
      {
        jefatura: 'RRHH', responsable: '—', colaboradores: 15, promedio: 69, estado: '1/2 completados',
        children: [
          {
            jefatura: 'Depto. Selección', responsable: '—', colaboradores: 8, promedio: 71, estado: '1/2 completados',
            children: [
              { jefatura: 'Equipo Reclutamiento', responsable: 'Constanza Lagos', colaboradores: 4, promedio: 74, estado: 'Completado', estadoVariant: 'solid-success' },
              { jefatura: 'Equipo Onboarding', responsable: 'Felipe Cárdenas', colaboradores: 4, promedio: 67, estado: 'En curso', estadoVariant: 'outline-alert' },
            ],
          },
          {
            jefatura: 'Depto. Bienestar', responsable: '—', colaboradores: 7, promedio: 66, estado: '1/2 completados',
            children: [
              { jefatura: 'Equipo Clima Laboral', responsable: 'Javiera Toro', colaboradores: 4, promedio: 69, estado: 'Completado', estadoVariant: 'solid-success' },
              { jefatura: 'Equipo Beneficios', responsable: 'Cristóbal Reyes', colaboradores: 3, promedio: 62, estado: 'En curso', estadoVariant: 'outline-alert' },
            ],
          },
        ],
      },
      {
        jefatura: 'Selección y Bienestar', responsable: '—', colaboradores: 12, promedio: 66, estado: '1/2 completados',
        children: [
          {
            jefatura: 'Depto. Procesos de Selección', responsable: '—', colaboradores: 7, promedio: 68, estado: '1/2 completados',
            children: [
              { jefatura: 'Equipo Evaluación', responsable: 'Ignacia Muñoz', colaboradores: 4, promedio: 70, estado: 'Completado', estadoVariant: 'solid-success' },
              { jefatura: 'Equipo Assessment', responsable: 'Vicente Rojas', colaboradores: 3, promedio: 64, estado: 'En curso', estadoVariant: 'outline-alert' },
            ],
          },
          {
            jefatura: 'Depto. Programas de Bienestar', responsable: '—', colaboradores: 5, promedio: 63, estado: '1/2 completados',
            children: [
              { jefatura: 'Equipo Salud Ocupacional', responsable: 'Fernanda Silva', colaboradores: 3, promedio: 66, estado: 'Completado', estadoVariant: 'solid-success' },
              { jefatura: 'Equipo Actividades', responsable: 'Diego Navarro', colaboradores: 2, promedio: 58, estado: 'En curso', estadoVariant: 'outline-alert' },
            ],
          },
        ],
      },
    ],
    direcciones: [
      { group: 'Descendente', values: { competencias: 62, objetivos: 68 } },
      { group: 'Autoevaluación', values: { competencias: 65, objetivos: 70 } },
      { group: 'Pares', values: { competencias: 60, objetivos: 66 } },
      { group: 'Ascendente', values: { competencias: 58, objetivos: 64 } },
    ],
  },
  Finanzas: {
    ambitos: [
      { label: 'Calificación final', logrado: 82, esperado: 88, delta: '-3' },
      { label: 'Competencias', logrado: 75, esperado: 88, delta: '-8' },
      { label: 'Objetivos', logrado: 70, esperado: 88, delta: '-12' },
      { label: 'Otros', logrado: 82, esperado: 88, delta: '-3' },
    ],
    organizacion: [
      {
        jefatura: 'Finanzas', responsable: '—', colaboradores: 20, promedio: 84, estado: '2/2 completados',
        children: [
          {
            jefatura: 'Depto. Presupuesto', responsable: '—', colaboradores: 11, promedio: 86, estado: '2/2 completados',
            children: [
              { jefatura: 'Equipo Planificación', responsable: 'Josefina Araya', colaboradores: 6, promedio: 89, estado: 'Completado', estadoVariant: 'solid-success' },
              { jefatura: 'Equipo Control de Gestión', responsable: 'Martín Soto', colaboradores: 5, promedio: 82, estado: 'Completado', estadoVariant: 'solid-success' },
            ],
          },
          {
            jefatura: 'Depto. Tesorería', responsable: '—', colaboradores: 9, promedio: 81, estado: '1/2 completados',
            children: [
              { jefatura: 'Equipo Pagos', responsable: 'Amanda Reyes', colaboradores: 5, promedio: 84, estado: 'Completado', estadoVariant: 'solid-success' },
              { jefatura: 'Equipo Cobranzas', responsable: 'Sebastián Molina', colaboradores: 4, promedio: 77, estado: 'En curso', estadoVariant: 'outline-alert' },
            ],
          },
        ],
      },
      {
        jefatura: 'Contabilidad y Tesorería', responsable: '—', colaboradores: 17, promedio: 80, estado: '1/2 completados',
        children: [
          {
            jefatura: 'Depto. Contabilidad', responsable: '—', colaboradores: 10, promedio: 82, estado: '1/2 completados',
            children: [
              { jefatura: 'Equipo Contable', responsable: 'Valeria Pizarro', colaboradores: 6, promedio: 85, estado: 'Completado', estadoVariant: 'solid-success' },
              { jefatura: 'Equipo Impuestos', responsable: 'Rodrigo Fuentes', colaboradores: 4, promedio: 78, estado: 'En curso', estadoVariant: 'outline-alert' },
            ],
          },
          {
            jefatura: 'Depto. Auditoría Interna', responsable: '—', colaboradores: 7, promedio: 76, estado: '1/2 completados',
            children: [
              { jefatura: 'Equipo Auditoría', responsable: 'Camila Torres', colaboradores: 4, promedio: 79, estado: 'Completado', estadoVariant: 'solid-success' },
              { jefatura: 'Equipo Cumplimiento', responsable: 'Ignacio Vera', colaboradores: 3, promedio: 71, estado: 'En curso', estadoVariant: 'outline-alert' },
            ],
          },
        ],
      },
    ],
    direcciones: [
      { group: 'Descendente', values: { competencias: 79, objetivos: 87 } },
      { group: 'Autoevaluación', values: { competencias: 82, objetivos: 89 } },
      { group: 'Pares', values: { competencias: 77, objetivos: 85 } },
      { group: 'Ascendente', values: { competencias: 75, objetivos: 83 } },
    ],
  },
  Operaciones: {
    ambitos: [
      { label: 'Calificación final', logrado: 78, esperado: 85, delta: '-5' },
      { label: 'Competencias', logrado: 68, esperado: 85, delta: '-12' },
      { label: 'Objetivos', logrado: 63, esperado: 85, delta: '-18' },
      { label: 'Otros', logrado: 78, esperado: 85, delta: '-5' },
    ],
    organizacion: [
      {
        jefatura: 'Operaciones', responsable: '—', colaboradores: 22, promedio: 79, estado: '1/2 completados',
        children: [
          {
            jefatura: 'Depto. Producción', responsable: '—', colaboradores: 12, promedio: 81, estado: '1/2 completados',
            children: [
              { jefatura: 'Equipo Turno A', responsable: 'Patricio Leiva', colaboradores: 6, promedio: 84, estado: 'Completado', estadoVariant: 'solid-success' },
              { jefatura: 'Equipo Turno B', responsable: 'Bárbara Campos', colaboradores: 6, promedio: 77, estado: 'En curso', estadoVariant: 'outline-alert' },
            ],
          },
          {
            jefatura: 'Depto. Calidad', responsable: '—', colaboradores: 10, promedio: 76, estado: '1/2 completados',
            children: [
              { jefatura: 'Equipo Control de Calidad', responsable: 'Gonzalo Herrera', colaboradores: 5, promedio: 79, estado: 'Completado', estadoVariant: 'solid-success' },
              { jefatura: 'Equipo Mejora Continua', responsable: 'Valentina Paredes', colaboradores: 5, promedio: 72, estado: 'En curso', estadoVariant: 'outline-alert' },
            ],
          },
        ],
      },
      {
        jefatura: 'Logística y Distribución', responsable: '—', colaboradores: 19, promedio: 76, estado: '1/2 completados',
        children: [
          {
            jefatura: 'Depto. Transporte', responsable: '—', colaboradores: 10, promedio: 78, estado: '1/2 completados',
            children: [
              { jefatura: 'Equipo Flota Norte', responsable: 'Cristian Aguilar', colaboradores: 5, promedio: 81, estado: 'Completado', estadoVariant: 'solid-success' },
              { jefatura: 'Equipo Flota Sur', responsable: 'Daniela Cortés', colaboradores: 5, promedio: 74, estado: 'En curso', estadoVariant: 'outline-alert' },
            ],
          },
          {
            jefatura: 'Depto. Bodegaje', responsable: '—', colaboradores: 9, promedio: 73, estado: '1/2 completados',
            children: [
              { jefatura: 'Equipo Recepción', responsable: 'Francisca Ojeda', colaboradores: 5, promedio: 76, estado: 'Completado', estadoVariant: 'solid-success' },
              { jefatura: 'Equipo Despacho', responsable: 'Álvaro Morales', colaboradores: 4, promedio: 69, estado: 'En curso', estadoVariant: 'outline-alert' },
            ],
          },
        ],
      },
    ],
    direcciones: [
      { group: 'Descendente', values: { competencias: 75, objetivos: 82 } },
      { group: 'Autoevaluación', values: { competencias: 78, objetivos: 84 } },
      { group: 'Pares', values: { competencias: 73, objetivos: 80 } },
      { group: 'Ascendente', values: { competencias: 71, objetivos: 78 } },
    ],
  },
};

/**
 * Equipos de nivel raíz de un área (las ramas de tope de su árbol de
 * Organización) — usados por el sidebar (SidebarNiveles) para listar "todos
 * los equipos" del área sin exponer los niveles Depto./Equipo más profundos.
 */
export function getEquiposRaiz(area: string): OrganizacionNode[] {
  return (AREA_DATA[area] ?? AREA_DATA.Comercial).organizacion;
}
