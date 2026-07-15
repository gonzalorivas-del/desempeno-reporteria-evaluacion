import { useState } from 'react';
import { Megamenu } from '../../components/Megamenu';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Selector } from '../../components/Selector';
import { Checkbox } from '../../components/Checkbox';
import { SidebarNiveles } from '../../components/SidebarNiveles';
import { IndicadorCard } from '../../components/IndicadorCard';
import { Modal } from '../../components/Modal';
import { AmbitosEvaluacionSection } from './AmbitosEvaluacionSection';
import { Matriz9Box } from '../../components/Matriz9Box';
import type { Matriz9BoxCell, Matriz9BoxColaborador } from '../../components/Matriz9Box';
import { DireccionesEvaluacionSection } from './DireccionesEvaluacionSection';
import { ColaboradoresPanel } from './ColaboradoresPanel';
import { findColaboradorRowByName, toColaboradorEquipoRow } from './colaboradoresMockData';
import { AreaDetalle } from './AreaDetalle';
import { EquipoDetalle } from './EquipoDetalle';
import type { OrganizacionNode } from './OrganizacionSection';
import { ColaboradorDetalle } from './ColaboradorDetalle';
import type { ColaboradorEquipoRow } from './ColaboradoresEquipoTable';
import styles from './ResultadosEvaluaciones.module.css';

const EMPRESA_OPTIONS = [
  { value: 'todas', label: 'Todas las Empresas' },
  { value: 'rex', label: 'Rex+ S.A.' },
];

const PROCESO_OPTIONS = [
  { value: '2025', label: 'Proceso 2025' },
  { value: '2024', label: 'Proceso 2024' },
];

const NIVEL_LABELS = ['Vista Empresa', 'Resultados Históricos'];

const AREA_LABELS = ['Comercial', 'Tecnología', 'RRHH', 'Finanzas', 'Operaciones'];

const KPIS = [
  { title: 'Total colaboradores', value: 300, linkLabel: 'Ver todos' },
  { title: 'Calif. General promedio', value: 85, valueSuffix: '/100' },
  { title: 'Calif. General por competencia', value: '78%' },
  { title: 'Calif. General por objetivos', value: '85%' },
  { title: 'Evaluación de potencial', value: '85%' },
  { title: 'Porcentaje de respuesta', value: '85%' },
];

function IconDownload() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v11M7.5 10.5L12 15l4.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Vista Empresa — Resultados de Evaluaciones (Rex+ Desempeño).
 * Fuente: Figma nodo 664:1239.
 */
