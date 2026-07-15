import { useState } from 'react';
import { Button } from '../components/Button';
import { InputField } from '../components/InputField';
import { Selector, type SelectorOption } from '../components/Selector';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Snackbar, type SnackbarVariant } from '../components/Snackbar';
import { MenuPortal, type MenuPortalType } from '../components/MenuPortal';
import { ActivityMonitor } from '../components/ActivityMonitor';
import { DataTable, type DataTableColumn, type DataTableRow } from '../components/DataTable';
import styles from './ComponentsShowcase.module.css';
/* ─── Sample icons (inline SVG, sin dependencias externas) ──────────────── */

function IconStar() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7L8 1z"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="8" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="14" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M17 17c0-2.2-1.3-4.1-3.2-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconMoney() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2" y="5" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 10h.01M15 10h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 15l4-4 3 3 4-5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 17h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconNomina() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="4" y="3" width="20" height="22" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 9h10M9 13h10M9 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconPortal() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 24c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconBrain() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 3C4.3 3 3 4.3 3 6c0 .8.3 1.5.8 2-.5.5-.8 1.2-.8 2 0 1.7 1.3 3 3 3h5c1.7 0 3-1.3 3-3 0-.8-.3-1.5-.8-2 .5-.5.8-1.2.8-2 0-1.7-1.3-3-3-3H6z"
        stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 6v4M6.5 8h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Layout helpers ────────────────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  );
}

function Group({ label, children, column }: { label: string; children: React.ReactNode; column?: boolean }) {
  return (
    <div className={styles.group}>
      <span className={styles.groupLabel}>{label}</span>
      <div className={`${styles.groupItems} ${column ? styles.column : ''}`}>
        {children}
      </div>
    </div>
  );
}

/* ─── Snackbar interactive demo ─────────────────────────────────────────── */

type ActiveSnackbar = { id: number; variant: SnackbarVariant; message: string };

const SNACKBAR_DEMOS: { variant: SnackbarVariant; label: string; message: string }[] = [
  { variant: 'primary',   label: 'Primary',   message: 'Cambios guardados correctamente' },
  { variant: 'success',   label: 'Success',   message: 'Liquidación procesada con éxito' },
  { variant: 'alert',     label: 'Alert',     message: 'Revisa los datos antes de continuar' },
  { variant: 'error',     label: 'Error',     message: 'Error al procesar la solicitud' },
  { variant: 'important', label: 'Important', message: 'Nuevo módulo disponible en Rex+' },
];

let nextId = 1;

