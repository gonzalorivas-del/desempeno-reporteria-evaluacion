import { useState, useEffect, useRef } from 'react';
import tokens from '../../tokens/tokens.json';
import styles from './Filtro.module.css';

const c = tokens.colors;

/* ── Ícono filtro (src/assets/svg/Filter.svg) ──────────────────────────────── */
function FilterIcon({ color }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18 7L18 6L21 6C21.2652 6 21.5196 5.89464 21.7071 5.70711C21.8946 5.51957 22 5.26522 22 5C22 4.73478 21.8946 4.48043 21.7071 4.29289C21.5196 4.10536 21.2652 4 21 4L18 4L18 3C18 2.73478 17.8946 2.48043 17.7071 2.29289C17.5196 2.10536 17.2652 2 17 2C16.7348 2 16.4804 2.10536 16.2929 2.29289C16.1054 2.48043 16 2.73478 16 3L16 7C16 7.26522 16.1054 7.51957 16.2929 7.70711C16.4804 7.89464 16.7348 8 17 8C17.2652 8 17.5196 7.89464 17.7071 7.70711C17.8946 7.51957 18 7.26522 18 7ZM14 5C14 4.73478 13.8946 4.48043 13.7071 4.29289C13.5196 4.10536 13.2652 4 13 4L3 4C2.73478 4 2.48043 4.10536 2.29289 4.29289C2.10536 4.48043 2 4.73478 2 5C2 5.26522 2.10536 5.51957 2.29289 5.70711C2.48043 5.89464 2.73478 6 3 6L13 6C13.2652 6 13.5196 5.89464 13.7071 5.70711C13.8946 5.51957 14 5.26522 14 5ZM6 12C6 11.7348 5.89464 11.4804 5.70711 11.2929C5.51957 11.1054 5.26522 11 5 11L3 11C2.73478 11 2.48043 11.1054 2.29289 11.2929C2.10536 11.4804 2 11.7348 2 12C2 12.2652 2.10536 12.5196 2.29289 12.7071C2.48043 12.8946 2.73478 13 3 13L5 13C5.26522 13 5.51957 12.8946 5.70711 12.7071C5.89464 12.5196 6 12.2652 6 12ZM14 21L14 20L21 20C21.2652 20 21.5196 19.8946 21.7071 19.7071C21.8946 19.5196 22 19.2652 22 19C22 18.7348 21.8946 18.4804 21.7071 18.2929C21.5196 18.1054 21.2652 18 21 18L14 18L14 17C14 16.7348 13.8946 16.4804 13.7071 16.2929C13.5196 16.1054 13.2652 16 13 16C12.7348 16 12.4804 16.1054 12.2929 16.2929C12.1054 16.4804 12 16.7348 12 17L12 21C12 21.2652 12.1054 21.5196 12.2929 21.7071C12.4804 21.8946 12.7348 22 13 22C13.2652 22 13.5196 21.8946 13.7071 21.7071C13.8946 21.5196 14 21.2652 14 21ZM10 19C10 18.7348 9.89464 18.4804 9.70711 18.2929C9.51957 18.1054 9.26522 18 9 18L3 18C2.73478 18 2.48043 18.1054 2.29289 18.2929C2.10536 18.4804 2 18.7348 2 19C2 19.2652 2.10536 19.5196 2.29289 19.7071C2.48043 19.8946 2.73478 20 3 20L9 20C9.26522 20 9.51957 19.8946 9.70711 19.7071C9.89464 19.5196 10 19.2652 10 19ZM10 14L10 13L21 13C21.2652 13 21.5196 12.8946 21.7071 12.7071C21.8946 12.5196 22 12.2652 22 12C22 11.7348 21.8946 11.4804 21.7071 11.2929C21.5196 11.1054 21.2652 11 21 11L10 11L10 10C10 9.73478 9.89464 9.48043 9.70711 9.29289C9.51957 9.48043 8 9.73478 8 10L8 14C8 14.2652 8.10536 14.5196 8.29289 14.7071C8.48043 14.8946 8.73478 15 9 15C9.26522 15 9.51957 14.8946 9.70711 14.7071C9.89464 14.5196 10 14.2652 10 14Z"
        fill={color}
      />
    </svg>
  );
}

