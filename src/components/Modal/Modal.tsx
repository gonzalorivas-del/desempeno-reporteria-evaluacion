import { useEffect, type ReactNode } from 'react';
import styles from './Modal.module.css';

function IconClose() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export type ModalVariant = 'side-panel';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Título mostrado en la cabecera. Si se omite, el consumidor arma su propia cabecera en children. */
  title?: string;
  /** Variante estructural. Por ahora solo 'side-panel' está implementada. */
  variant?: ModalVariant;
  children: ReactNode;
  className?: string;
}

/**
 * Modal — Zafiro Design System (Rex+).
 * Fuente: Figma nodo 976:4834 ("Modal" — SidepanelTotalColaboradores).
 *
 * Solo la variante 'side-panel' está implementada. Las demás variantes descritas
 * en el manifest (default, success, alert, error, input, decision) quedan pendientes.
 */
export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className={styles.scrim} onClick={onClose} aria-hidden="true" />
      <div
        className={[styles.panel, className].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
              <IconClose />
            </button>
          </div>
        )}
        <div className={styles.body}>{children}</div>
      </div>
    </>
  );
}