function SnackbarDemo() {
  const [active, setActive] = useState<ActiveSnackbar[]>([]);

  function fire(variant: SnackbarVariant, message: string) {
    const id = nextId++;
    setActive((prev) => [...prev.slice(-2), { id, variant, message }]);
  }

  function dismiss(id: number) {
    setActive((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <>
      {/* Trigger buttons */}
      <div className={styles.groupItems}>
        {SNACKBAR_DEMOS.map(({ variant, label, message }) => (
          <Button
            key={variant}
            variant="secondary"
            size="sm"
            onClick={() => fire(variant, message)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Live stack — bottom-right */}
      <div className={styles.snackbarStack}>
        {active.map((s) => (
          <Snackbar
            key={s.id}
            variant={s.variant}
            message={s.message}
            duration={4000}
            onClose={() => dismiss(s.id)}
          />
        ))}
      </div>
    </>
  );
}

/* ─── MenuPortal interactive demo ──────────────────────────────────────── */

const PORTAL_VARIANTS: { open: boolean; type: MenuPortalType; label: string }[] = [
  { open: true,  type: 'Supervisor',  label: 'Abierto / Supervisor'  },
  { open: true,  type: 'Colaborador', label: 'Abierto / Colaborador' },
  { open: false, type: 'Supervisor',  label: 'Cerrado / Supervisor'  },
  { open: false, type: 'Colaborador', label: 'Cerrado / Colaborador' },
];

function MenuPortalDemo() {
  const [open, setOpen] = useState(true);
  const [type, setType] = useState<MenuPortalType>('Supervisor');

  return (
    <>
      {/* Controls */}
      <div className={styles.menuPortalControls}>
        <div className={styles.menuPortalControlGroup}>
          <span className={styles.menuPortalControlLabel}>Tipo</span>
          <Button
            variant={type === 'Supervisor' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setType('Supervisor')}
          >
            Supervisor
          </Button>
          <Button
            variant={type === 'Colaborador' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setType('Colaborador')}
          >
            Colaborador
          </Button>
        </div>
        <div className={styles.menuPortalControlGroup}>
          <span className={styles.menuPortalControlLabel}>Estado</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? 'Colapsar menú' : 'Expandir menú'}
          </Button>
        </div>
      </div>

      {/* Preview */}
      <div className={styles.menuPortalPreviewBox}>
        <MenuPortal open={open} type={type} onToggle={() => setOpen((o) => !o)} />
      </div>
    </>
  );
}

/* ─── DataTable sample data & section ──────────────────────────────────── */

const DT_COLUMNS: DataTableColumn[] = [
  { key: 'select',   type: 'checkbox'    },
  { key: 'name',     title: 'Nombre',    type: 'avatar-text', sortable: true },
  { key: 'position', title: 'Cargo',     type: 'text',        sortable: true },
  { key: 'dept',     title: 'Área',      type: 'text',        sortable: true },
  { key: 'done',     title: 'Liquidado', type: 'check-icon'  },
  { key: 'progress', title: 'Avance',    type: 'progress'    },
  { key: 'actions',  type: 'actions'     },
];

const DT_ROWS: DataTableRow[] = [
  { id: 1, name: 'Ana Torres',      position: 'Analista RRHH',        dept: 'Recursos Humanos', done: true,  progress: 100 },
  { id: 2, name: 'Carlos Mora',     position: 'Jefe de Finanzas',     dept: 'Finanzas',         done: false, progress: 65  },
  { id: 3, name: 'Valeria Ríos',    position: 'Desarrolladora',       dept: 'Tecnología',       done: true,  progress: 100 },
  { id: 4, name: 'Diego Castillo',  position: 'Supervisor Nómina',    dept: 'Remuneraciones',   done: false, progress: 40  },
  { id: 5, name: 'Sofía Méndez',    position: 'Analista de Datos',    dept: 'Tecnología',       done: true,  progress: 80  },
  { id: 6, name: 'Martín Fuentes',  position: 'Gerente de Personas',  dept: 'Recursos Humanos', done: false, progress: 20  },
];

function DataTableSection() {
  const [page, setPage] = useState(1);
  return (
    <Section title="Data table">
      <Group label="Tabla con todas las variantes de columna">
        <DataTable
          columns={DT_COLUMNS}
          rows={DT_ROWS}
          total={DT_ROWS.length}
          currentPage={page}
          onPageChange={setPage}
        />
      </Group>
    </Section>
  );
}

/* ─── Showcase ──────────────────────────────────────────────────────────── */

const SELECTOR_OPTIONS: SelectorOption[] = [
  { value: 'indefinido',  label: 'Contrato indefinido'   },
  { value: 'plazo-fijo',  label: 'Contrato a plazo fijo' },
  { value: 'honorarios',  label: 'Honorarios'            },
  { value: 'practica',    label: 'Práctica profesional'  },
  { value: 'obra-faena',  label: 'Obra o faena'          },
];

export function ComponentsShowcase() {
  const [inputText, setInputText] = useState('');
  const [selectorValue, setSelectorValue] = useState('');
  const [selectorWithValue, setSelectorWithValue] = useState('indefinido');

  return (
    <div className={styles.page}>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <h1 className={styles.headerTitle}>Zafiro Design System</h1>
            <p className={styles.headerSub}>Rex+ · Componentes UI · v1.0.0</p>
          </div>
          <div className={styles.headerBadges}>
            <Badge variant="solid-primary" label="React 19" size="sm" />
            <Badge variant="solid-success" label="TypeScript" size="sm" />
          </div>
        </div>
      </header>

      <main className={styles.main}>

        {/* ── BUTTON ──────────────────────────────────────────────────── */}
        <Section title="Button">

          <Group label="Variantes — size md">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
            <Button variant="link">Link</Button>
            <Button variant="ia" icon={<IconBrain />}>Smart Rex</Button>
          </Group>

          <Group label="Tamaños — variant primary">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large CTA</Button>
          </Group>

          <Group label="Con ícono">
            <Button variant="primary" icon={<IconDownload />}>Descargar</Button>
            <Button variant="secondary" icon={<IconStar />} iconPosition="right">Favorito</Button>
            <Button variant="tertiary" icon={<IconDownload />} size="sm">Exportar</Button>
          </Group>

          <Group label="Estados">
            <Button variant="primary" loading>Procesando…</Button>
            <Button variant="secondary" loading>Cargando…</Button>
            <Button variant="primary" disabled>Deshabilitado</Button>
            <Button variant="secondary" disabled>Deshabilitado</Button>
            <Button variant="tertiary" disabled>Deshabilitado</Button>
          </Group>

        </Section>

        {/* ── INPUT FIELD ─────────────────────────────────────────────── */}
        <Section title="InputField">

          <Group label="Estados interactivos — haz clic en cada campo" column>
            <InputField
              label="Nombre completo"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              supportingText="Tal como aparece en el RUT"
            />
            <InputField
              label="Correo electrónico"
              defaultValue="juan.perez@rexmas.cl"
              supportingText="Con valor ingresado (filled)"
            />
          </Group>

          <Group label="Estados externos" column>
            <InputField
              label="Código de empleado"
              fieldState="success"
              defaultValue="EMP-00421"
              supportingText="Formato válido"
            />
            <InputField
              label="Período de nómina"
              fieldState="alert"
              defaultValue="Febrero 2026"
              supportingText="Período con diferencias detectadas"
            />
            <InputField
              label="RUT"
              fieldState="error"
              defaultValue="12.345.67"
              supportingText="El RUT ingresado no es válido"
            />
          </Group>

          <Group label="Disabled y Blocked" column>
            <InputField
              label="Campo deshabilitado"
              fieldState="disabled"
              defaultValue="Solo lectura"
              supportingText="No disponible en este contexto"
            />
            <InputField
              label="Campo bloqueado"
              fieldState="blocked"
              defaultValue="Valor bloqueado"
              supportingText="Modificación no permitida"
            />
          </Group>

        </Section>

        {/* ── SELECT ──────────────────────────────────────────────────── */}
        <Section title="Select">

          <Group label="Estados interactivos — haz clic para desplegar" column>
            <Selector
              label="Tipo de contrato"
              placeholder="Seleccionar"
              options={SELECTOR_OPTIONS}
              value={selectorValue}
              onChange={setSelectorValue}
              supportingText="Selecciona el tipo de contrato del colaborador"
            />
            <Selector
              label="Tipo de contrato"
              placeholder="Seleccionar"
              options={SELECTOR_OPTIONS}
              value={selectorWithValue}
              onChange={setSelectorWithValue}
              supportingText="Con valor seleccionado (active)"
            />
          </Group>

          <Group label="Estados de validación" column>
            <Selector
              label="Área"
              placeholder="Seleccionar"
              options={SELECTOR_OPTIONS}
              defaultValue="indefinido"
              fieldState="success"
              supportingText="Área registrada correctamente"
            />
            <Selector
              label="Período"
              placeholder="Seleccionar"
              options={SELECTOR_OPTIONS}
              defaultValue="plazo-fijo"
              fieldState="alert"
              supportingText="Período con diferencias detectadas"
            />
            <Selector
              label="Cargo"
              placeholder="Seleccionar"
              options={SELECTOR_OPTIONS}
              fieldState="error"
              supportingText="Debes seleccionar un cargo"
            />
          </Group>

          <Group label="Deshabilitado" column>
            <Selector
              label="Tipo de contrato"
              placeholder="Seleccionar"
              options={SELECTOR_OPTIONS}
              fieldState="disabled"
              supportingText="No disponible en este contexto"
            />
          </Group>

        </Section>

        {/* ── BADGE ───────────────────────────────────────────────────── */}
        <Section title="Badge">

          <Group label="Variantes — size md">
            <Badge variant="solid-success" label="Procesado" />
            <Badge variant="solid-error" label="Rechazado" />
            <Badge variant="solid-alert" label="Pendiente" />
            <Badge variant="solid-primary" label="Activo" />
          </Group>

          <Group label="Variantes — size sm">
            <Badge variant="solid-success" label="Aprobado" size="sm" />
            <Badge variant="solid-error" label="Error" size="sm" />
            <Badge variant="solid-alert" label="En revisión" size="sm" />
            <Badge variant="solid-primary" label="Vigente" size="sm" />
          </Group>

          <Group label="Uso en contexto de tabla">
            <div className={styles.tableDemo}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Colaborador</th>
                    <th>Cargo</th>
                    <th>Estado liquidación</th>
                    <th>Contrato</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Ana Torres</td>
                    <td>Analista RRHH</td>
                    <td><Badge variant="solid-success" label="Procesada" size="sm" /></td>
                    <td><Badge variant="solid-primary" label="Indefinido" size="sm" /></td>
                  </tr>
                  <tr>
                    <td>Carlos Mora</td>
                    <td>Jefe de Finanzas</td>
                    <td><Badge variant="solid-alert" label="Pendiente" size="sm" /></td>
                    <td><Badge variant="solid-primary" label="Indefinido" size="sm" /></td>
                  </tr>
                  <tr>
                    <td>Valeria Ríos</td>
                    <td>Desarrolladora</td>
                    <td><Badge variant="solid-error" label="Rechazada" size="sm" /></td>
                    <td><Badge variant="solid-alert" label="Plazo fijo" size="sm" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Group>

        </Section>

        {/* ── CARD ────────────────────────────────────────────────────── */}
        <Section title="Card">

          <Group label="default" column>
            <Card title="Información general">
              <p className={styles.cardDemoText}>
                Contenido libre. Úsala para agrupar cualquier tipo de información
                dentro de un contenedor con elevación.
              </p>
              <div className={styles.cardDemoActions}>
                <Button variant="tertiary" size="sm">Cancelar</Button>
                <Button variant="primary" size="sm">Guardar</Button>
              </div>
            </Card>
          </Group>

          <Group label="platform — acceso a plataformas Rex+">
            <div className={styles.cardGrid}>
              <Card
                variant="platform"
                logo={<IconNomina />}
                title="Nómina"
                description="Gestión de liquidaciones, pagos y cálculo de remuneraciones del período."
                ctaLabel="Ir a Nómina"
                onCtaClick={() => {}}
              />
              <Card
                variant="platform"
                logo={<IconPortal />}
                title="Portal Colaborador"
                description="Acceso del colaborador a sus documentos, vacaciones y datos personales."
                ctaLabel="Abrir portal"
                onCtaClick={() => {}}
              />
              <Card
                variant="platform"
                logo={<IconUsers />}
                title="Gestión de Personal"
                description="Organigrama, cargos, contratos y ficha de cada colaborador."
                ctaLabel="Ver personal"
                onCtaClick={() => {}}
              />
            </div>
          </Group>

          <Group label="kpi — métricas del dashboard">
            <div className={styles.cardGrid}>
              <Card
                variant="kpi"
                icon={<IconUsers />}
                title="Colaboradores activos"
                value="1.240"
                trend={3.5}
                trendLabel="vs mes anterior"
              />
              <Card
                variant="kpi"
                icon={<IconMoney />}
                title="Total remuneraciones"
                value="$284.6M"
                trend={-1.2}
                trendLabel="vs mes anterior"
              />
              <Card
                variant="kpi"
                icon={<IconChart />}
                title="Liquidaciones emitidas"
                value="1.198"
                trend={0}
                trendLabel="sin variación"
              />
            </div>
          </Group>

          <Group label="activity monitor — monitoreo de actividad">
            <div className={styles.cardGrid}>
              <ActivityMonitor labelText="Colaboradores" number="124" state="Default" />
              <ActivityMonitor labelText="Aprobados"     number="98"  state="Success" />
              <ActivityMonitor labelText="En revisión"   number="12"  state="Alert" />
              <ActivityMonitor labelText="Con error"     number="04"  state="Error" />
              <ActivityMonitor labelText="Importantes"   number="07"  state="Important" />
              <ActivityMonitor labelText="En proceso"    number="31"  state="Intermediate" />
            </div>
          </Group>

        </Section>

        {/* ── SNACKBAR ────────────────────────────────────────────────── */}
        <Section title="Snackbar">

          <Group label="Todas las variantes — estáticas">
            <div className={styles.snackbarList}>
              <Snackbar variant="primary"   message="Cambios guardados correctamente" duration={0} />
              <Snackbar variant="success"   message="Liquidación procesada con éxito" duration={0} />
              <Snackbar variant="alert"     message="Revisa los datos antes de continuar" duration={0} />
              <Snackbar variant="error"     message="Error al procesar la solicitud" duration={0} />
              <Snackbar variant="important" message="Nuevo módulo disponible en Rex+" duration={0} />
            </div>
          </Group>

          <Group label="Con botón de cierre — 4 seg auto-dismiss">
            <div className={styles.snackbarList}>
              <Snackbar variant="success" message="Archivo exportado correctamente" onClose={() => {}} />
              <Snackbar
                variant="primary"
                message="Informe listo para descargar"
                onClose={() => {}}
                action={{ label: 'Ver ahora', onClick: () => {} }}
              />
            </div>
          </Group>

          <Group label="Demo interactiva — dispara y auto-cierra">
            <SnackbarDemo />
          </Group>

        </Section>

        {/* ── DATA TABLE ──────────────────────────────────────────── */}
        <DataTableSection />

        {/* ── MEGAMENÚ PORTAL COLABORADOR ─────────────────────────── */}
        <Section title="Megamenú portal colaborador">

          <Group label="Demo interactiva — alterna tipo y estado con los controles">
            <MenuPortalDemo />
          </Group>

          <Group label="Todas las variantes — escala 50%">
            <div className={styles.menuPortalVariantsGrid}>
              {PORTAL_VARIANTS.map(({ open, type, label }) => (
                <div key={label} className={styles.menuPortalVariantItem}>
                  <div
                    className={styles.menuPortalScaleFrame}
                    style={{ width: (open ? 272 : 77) * 0.5, height: 1024 * 0.5 }}
                  >
                    <div className={styles.menuPortalScaleInner}>
                      <MenuPortal open={open} type={type} />
                    </div>
                  </div>
                  <span className={styles.menuPortalVariantLabel}>{label}</span>
                </div>
              ))}
            </div>
          </Group>

        </Section>

      </main>
    </div>
  );
}