/* ── Ícono chevron (src/assets/svg/ChevronDown.svg) ────────────────────────── */
function ChevronIcon({ color, up = false }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={{ transform: up ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0 }}
    >
      <path
        d="M18.6072 8.37242C18.3583 8.13389 18.0217 8 17.6709 8C17.32 8 16.9834 8.13389 16.7346 8.37242L11.9668 12.9061L7.26542 8.37242C7.01659 8.13389 6.67999 8 6.32913 8C5.97827 8 5.64167 8.13389 5.39284 8.37242C5.26836 8.49148 5.16956 8.63312 5.10214 8.78919C5.03471 8.94525 5 9.11265 5 9.28171C5 9.45078 5.03471 9.61818 5.10214 9.77424C5.16956 9.93031 5.26836 10.072 5.39284 10.191L11.0239 15.6212C11.1473 15.7412 11.2942 15.8365 11.4561 15.9015C11.6179 15.9665 11.7915 16 11.9668 16C12.1421 16 12.3157 15.9665 12.4775 15.9015C12.6394 15.8365 12.7863 15.7412 12.9097 15.6212L18.6072 10.191C18.7316 10.072 18.8304 9.93031 18.8979 9.77424C18.9653 9.61818 19 9.45078 19 9.28171C19 9.11265 18.9653 8.94525 18.8979 8.78919C18.8304 8.63312 18.7316 8.49148 18.6072 8.37242Z"
        fill={color}
      />
    </svg>
  );
}

/**
 * Filtro — pill interactivo que al activarse despliega un panel flotante con ítems de filtro.
 * El panel usa position:absolute para flotar sobre el contenido sin desplazar el layout.
 *
 * @param {string}        [label='Filtros']        Texto del trigger
 * @param {FiltroField[]} [fields=[]]              Ítems: { key, label, value?, placeholder? }
 * @param {boolean}       [expanded]               Estado controlado
 * @param {boolean}       [defaultExpanded=false]  Estado inicial no controlado
 * @param {boolean}       [disabled=false]         Estado deshabilitado
 * @param {function}      [onToggle]               Callback al abrir/cerrar
 * @param {function}      [onFieldClick]           Callback al hacer clic en un ítem
 * @param {string}        [className]              Clase extra en el wrapper
 */
export function Filtro({
  label = 'Filtros',
  fields = [],
  expanded,
  defaultExpanded = false,
  disabled = false,
  onToggle,
  onFieldClick,
  className,
}) {
  const isControlled = expanded !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultExpanded);
  const open = isControlled ? expanded : internalOpen;
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        if (!isControlled) setInternalOpen(false);
        onToggle?.();
      }
    }
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open, isControlled, onToggle]);

  function handleToggle() {
    if (disabled) return;
    if (!isControlled) setInternalOpen((v) => !v);
    onToggle?.();
  }

  const iconColor   = disabled ? c['gris-deshabilitado'].$value : c.dash.$value;
  const chevColor   = disabled ? c['gris-deshabilitado'].$value : c.importante.$value;

  return (
    <div ref={wrapperRef} className={[styles.wrapper, className].filter(Boolean).join(' ')}>

      {/* Trigger — siempre en flujo normal, nunca desaparece */}
      <button
        type="button"
        className={[styles.trigger, open && styles.triggerOpen, disabled && styles.disabled].filter(Boolean).join(' ')}
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={label}
      >
        <FilterIcon color={open ? c.dash.$value : iconColor} />
        <span className={styles.triggerLabel}>{label}</span>
        <ChevronIcon color={open ? c.dash.$value : chevColor} up={open} />
      </button>

      {/* Panel — cubre el trigger desde top:0, flota sobre el contenido inferior */}
      {open && (
        <div className={styles.panel} role="dialog" aria-label={`Panel de ${label}`}>
          {/* Header: mismo aspecto que el trigger, cierra el panel al hacer clic */}
          <button
            type="button"
            className={styles.panelHeader}
            onClick={handleToggle}
            aria-label={`Cerrar panel de ${label}`}
          >
            <span className={styles.panelHeaderSpacer} aria-hidden="true" />
            <span className={styles.triggerLabel}>{label}</span>
            <ChevronIcon color={c.importante.$value} up />
          </button>

          {fields.length > 0 && (
            <ul className={styles.list} role="list">
              {fields.map((field) => (
                <li key={field.key} className={styles.listItem}>
                  <button
                    type="button"
                    className={styles.item}
                    onClick={(e) => onFieldClick?.(field.key, field, e)}
                    aria-label={field.label}
                  >
                    <div className={styles.itemContent}>
                      <span className={styles.itemValue}>{field.value || field.label}</span>
                    </div>
                    <ChevronIcon color={c.importante.$value} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
