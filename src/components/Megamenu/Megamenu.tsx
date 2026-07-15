import styles from './Megamenu.module.css';

/* ─── Íconos inline SVG (sistema Zafiro, 24×24 salvo indicado) ─────────── */

function IconGrid() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="1.6" fill="currentColor" />
      <circle cx="12" cy="6" r="1.6" fill="currentColor" />
      <circle cx="18" cy="6" r="1.6" fill="currentColor" />
      <circle cx="6" cy="12" r="1.6" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <circle cx="18" cy="12" r="1.6" fill="currentColor" />
      <circle cx="6" cy="18" r="1.6" fill="currentColor" />
      <circle cx="12" cy="18" r="1.6" fill="currentColor" />
      <circle cx="18" cy="18" r="1.6" fill="currentColor" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 20L15.8 15.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconChevronDown({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 9.5L12 15.5L18 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.5C9.5 3.5 7.5 5.5 7.5 8v3.4c0 .6-.24 1.18-.66 1.6L5.5 14.4c-.6.6-.18 1.6.66 1.6h11.68c.84 0 1.26-1 .66-1.6l-1.34-1.4a2.27 2.27 0 0 1-.66-1.6V8c0-2.5-2-4.5-4.5-4.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M10 18a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M12 3.5v2M12 18.5v2M4.4 6.4l1.4 1.4M18.2 16.2l1.4 1.4M3.5 12h2M18.5 12h2M4.4 17.6l1.4-1.4M18.2 7.8l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSimulator() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 15a8 8 0 1 1 16 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12 15L15.5 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="12" cy="15" r="1.2" fill="currentColor" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface MegamenuNavItem {
  label: string;
  active?: boolean;
}

export interface MegamenuProps {
  /** Nombre de la plataforma mostrado junto al logo. Default: 'Desempeño' */
  platformName?: string;
  /** Texto del badge de organización/tenant. Default: 'Rex+ QA' */
  tenantLabel?: string;
  /** Ítems del submenú de navegación de la plataforma */
  navItems?: MegamenuNavItem[];
  /** Iniciales mostradas en el avatar del usuario */
  userInitials?: string;
  /** Número de notificaciones sin leer. Omitir para no mostrar el badge */
  notificationCount?: number;
  className?: string;
}

const DEFAULT_NAV_ITEMS: MegamenuNavItem[] = [
  { label: 'Estructura organizacional' },
  { label: 'Desempeño', active: true },
  { label: 'Colaboradores' },
];

/**
 * Megamenu — barra de navegación superior de las plataformas Rex+ (Zafiro).
 * Fuente: Figma nodo 664:1240 (frame "1000 - Vista Empresa — Resultados de Evaluaciones").
 *
 * Estructura: fila de categoría de plataforma (logo, buscador, tenant, accesos
 * rápidos, notificaciones, avatar) + fila de subcategoría (navegación de sección
 * + acción "Nuevo proceso" + settings).
 */
export function Megamenu({
  platformName = 'Desempeño',
  tenantLabel = 'Rex+ QA',
  navItems = DEFAULT_NAV_ITEMS,
  userInitials = 'HH',
  notificationCount = 1,
  className,
}: MegamenuProps) {
  return (
    <header className={[styles.root, className].filter(Boolean).join(' ')}>
      {/* ─── Fila 1 — categoría de plataforma ─────────────────────────── */}
      <div className={styles.categoryBar}>
        <div className={styles.platformSearch}>
          <div className={styles.navPlatform}>
            <span className={styles.iconButton} aria-hidden="true"><IconGrid /></span>
            <span className={styles.divider} aria-hidden="true" />
            <div className={styles.logoGroup}>
              <span className={styles.logoMark} aria-hidden="true" />
              <span className={styles.logoText}>{platformName}</span>
            </div>
          </div>
          <button type="button" className={styles.searchButton}>
            <IconSearch />
            <span>Buscar</span>
          </button>
        </div>

        <div className={styles.tenantBadge}>
          <span>{tenantLabel}</span>
          <IconChevronDown />
        </div>

        <button type="button" className={styles.simulatorButton} aria-label="Simulador">
          <IconSimulator />
          <IconChevronDown />
        </button>

        <div className={styles.userGroup}>
          <button type="button" className={styles.notificationButton} aria-label="Notificaciones">
            <IconBell />
            {notificationCount > 0 && (
              <span className={styles.notificationBadge}>{notificationCount}</span>
            )}
          </button>

          <button type="button" className={styles.avatarButton}>
            <span className={styles.avatar}>{userInitials}</span>
            <IconChevronDown />
          </button>
        </div>
      </div>

      {/* ─── Fila 2 — subcategoría / navegación de sección ────────────── */}
      <div className={styles.subCategoryBar}>
        <nav className={styles.navList} aria-label="Secciones de Desempeño">
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={[styles.navItem, item.active ? styles.navItemActive : ''].filter(Boolean).join(' ')}
            >
              <span>{item.label}</span>
              <IconChevronDown />
            </button>
          ))}

          <button type="button" className={styles.newProcessBadge}>
            <span>Nuevo proceso</span>
            <IconPlus />
          </button>
        </nav>

        <button type="button" className={styles.settingsButton} aria-label="Configuración">
          <IconSettings />
          <IconChevronDown />
        </button>
      </div>
    </header>
  );
}
