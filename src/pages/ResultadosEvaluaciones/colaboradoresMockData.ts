import type { DataTableRow } from '../../components/DataTable';
import avatarWoman from '../../assets/avatars/avatar-woman-1.png';
import avatarMan from '../../assets/avatars/avatar-man-1.png';
import type { ColaboradorEquipoRow } from './ColaboradoresEquipoTable';

const NOMBRES: Array<{ nombre: string; avatar: 'man' | 'woman' }> = [
  { nombre: 'Diego López',        avatar: 'man'   },
  { nombre: 'Camila Rodriguez',   avatar: 'woman' },
  { nombre: 'Andrés Pérez',       avatar: 'man'   },
  { nombre: 'Valentina Torres',   avatar: 'woman' },
  { nombre: 'Mateo Fernández',    avatar: 'man'   },
  { nombre: 'Isabella García',    avatar: 'woman' },
  { nombre: 'Juan Martínez',      avatar: 'man'   },
  { nombre: 'Lucía Morales',      avatar: 'woman' },
  { nombre: 'Sofía Martínez',     avatar: 'woman' },
  { nombre: 'Javier Gómez',       avatar: 'man'   },
];

const CARGOS = [
  'Gerente de Proyectos',
  'Analista de Datos',
  'Desarrollador Frontend',
  'Diseñador UX/UI',
  'Especialista en Marketing Digital',
  'Coordinador de Ventas',
  'Consultor de Recursos Humanos',
  'Asistente Administrativo',
];

const AREAS = [
  'Departamento de Ventas',
  'Recursos Humanos',
  'Desarrollo de Software',
  'Marketing Digital',
  'Atención al Cliente',
  'Logística y Distribución',
  'Finanzas y Contabilidad',
  'Investigación y Desarrollo',
];

const JEFATURAS = [
  'Sofía Martínez',
  'Javier Gómez',
  'Lucía Fernández',
  'Diego Torres',
  'Camila López',
  'Andrés Pérez',
  'Valentina Ruiz',
  'Mateo González',
];

const NINEBOX = [
  'Mejor talento',
  'Miembro clave',
  'Nuevas oportunidades',
  'Rendimiento sólido',
  'Nuevo rol',
  'Rendimiento limitado',
];

export const TOTAL_COLABORADORES = 300;

function buildRows(total: number): DataTableRow[] {
  return Array.from({ length: total }, (_, i) => {
    const persona = NOMBRES[i % NOMBRES.length];
    const calificacion = 40 + ((i * 7) % 61);
    return {
      id: i + 1,
      avatar: persona.avatar === 'woman' ? avatarWoman : avatarMan,
      rut: `${10000000 + i}-${i % 10}`,
      nombre: persona.nombre,
      cargo: CARGOS[i % CARGOS.length],
      area: AREAS[i % AREAS.length],
      jefatura: JEFATURAS[i % JEFATURAS.length],
      ninebox: NINEBOX[i % NINEBOX.length],
      calificacionFinal: calificacion,
      calificacionCalibrada: calificacion,
    };
  });
}

export const ALL_ROWS = buildRows(TOTAL_COLABORADORES);

// Los colaboradores destacados en la celda "Mejor talento" de la Matriz 9-Box
// (ver Matriz9Box.DEFAULT_ROWS) deben existir también en este listado general,
// para que al filtrar/navegar por nombre desde esa matriz aparezcan con datos
// consistentes. Sus calificaciones se fijan altas (a diferencia de la fórmula
// genérica) porque el cuadrante "Mejor talento" implica alto desempeño.
ALL_ROWS[0] = { ...ALL_ROWS[0], avatar: avatarWoman, nombre: 'Jennifer Valenzuela Lizama', cargo: 'QA', ninebox: 'Mejor talento', calificacionFinal: 94, calificacionCalibrada: 92 };
ALL_ROWS[1] = { ...ALL_ROWS[1], avatar: avatarMan, nombre: 'Jonathan Barra Barrientos', cargo: 'Desarrollador', ninebox: 'Mejor talento', calificacionFinal: 91, calificacionCalibrada: 89 };

/** Busca en el listado general el registro de un colaborador por nombre exacto. */
export function findColaboradorRowByName(nombre: string): DataTableRow | undefined {
  return ALL_ROWS.find((row) => row.nombre === nombre);
}

/** Adapta una fila del listado general al shape que espera Vista Colaborador. */
export function toColaboradorEquipoRow(row: DataTableRow): ColaboradorEquipoRow {
  const notaFinal = Number(row.calificacionFinal) || 0;
  const logroCompetencia = Number(row.calificacionCalibrada) || 0;
  return {
    nombre: row.nombre as string,
    cargo: row.cargo as string,
    notaFinal,
    logroObjetivo: notaFinal,
    logroCompetencia,
  };
}
