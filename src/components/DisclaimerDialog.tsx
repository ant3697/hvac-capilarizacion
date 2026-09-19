import React from 'react';

interface DisclaimerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisclaimerDialog: React.FC<DisclaimerDialogProps> = ({ isOpen, onClose }) => {
  React.useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-[460px] bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] shadow-[var(--shadow-medium)] font-inter text-[12px] text-[var(--text-primary)] overflow-hidden select-none transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="h-[46px] bg-[var(--bg-alt)] border-b border-[var(--border-subtle)] flex items-center justify-between px-4 text-[var(--text-primary)] font-condensed font-bold text-[15px]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-rounded text-[19px] text-[var(--accent-base)]">gavel</span>
            <span>Aviso Legal y Responsabilidad</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-[6px] hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center justify-center text-[16px] transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-3.5">
          <div className="bg-[var(--bg-alt)]/40 border border-[var(--border-subtle)] rounded-[8px] p-3 text-[12px] leading-relaxed text-[var(--text-secondary)]">
            <p className="font-semibold text-[var(--text-primary)] mb-1.5 flex items-center gap-1.5">
              <span className="material-symbols-rounded text-[16px] text-[var(--accent-base)]">info</span>
              <span>Descargo de Responsabilidad Técnica</span>
            </p>
            <p>
              Las dimensiones calculadas y los caudales equivalentes de nitrógeno se basan en formulaciones empíricas y condiciones estándar de trabajo de circuitos frigoríficos herméticos en el Sistema Internacional (S.I.).
              Representan un punto de partida inicial optimizado para el diseño, dimensionamiento y prototipado del sistema frigorífico.
            </p>
            <p className="mt-2.5">
              Los autores y desarrolladores del software no asumen responsabilidad legal alguna por daños directos, indirectos o derivados del uso o aplicación de los resultados proporcionados por esta herramienta de cálculo.
            </p>
            <p className="mt-2.5 text-[var(--text-muted)]">
              Se recomienda expresamente la comprobación práctica en banco con nitrógeno seco (10 bar) y el control de presiones y recalentamiento antes de homologar especificaciones para fabricación o sustitución definitiva.
            </p>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-1.5 bg-[var(--accent-base)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] rounded-[6px] font-semibold text-[13px] shadow-xs cursor-pointer transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