export function ResultadosEvaluaciones() {
  const [empresa, setEmpresa] = useState('todas');
  const [proceso, setProceso] = useState('2025');
  const [comparar, setComparar] = useState(false);
  const [colaboradoresModal, setColaboradoresModal] = useState<{ title: string; filterNames?: string[] } | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedEquipo, setSelectedEquipo] = useState<OrganizacionNode | null>(null);
  const [selectedColaborador, setSelectedColaborador] = useState<ColaboradorEquipoRow | null>(null);

  const niveles = NIVEL_LABELS.map((label) => ({
    label,
    active: !selectedArea && label === 'Vista Empresa',
  }));
  const areas = AREA_LABELS.map((label) => ({ label, active: label === selectedArea }));

  return (
    <div className={styles.page}>
      <Megamenu />

      <div className={styles.breadcrumbWrap}>
        <Breadcrumb
          breadcrumb="/ Reportería / Resultados de Evaluaciones"
          title="Resultados de Evaluaciones"
          onBack={() => {
            if (selectedColaborador) setSelectedColaborador(null);
            else if (selectedEquipo) setSelectedEquipo(null);
            else if (selectedArea) setSelectedArea(null);
            else window.history.back();
          }}
        />
      </div>

      <div className={styles.contentArea}>
        <div className={styles.dashboardContent}>
          <div className={styles.controls}>
            <Selector
              label="Empresa"
              options={EMPRESA_OPTIONS}
              value={empresa}
              onChange={setEmpresa}
              style={{ width: '100%' }}
              className={styles.controlsSelector}
            />
            <Selector
              label="Proceso"
              options={PROCESO_OPTIONS}
              value={proceso}
              onChange={setProceso}
              style={{ width: '100%' }}
              className={styles.controlsSelector}
            />
            <Checkbox
              label="Comparar periodo anterior"
              checked={comparar}
              onChange={setComparar}
              className={styles.controlsCheckbox}
            />
          </div>

          <div className={styles.divider} />

          <div className={styles.body}>
            <SidebarNiveles
              niveles={niveles}
              areas={areas}
              onSelectNivel={(label) => {
                if (label === 'Vista Empresa') {
                  setSelectedArea(null);
                  setSelectedEquipo(null);
                  setSelectedColaborador(null);
                }
              }}
              onSelectArea={(label) => {
                setSelectedArea(label);
                setSelectedEquipo(null);
                setSelectedColaborador(null);
              }}
              className={styles.sidebar}
            />

            <div className={styles.indicadores}>
              {selectedColaborador ? (
                <ColaboradorDetalle row={selectedColaborador} />
              ) : selectedEquipo ? (
                <EquipoDetalle node={selectedEquipo} onSelectColaborador={setSelectedColaborador} />
              ) : selectedArea ? (
                <AreaDetalle
                  area={selectedArea}
                  onSelectEquipo={(node) => {
                    setSelectedEquipo(node);
                    setSelectedColaborador(null);
                  }}
                />
              ) : (
                <>
                  <div className={styles.dashboardTitleRow}>
                    <div className={styles.dashboardTitleGroup}>
                      <h2 className={styles.dashboardTitle}>Vista Empresa</h2>
                      <p className={styles.dashboardSubtitle}>Todas las Empresas → Proceso: 2025</p>
                    </div>
                    <button type="button" className={styles.downloadLink}>
                      <IconDownload />
                      Descargar
                    </button>
                  </div>

                  <div className={styles.kpiRow}>
                    {KPIS.map((kpi) => (
                      <IndicadorCard
                        key={kpi.title}
                        {...kpi}
                        onLinkClick={
                          kpi.title === 'Total colaboradores'
                            ? () => setColaboradoresModal({ title: 'Total colaboradores (300)' })
                            : undefined
                        }
                      />
                    ))}
                  </div>

                  <AmbitosEvaluacionSection onSelectGerencia={setSelectedArea} />

                  <Matriz9Box
                    onVerTodos={() => setColaboradoresModal({ title: 'Total colaboradores (300)' })}
                    onSelectColaborador={(persona: Matriz9BoxColaborador) => {
                      // Regla general: hacer clic en el nombre de cualquier colaborador
                      // navega directo a su Vista Colaborador, no a un listado.
                      const row = findColaboradorRowByName(persona.name);
                      if (row) setSelectedColaborador(toColaboradorEquipoRow(row));
                    }}
                    onVerParticipantes={(cell: Matriz9BoxCell) =>
                      setColaboradoresModal({
                        title: `${cell.label} (${cell.colaboradores?.length ?? 0})`,
                        filterNames: cell.colaboradores?.map((p) => p.name),
                      })
                    }
                  />

                  <DireccionesEvaluacionSection />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={colaboradoresModal !== null}
        onClose={() => setColaboradoresModal(null)}
        title={colaboradoresModal?.title ?? ''}
      >
        <ColaboradoresPanel
          filterNames={colaboradoresModal?.filterNames}
          onSelectRow={(row, key) => {
            // Regla general: hacer clic en el nombre de cualquier colaborador
            // navega a su Vista Colaborador y cierra este side-panel.
            if (key === 'nombre') {
              setColaboradoresModal(null);
              setSelectedColaborador(toColaboradorEquipoRow(row));
            }
          }}
        />
      </Modal>
    </div>
  );
}
