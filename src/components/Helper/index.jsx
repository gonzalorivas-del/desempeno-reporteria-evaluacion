import tokens from '../../tokens/tokens.json';
import styles from './Helper.module.css';

const c = tokens.colors;

/**
 * Helper — popover contextual para explicar términos, componentes o estados en contexto.
 *
 * @param {string}   [title]           Título de la ayuda (opcional). Color: auxiliar, centrado.
 * @param {string}   supportingText    Texto descriptivo principal. Color: blanco.
 * @param {string}   [cta]             Etiqueta del botón de acción al pie derecho.
 * @param {function} [onCta]           Callback al hacer clic en el CTA.
 * @param {'top'|'bottom'|'left'|'right'|'none'} [pointer='none']
 *                                     Posición del indicador de dirección.
 * @param {string}   [className]       Clase extra en el contenedor raíz.
 */
export function Helper({
  title,
  supportingText,
  cta,
  onCta,
  pointer = 'none',
  className,
}) {
  return (
    <div
      className={[styles.helper, className].filter(Boolean).join(' ')}
      role="tooltip"
      aria-label={title ?? 'Información contextual'}
    >
      {title && <p className={styles.title}>{title}</p>}
      <p className={styles.supporting}>{supportingText}</p>
      {cta && (
        <button
          type="button"
          className={styles.ctaBtn}
          onClick={onCta}
          aria-label={cta}
        >
          {cta}
        </button>
      )}
      {pointer !== 'none' && (
        <span
          className={`${styles.pointer} ${styles[`pointer_${pointer}`]}`}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
