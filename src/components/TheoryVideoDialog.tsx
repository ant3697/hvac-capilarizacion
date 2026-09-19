import React from 'react';

interface TheoryVideoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTestBench?: () => void;
}

export const TheoryVideoDialog: React.FC<TheoryVideoDialogProps> = ({
  isOpen,
  onClose,
  onOpenTestBench,
}) => {
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
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Modern Dialog Box */}
      <div
        className="w-full max-w-[720px] bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[12px] shadow-[var(--shadow-medium)] font-inter text-[12px] text-[var(--text-primary)] my-4 overflow-hidden flex flex-col transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title Bar */}
        <div className="h-[46px] bg-[var(--bg-alt)] border-b border-[var(--border-subtle)] flex items-center justify-between px-4 text-[var(--text-primary)] font-condensed font-bold text-[15px] select-none shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-rounded text-[20px] text-[var(--accent-base)]">play_circle</span>
            <span>Base Teórica y Selección de Tubos Capilares</span>
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

        {/* Interior Container */}
        <div className="p-4 space-y-3.5 max-h-[82vh] overflow-y-auto">
          {/* Video Reference Banner 1 */}
          <div className="bg-[var(--bg-alt)]/50 border border-[var(--border-subtle)] rounded-[8px] p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-[16px]">
                ▶
              </div>
              <div>
                <div className="font-bold text-[13px] text-[var(--text-primary)]">
                  Vídeo de Selección: "Selección de tubos capilares para refrigeración"
                </div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  Criterios termodinámicos de taller, caudales de nitrógeno y rangos recomendados de longitud.
                </div>
              </div>
            </div>
            <a
              href="https://www.youtube.com/watch?v=KyyYoXEuyTQ"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-[var(--accent-base)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] rounded-[6px] font-semibold text-[11px] shrink-0 text-center flex items-center gap-1 shadow-xs transition-colors"
            >
              <span>Ver en YouTube</span>
              <span className="material-symbols-rounded text-[14px]">open_in_new</span>
            </a>
          </div>

          {/* Video Reference Banner 2: Capillarization */}
          <div className="bg-[var(--bg-alt)]/50 border border-[var(--border-subtle)] rounded-[8px] p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-[16px]">
                ▶
              </div>
              <div>
                <div className="font-bold text-[13px] text-[var(--text-primary)]">
                  Vídeo Práctico: "Cómo realizar una capilarización"
                </div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  Demostración paso a paso del procedimiento de capilarización en banco con nitrógeno seco.
                </div>
              </div>
            </div>
            <a
              href="https://www.youtube.com/watch?v=zvLUBG25TdI"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-[6px] font-semibold text-[11px] shrink-0 text-center flex items-center gap-1 shadow-xs transition-colors"
            >
              <span>Ver en YouTube</span>
              <span className="material-symbols-rounded text-[14px]">open_in_new</span>
            </a>
          </div>

          {/* Data Sheet Reference Banner */}
          <div className="bg-[var(--bg-alt)]/50 border border-[var(--border-subtle)] rounded-[8px] p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm text-[18px]">
                📄
              </div>
              <div>
                <div className="font-bold text-[13px] text-[var(--text-primary)]">
                  Ficha Técnica (Data Sheet) de Compresor: GS26TG
                </div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  Especificación de rendimiento, curvas de capacidad frigorífica R134a y condiciones de prueba.
                </div>
              </div>
            </div>
            <a
              href="https://lightcommercialrefrigeration.danfoss.com/pdf/danfoss_GS26TG_T_R134a_200_50.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] border border-[var(--border-default)] rounded-[6px] font-semibold text-[11px] shrink-0 text-center flex items-center gap-1 shadow-xs transition-colors"
            >
              <span>Descargar PDF</span>
              <span className="material-symbols-rounded text-[14px]">download</span>
            </a>
          </div>

          {/* 5 Golden Rules Content Area */}
          <div className="space-y-3 text-[12px] leading-relaxed">
            {/* Rule 1: Length Bounds */}
            <div className="bg-[var(--bg-alt)]/30 border border-[var(--border-default)] rounded-[8px] p-3 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-[var(--text-primary)] text-[13px] border-b border-[var(--border-subtle)] pb-1.5 mb-2">
                <span className="w-5 h-5 rounded-full bg-[var(--accent-base)] text-[var(--accent-text)] flex items-center justify-center text-[11px] font-bold">
                  1
                </span>
                <span>Regla de Longitud: Límite 1,50 m a 4,00 m (Óptimo 2,00 m - 3,00 m)</span>
              </div>
              <p className="text-[var(--text-secondary)] mb-2">
                En refrigeración práctica, la longitud elegida nunca debe ser arbitraria:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-[6px]">
                  <div className="font-bold text-rose-600 mb-1">❌ Menor a 1,50 m:</div>
                  <div className="text-[var(--text-secondary)]">
                    Expansión demasiado brusca, ruido de siseo ('chattering'), poco contacto térmico con la succión y riesgo de retorno de líquido al motocompresor.
                  </div>
                </div>
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-[6px]">
                  <div className="font-bold text-emerald-600 mb-1">✅ 2,00 m a 3,00 m (Ideal):</div>
                  <div className="text-[var(--text-secondary)]">
                    Zona dorada para taller frigorífico. Perfecta amortiguación de pulsaciones y excelente estabilidad de recalentamiento.
                  </div>
                </div>
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-[6px]">
                  <div className="font-bold text-amber-600 mb-1">⚠️ Mayor a 4,00 m:</div>
                  <div className="text-[var(--text-secondary)]">
                    Peligro de taponamiento por arrastre de impurezas o ceras de lubricante, caída excesiva y complejidad de enrollado.
                  </div>
                </div>
              </div>
            </div>

            {/* Rule 2: Flow Rate */}
            <div className="bg-[var(--bg-alt)]/30 border border-[var(--border-default)] rounded-[8px] p-3 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-[var(--text-primary)] text-[13px] border-b border-[var(--border-subtle)] pb-1.5 mb-2">
                <span className="w-5 h-5 rounded-full bg-[var(--accent-base)] text-[var(--accent-text)] flex items-center justify-center text-[11px] font-bold">
                  2
                </span>
                <span>Banco de Prueba con Nitrógeno a 10,0 bar (1,0 MPa)</span>
              </div>
              <p className="text-[var(--text-secondary)] mb-2">
                El tubo capilar es un orificio dosificador calibrado por fricción continua. Para homologarlo o ajustarlo en taller se conecta a un manorreductor de Nitrógeno seco con un caudalímetro:
              </p>
              <div className="p-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[6px] text-[11px] text-[var(--text-secondary)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span>
                  Presión diferencial de prueba: <strong>10,0 bar (1,0 MPa)</strong>. El caudal volumétrico obtenido en litros/minuto N₂ debe ser idéntico al valor calculado.
                </span>
                {onOpenTestBench && (
                  <button
                    type="button"
                    onClick={onOpenTestBench}
                    className="px-3 py-1 bg-[var(--accent-base)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] rounded-[4px] font-semibold shrink-0 cursor-pointer shadow-xs transition-colors"
                  >
                    Abrir Banco N₂ ↗
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-[var(--accent-base)] hover:bg-[var(--accent-hover)] text-[var(--accent-text)] rounded-[6px] font-semibold text-[13px] shadow-xs cursor-pointer transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
